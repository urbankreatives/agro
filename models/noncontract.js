const mongoose = require('mongoose');


var growerSchema = new mongoose.Schema({
   

    growerNumber:{type:String},
    mobile:{type:String},
    barcodeNumber:{type:String},
    capturer:{type:String},
    center:{type:String},
    totalIncome:{type:Number},
    finalIncome:{type:Number},
    date: {type: Date, default:Date.now},
    date2:{type:String},
    type:{type:String}


});

// Custom validation for email


module.exports = mongoose.model('nonContract', growerSchema);