const mongoose = require('mongoose');


var regionSchema = new mongoose.Schema({
   

    region1:{type:String},
    totalQty:{type:Number},
    totalMass:{type:Number},
    totalAmountSpent:{type:Number},
    contractMass:{type:Number},
    noncontractMass:{type:Number},
    contractQty:{type:Number},
    noncontractQty:{type:Number},
    contractAmountSpent:{type:Number},
    noncontractAmountSpent:{type:Number},
    prefix:{type:String, required:true},
    

   
   

});

// Custom validation for email


module.exports = mongoose.model('Region', regionSchema);