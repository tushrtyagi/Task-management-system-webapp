
class ListService {
    static async create(name,board_id){
        const list=await _db.List.create({name});
        const board=await _db.Board.findOne({_id: board_id});
        board.lists.push(list._id);
        await board.save();
        return list;
    }
    static async find(){
        const lists=await _db.List.find();
        return lists;
    }
}

exports=module.exports=ListService;