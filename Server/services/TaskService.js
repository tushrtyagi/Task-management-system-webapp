
class TaskService {
    static async create(name,assignedTo,list_id){
        const task=await _db.Task.create({name,assignedTo,list_id});
        const list=await _db.List.findOne({_id: list_id});
        list.tasks.push(task._id);
        await list.save();
        return task;
    }
    static async find(){
        const lists=await _db.Task.find();
        return lists;
    }
}

exports=module.exports=TaskService;