const mongoose = require('mongoose');


var growerSchema = new mongoose.Schema({
   

    growerNumber:{type:String},
    name:{type:String},
    lotNumber:{type:Number},
    surname:{type:String},
  
    lotNumber:{type:Number},
    mobile:{type:String},
    received:{type:String},
    flag:{type:String},
    barcodeNumber:{type:String},
    capturer:{type:String},
    center:{type:String},
    mass:{type:Number,required:true},
    newMass:{type:Number,required:true},
    date2:{type:String},
    date3:{type:String},
    position:{type:String},

 
    date: {type: Date, default:Date.now},
    date2:{type:String},
    type:{type:String}

});

// Custom validation for email


module.exports = mongoose.model('Receive', growerSchema);