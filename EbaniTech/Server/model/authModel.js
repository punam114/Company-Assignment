const mongoose = require('mongoose');

let authSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true,unique:true},
    password : {type : String , required : true},
    role : {type : String , enum : ["super admin","admin","user"], default:"user"},
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
        default : null
    }
},{timestamps : true})

let userModel = mongoose.model('User',authSchema);

module.exports = userModel;