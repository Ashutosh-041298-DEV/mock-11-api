const mongoose=require("mongoose")

const UserSchema=mongoose.Schema({
    email:String,
    password:String

})

const UsersModel=mongoose.model("user",UserSchema)


module.exports={UsersModel}
