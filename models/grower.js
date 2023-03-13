const mongoose = require('mongoose');


var growerSchema = new mongoose.Schema({
    growerNumber:{type:String,},
   fieldOfficer:{type:String},
    name: {type: String },
    surname: { type: String },
    fullname:{type:String},
    mobile: { type: String  },
    farm: {  type: String },
  
    id:{type:String},
    address:{type:String},
    sales:{type:Number},
    total:{type:Number},
    proceeds:{type:Number},
  batch:{type:Number},
  bales:{type:Number},
  buyingCenter:{type:String},
  buyingRegion:{type:String},
  lotNumber:{type:Number},


    type:{type:String, required:true},
});

// Custom validation for email


module.exports = mongoose.model('Grower', growerSchema);