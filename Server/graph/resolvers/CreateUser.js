const UserService = require('../../services/UserService');
const bcrypt =require("bcrypt");

class CreateUser {

    constructor(name,email,password){
        this.name=name;
        this.email=email;
        this.password=password;
    }

    async addUser(){
        const existingUser=await UserService.findOne(this.email);
        if(existingUser){
            throw new Error("User Already Existed");
        }
        const hash=await bcrypt.hash(this.password,12);
        const user=await UserService.create(this.name,this.email,hash);
        // console.log(user);
        return user;
    }

}

exports=module.exports=CreateUser;