const mongoose=require("mongoose")

const BmiSchema=mongoose.Schema({
    Bmi:Number,
    height:Number,
    weight:Number,
    username:String,
    email:String

})

const BmiModel=mongoose.model("bmi",BmiSchema)


module.exports={BmiModel}
