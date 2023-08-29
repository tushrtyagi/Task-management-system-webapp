const bcrpyt =require("bcrypt");

class UserService {

    static async create(name,email,password){
        const user=await _db.User.create({name,email,password});
        return user;
    }

    static async authenticate(email,password,req){
        if(req.isAuthenticated){
            const user=req.user;
            const isEqual=await bcrpyt.compare(password,user.password);
            if(user.email===email && isEqual){
                return user;
            }
        }
        const user=await _db.User.findOne({email});
        const isEqual=await bcrpyt.compare(password,user.password);
        if(isEqual){
            req.loginUser(user._doc);
            return user;
        }
        return null;
    }

    static async findOne(email){
        const user=await _db.User.findOne({email});
        return user;
    }
}

exports=module.exports=UserService;