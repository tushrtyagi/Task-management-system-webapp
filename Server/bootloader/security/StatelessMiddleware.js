/**
 * Stateless security
 * */

const crypto = require('crypto');

exports = module.exports = class StatelessMiddleware {

    constructor(app, cookie, generatorAlgo, generatorSecret, appendText) {
        this.cookie = cookie;
        this.generatorAlgo = generatorAlgo;
        this.generatorSecret = generatorSecret;
        this.appendText = appendText || '';
        app.use('/', this.tokenAuthCommon.bind(this));
        app.use('/', this.tokenTryAuth.bind(this));
    }

    tokenAuthCommon(req, res, next) {
        delete req.query._;
        let self = this,
            lazyUser;
        //TO LOGIN
        req['loginUser' + this.appendText] = user => {
            req['user' + self.appendText] = user;
            lazyUser = user;
            req['isAuthenticated' + self.appendText] = true;
            let token = self.encrypt(user);
            if (token instanceof Error) {
                return res.status(500).send(token);
            }
            req['token' + self.appendText] = token;
            if (self.cookie) {
                res.cookie(self.cookie, token, {
                    expires: new Date(+new Date() + 3600000)
                });
            }
        };
        req['genToken' + this.appendText] = user => {
            let token = self.encrypt(user);
            if (token instanceof Error) {
                console.log(token);
                return null;
            }
            return token;
        };
        req['parseToken' + this.appendText] = token => {
            token = token.trim().replace(/^Bearer /, '').trim();
            let session = this.decrypt(token);
            if (session instanceof Error) {
                return null;
            }
            return session;
        };
        req['getLazyUser' + this.appendText] = () => {
            return lazyUser;
        };
        //TO LOGOUT
        req['logout' + this.appendText] = () => {
            req['user' + self.appendText] = null;
            lazyUser = null;
            req['isAuthenticated' + self.appendText] = false;
            if (self.cookie) {
                res.cookie(self.cookie, '', {
                    expires: new Date(+new Date() - 3600000)
                });
            }
        };
        next();
    };

    _getTokenFromRequest(req) {
        let token =
            req.headers['authorization'] ||
            req.headers['Authorization'] ||
            req.query.token ||
            (this.cookie && req.cookies && req.cookies[this.cookie] || undefined) ||
            undefined;
        delete req.query.token;
        return token;
    }

    _processToken(req, res, next, token) {
        let self = this;
        token = token.trim().replace(/^Bearer /, '').trim();
        let session = this.decrypt(token);
        if (session instanceof Error) {
            return res.status(403).send('Invalid token defined');
        }
        req['user' + self.appendText] = session;
        req['isAuthenticated' + self.appendText] = true;
        if (this.cookie) {
            res.cookie(this.cookie, token, {
                expires: new Date(+new Date() + 3600000)
            });
        }
        return next();
    }

    tokenAuth(req, res, next) {
        let token = this._getTokenFromRequest(req);
        if (token) {
            this._processToken(req, res, next, token);
        } else {
            res.status(403).send({error: 'Forbidden'});
        }

    };

    tokenTryAuth(req, res, next) {
        let token = this._getTokenFromRequest(req);
        if (token) {
            this._processToken(req, res, next, token);
        } else {
            next();
        }
    };

    encrypt(data) {
        let json = JSON.stringify({payload: data});
        try {
            let cipher = crypto.createCipher(this.generatorAlgo, this.generatorSecret);
            return cipher.update(json, 'binary', 'hex') + cipher.final('hex');
        } catch (c) {
            return new Error(c);
        }
    }

    decrypt(cryptText) {
        let data = null;
        try {
            let decipher = crypto.createDecipher(this.generatorAlgo, this.generatorSecret);
            data = JSON.parse(decipher.update(cryptText, 'hex') + decipher.final());
        } catch (c) {
            c.message = "Unable to decode the cryptext. Tampered input! Or Invalid Secret! " + c.message;
            return new Error(c);
        }
        if (data && data.payload) {
            return data.payload;
        } else {
            return new Error("Unable to parse. Bad data or secret.");
        }
    }

    static enc(data) {
        let json = JSON.stringify({payload: data});
        try {
            let cipher = crypto.createCipher(_config.session.generatorAlgo, _config.session.generatorSecret);
            return cipher.update(json, 'binary', 'hex') + cipher.final('hex');
        } catch (c) {
            return new Error(c);
        }
    }

    static dec(cryptText) {
        let data = null;
        try {
            let decipher = crypto.createDecipher(_config.session.generatorAlgo, _config.session.generatorSecret);
            data = JSON.parse(decipher.update(cryptText, 'hex') + decipher.final());
        } catch (c) {
            c.message = "Unable to decode the cryptext. Tampered input! Or Invalid Secret! " + c.message;
            return new Error(c);
        }
        if (data && data.payload) {
            return data.payload;
        } else {
            return new Error("Unable to parse. Bad data or secret.");
        }
    }
}
