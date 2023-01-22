const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    role:{type:String,required:true},
    center:{type:String,required:true},
    growerNumber:{type:String,required:true},
    nonNumber:{type:Number, required:true},
    nonGrowerNumber:{type:String, required:true},
    lotNumber:{type:String, required:true},
    fullname:{type:String, required:true},
    prefix:{type:String, required:true},
    region:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
   
});

// Custom validation for email
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
  };
  
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);  
  };

module.exports = mongoose.model('User', userSchema);