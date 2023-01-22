var mongoose    =   require('mongoose');

var userSchema  =   new mongoose.Schema({
    name:{
        type:String
    },
    mobile:{
        type:Number
    }
});

module.exports = mongoose.model('user2',userSchema);