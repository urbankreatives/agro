const mongoose = require('mongoose');


var growerSchema = new mongoose.Schema({
   

    growerNumber:{type:String},
    amount:{type:Number,required:true},
    initialOwing:{type:Number},
    lotNumber:{type:Number},
    mobile:{type:String},
    barcodeNumber:{type:String},
    capturer:{type:String},
    buyingCenter:{type:String},
    buyingRegion:{type:String},
    center:{type:String},
    fullname:{type:String,required:true},
    mass:{type:Number,required:true},
    newAmountOwing:{type:Number},
    batch:{type:Number,required:true},
    position:{type:String},
    bales:{type:Number,required:true},
    totalIncome:{type:Number},
    batchTotal:{type:Number},
    finalIncome:{type:Number},
    finalIncome2:{type:Number},
    remAmount:{type:Number},
    date: {type: Date, default:Date.now},
    date2:{type:String},
    type:{type:String},
    address:{type:String},
    nId:{type:String}

});

// Custom validation for email


module.exports = mongoose.model('Grower2', growerSchema);