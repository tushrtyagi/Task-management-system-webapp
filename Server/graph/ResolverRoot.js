const HealthResolver = require('./resolvers/HealthResolver');
const CreateUser=require("./resolvers/CreateUser");
const UserService = require("../services/UserService");
const BoardService=require("../services/BoardService");
const ListService=require("../services/ListService");
const TaskService=require("../services/TaskService");
const WithAuthResolver = require('./resolvers/WithAuthResolver');
const MutationWithAuthResolver = require('./resolvers/MutationWithAuthResolver');
const {enc, dec} = require('../bootloader/security/StatelessMiddleware');
const validator=require("validator");
const TaskList = require("../models/mongo/TaskList");

/**
 * The resolver root class
 * */
exports = module.exports = class ResolverRoot {

    async health() {
        return new HealthResolver();
    }

    async withAuth({token}, ctx) {
        //todo make work
        const user = await UserService.authenticate(ctx);
        if (!user) {
            ctx.forceResponseCode = 401;
            throw new Error('Invalid Auth Provided. Token not valid.');
        }
        return new WithAuthResolver(user, token);
    }

    async mutationWithAuth({token}, ctx) {
        const user = await UserService.authenticate(ctx);
        if (!user) {
            ctx.forceResponseCode = 401;
            throw new Error('Invalid Auth Provided. Token not Valid.');
        }
        return new MutationWithAuthResolver(user, token);
    }

    async createUser({userInput},ctx){
        const {name,email,password}=userInput;
        if(!validator.isEmail(email)){
            throw new Error("Invalid Email Address");
        }
        if(validator.isEmpty(password)){
            throw new Error("Password Field is empty");
        }
        const userObject=new CreateUser(name,email,password);

        const newUser=await userObject.addUser();
        ctx.loginUser(newUser._doc);
        return {...newUser._doc};
    }

    async loginUser({userInput},ctx){
        const {email,password}=userInput;
        if(!validator.isEmail(email)){
            throw new Error("Invalid Email Address");
        }
        if(validator.isEmpty(password)){
            throw new Error("Password Field is empty");
        }
        const user=await UserService.authenticate(email,password,ctx);
        if(!user){
            throw new Error('Invalid Auth Provided. Token not Valid.');
        }
        return user;
    }
    
    async createBoard({name}){
        if(validator.isEmpty(name)){
            throw new Error("Board Name is Empty");
        }
        const board=await BoardService.create(name);
        return board;
    }

    async createList({name,board_id}){
        if(validator.isEmpty(name)){
            throw new Error("List Name is Empty");
        }
        const List=await ListService.create(name,board_id);
        return List;
    }

    async createTask({name,assignedTo,list_id}){
        if(validator.isEmpty(name)){
            throw new Error("Task Name is Empty");
        }
        const Task=await TaskService.create(name,assignedTo,list_id);
        return Task;
    }

    async Lists(){
        const allList=await ListService.find();
        return allList;
    }

    async Boards(){
        const Board=await BoardService.find();
        const listArray = Board[0].lists;
        const lists=await _db.List.find({_id: { $in: listArray }}).populate("tasks");
        const taskArray=lists[0].tasks;
        console.log(lists);
        // const result=lists.map((task)=>{
        //     const newArray=task.tasks;
        //     console.log(newArray);
            
        // });
        const tasks=await _db.Task.find({_id:{$in:taskArray}});
        const res={...Board[0]._doc,lists};
        // console.log(res);

        return res;
    }

    async getTaskLists (){
        try {
          const taskLists = await TaskList.find();
          return taskLists;
        } catch (err) {
          throw err;
        }
      }
    
     async addTaskToList ({ listId, task }) {
        try {
          const taskList = await TaskList.findById(listId);
          if (!taskList) {
            throw new Error("Task list not found");
          }
    
          taskList.tasks.push(task);
          await taskList.save();
          return taskList;
        } catch (err) {
          throw err;
        }
      }
    
      async addBoard ({ boardName })  {
        try {
          const newTaskList = new TaskList({
            name: boardName,
            tasks: [],
          });
          await newTaskList.save();
          return newTaskList;
        } catch (err) {
          throw err;
        }
      }

    async Tasks(){
        const Tasks=await TaskService.find();
        return Tasks;
    }

    async constant({value}) {
        return value;
    }

    async enumOptions({name}) {
        try {
            const enm = require('../util/enums/' + name);
            return enm.values.map(v => ({
                key: v,
                val: v
            }));
        } catch (c) {
            log.error(c);
            throw new Error('Unknown or bad Enum');
        }
    }

    static get bean() {
        if (!ResolverRoot.instance) {
            ResolverRoot.instance = new ResolverRoot();
        }
        return ResolverRoot.instance;
    }
};
