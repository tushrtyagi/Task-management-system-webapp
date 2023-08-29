
class BoardService {
    static async create(name){
        const user=await _db.Board.create({name});
        return user;
    }

    static async find(){
        const lists=await _db.Board.find();
        return lists;
    }
}

exports=module.exports=BoardService;