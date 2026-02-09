const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true, unique:true},  
    password: {type: String, required:true},
    roles: {type:String , enum:["admin", "user"], default:"user"},   // enum means the value of the field must be one of the values in the array
       

}, {timestamps: true, strict:"throw"})


const UserModel = mongoose.model('User', UserSchema)     // User => collection name will be users

module.exports = UserModel