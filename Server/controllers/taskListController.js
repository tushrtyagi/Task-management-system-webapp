const Agendash = require('agendash');
const basicAuth = require('express-basic-auth');
const TaskList = require("..mongo/models/TaskList");
/**
 * For jobs server UI
 * */
exports = module.exports = class IndexController {

    constructor(router) {
        // config routes
        router.get("/tasklist", this.getAllTaskLists);
        router.post("/tasklist", this.createTaskList);
        log.info('Routed', this.constructor.name);
    }

    async indexPage(req, res){
        return res.render('index', {time: new Date()});
    }

async getAllTaskLists (req, res) {
    try {
      const taskLists = await TaskList.find();
      res.status(200).json(taskLists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task lists", error: error.message });
    }
  };
  
  async createTaskList (req, res) {
    const { name, tasks } = req.body;
    try {
      const newTaskList = new TaskList({
        name,
        tasks,
      });
      const savedTaskList = await newTaskList.save();
      res.status(201).json(savedTaskList);
    } catch (error) {
      res.status(500).json({ message: "Error creating task list", error: error.message });
    }
  };
};
