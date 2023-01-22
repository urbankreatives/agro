const mongoose = require('mongoose');


var centerSchema = new mongoose.Schema({
   

    center:{type:String},
    region:{type:String},
    totalQty:{type:Number},
    totalMass:{type:Number},
    totalAmountSpent:{type:Number},
    contractMass:{type:Number},
    noncontractMass:{type:Number},
    contractQty:{type:Number},
    noncontractQty:{type:Number},
    contractAmountSpent:{type:Number},
    noncontractAmountSpent:{type:Number},

   
   

});

// Custom validation for email


module.exports = mongoose.model('Center', centerSchema);