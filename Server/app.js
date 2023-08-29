// let there be colors
require('autostrip-json-comments');
require('colors');
const Logger = require('./bootloader/Logger');
const ConfigManager = require('./bootloader/ConfigManager');
const StatelessMiddleware = require('./bootloader/security/StatelessMiddleware');
const Bootstrap = require('./conf/Bootstrap');
const express = require('express');
const http = require('http');
const fs = require('fs');
const compression = require('compression');
const {join} = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Agenda = require('agenda');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const MainSocketController = require('./sockets/MainSocketController');

/**
 * Main App Class. Starting point.
 * */
new class App {
    constructor() {
        this.config = {};
        this.appBaseDir = __dirname;
        this.appEnv = process.env.NODE_ENV || 'development';
        this.addSafeReadOnlyGlobal('__env', this.appEnv);
        console.log('Initializing app...');
        this.boot().then(() => log.debug('App Loaded!'));
    }

    get port() {
        return this.config.port || process.env.NODE_PORT || process.env.PORT || 3030;
    }

    initLogger() {
        let logOnStdOut = this.config.logger.stdout.enabled;
        if (!logOnStdOut) console.log('[WARNING] >>>>>>>>>>>>>>>> STDOUT for logs is disabled!');
        this.addSafeReadOnlyGlobal('log', new Logger((message) => {
            if (logOnStdOut) {
                //Print on console the fully formatted message
                console.log(message.fullyFormattedMessage);
            }
        }, this.config.logger, this.appBaseDir));
    }

    async boot() {
        try {
            await this.initializeConfig();
            this.initLogger();
            await this.initExpressApp();
            await this.initialiseSecurity();
            await this.initModels();
            await this.initAgenda();
            await this.initControllers();
            await this.runBootstrap();
            await this.start();
        } catch (c) {
            log.error(c);
            process.exit(1);
        }
    }

    // Initialize config
    async initializeConfig() {
        let self = this;
        return new Promise((callback, rej) => {
            try {
                new ConfigManager({appBaseDir: this.appBaseDir, env: this.appEnv}, function (_config) {
                    self.config = _config;
                    self.addSafeReadOnlyGlobal('_config', _config);
                    callback();
                });
            } catch (c) {
                rej(c);
            }
        });
    }

    async initialiseSecurity() {
        // For Admin and API
        new StatelessMiddleware(
            this.app,
            '_aklpsk',
            this.config.session.generatorAlgo,
            this.config.session.generatorSecret,
            ''
        );
    }

    async initExpressApp() {
        this.app = express();
        this.app.use(bodyParser.json({
            verify: (req, res, buf) => {
                req.rawBody = buf;
            }
        }));
        this.app.use(cookieParser());
        this.app.use(cors({origin: true, credentials: true}));
        this.app.set('view engine', 'ejs');
        if (fs.existsSync(join(this.appBaseDir, 'web-app', 'dist'))) {
            console.log('[FRAMEWORK]'.bold.yellow, `Loading Vue App Dir: '${join(this.appBaseDir, 'web-app', 'dist').bold}'`.magenta);
            this.app.use(express.static(join(this.appBaseDir, 'web-app', 'dist')));
        } // vue app
        this.app.use(express.static('public'));
        // handle SPA routes, if not found on static, then only this middleware will run.
        // this.app.use((req, res, next) => {
        //     if (req.url.search(/api\//i) === -1) {
        //         fs.createReadStream(join(this.appBaseDir, 'public', 'index.html')).pipe(res);
        //     } else {
        //         next();
        //     }
        // });
        this.app.use(compression());
    }

    async initModels() {
        const list = fs.readdirSync(join(this.appBaseDir, 'models', 'mongo')),
            db = {};
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.search(/.js$/) !== -1) {
                let name = item.toString().replace(/\.js$/, '');
                let schema = require(join(this.appBaseDir, 'models', 'mongo', item));
                console.log('[FRAMEWORK]'.bold.yellow, `Loading Model: '${name.bold}'`.magenta, 'Connection:'.bold, schema.connection);
                let url = this.config[`mongoUrl${schema.connection}`];
                if (!url) throw new Error(`The connection used is ${schema.connection}, but no config variable with name ${('mongoUrl' + schema.connection).bold}`);
                db[name] = await schema.initialize(schema.connection, url);
            }
        }

        this.addSafeReadOnlyGlobal('_db', db);
    }

    async runBootstrap() {
        await new Bootstrap(this.app);
    }

    async initControllers() {
        const router = express.Router();
        try {
            let list = fs.readdirSync(join(this.appBaseDir, 'controllers'));
            list.forEach(item => {
                if (item.search(/.js$/) !== -1) {
                    let name = item.toString().replace(/\.js$/, '');
                    console.log('[FRAMEWORK]'.bold.yellow, `Loading Controller Module: '${name.bold}'`.magenta);
                    new (require(join(this.appBaseDir, 'controllers', item)))(router);
                }
            });
            this.app.use('/', router);
        } catch (err) {
            log.error(err);
        }
    }

    addSafeReadOnlyGlobal(prop, val) {
        console.log('[FRAMEWORK]'.bold.yellow, `Exporting safely '${prop.bold}' from ${this.constructor.name}`.cyan);
        Object.defineProperty(global, prop, {
            get: function () {
                return val;
            },
            set: function () {
                log.warn('You are trying to set the READONLY GLOBAL variable `', prop, '`. This is not permitted. Ignored!');
            }
        });
    }

    sendOnlineEvent() {
        if (process.send) {
            process.send({
                type: "server-running",
                pid: process.pid,
                env: this.appEnv,
                port: this.port,
                url: "http://127.0.0.1:" + this.port,
                file: process.argv[1],
                node: process.argv[0],
                workerId: 'xxxxx-xxxxxx'.replace(/x/g, a => (~~(Math.random() * 16)).toString(16))
            });
        }
    }

    get agenda() {
        if (!this._agenda) {
            this._agenda = new Agenda({
                db: {address: this.config.mongoUrlAgendaDB, collection: `agendaJobs_${this.appEnv}`},
                defaultConcurrency: 1,
                defaultLockLifetime: 10000
            });
            this.addSafeReadOnlyGlobal('_agenda', this._agenda);
        }
        return this._agenda;
    }

    async initAgenda() {
        log.debug('[FRAMEWORK] Initializing the agenda module...');
        const agenda = this.agenda;
        const jobDefs = fs.readdirSync(join(__dirname, 'jobs'));
        // async to promise wrapper
        await new Promise((res, rej) => {
            agenda.on('ready', () => {
                log.debug('[AGENDA] Is Ready!');
                jobDefs.forEach(jobDef => {
                    let name = jobDef.toString().replace(/\.js$/, '');
                    const job = require(join(__dirname, 'jobs', jobDef.toString()));
                    agenda.define(name, {
                        priority: job.priority,
                        concurrency: job.concurrency
                    }, async agendaJob => await job.task.call(job, agendaJob));
                    agenda.every(job.trigger, name);
                });
                agenda.start();
                res();
            });
            agenda.on('error', err => rej(err));
        });
    }

    async start() {
        let server = http.createServer(this.app);
        const io = new socketIo.Server(server);
        new MainSocketController(io);
        server.listen(this.port);
        return new Promise((res, rej) => {
            server.on('listening', () => {
                let addr = server.address();
                let bind = typeof addr === 'string'
                    ? 'pipe ' + addr
                    : 'port ' + addr.port;
                log.debug('Listening on ' + bind);
                this.sendOnlineEvent();
                res();
            });
        });
    }
};
