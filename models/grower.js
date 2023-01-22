const mongoose = require('mongoose');


var growerSchema = new mongoose.Schema({
    growerNumber:{type:String,},
   fieldOfficer:{type:String},
    name: {type: String },
    surname: { type: String },
    fullname:{type:String},
    mobile: { type: String  },
    farm: {  type: String },
    dateInputs: {  type: String,  },
    plantingDay: {  type: String },
    germinationDate: {  type: String },
    germination: {  type: String },
    weedControlStatus: {  type: String },
    cumulativeRainfall: {  type: String },
    dateOfVisit: {  type: String },
    id:{type:String},
    address:{type:String},
   /* seedQty:{type:String},
    seedAmount:{type:String},
    gchemQty:{type:String},
    herbQty:{type:String},
    herbAmount:{type:String},
    insurance:{type:String},
    gypQty:{type:String},
    gypAmount:{type:String},
    pestQty:{type:String},
    pestAmount:{type:String},*/
    total:{type:Number},
    proceeds:{type:Number},
  batch:{type:Number},
  bales:{type:Number},
  buyingCenter:{type:String},
  buyingRegion:{type:String},
  lotNumber:{type:Number},
  weedingDates:{type:String},
    pesticidesApplicationDates:{type:String},
    gypsumApplicationDates:{type:String},
    dateOfFirstFlowering:{type:String},
    countField:{type:String},
    pegField:{type:String},
    nodulation:{type:String},
    waterLogging:{type:String},
    estimates:{type:String},
    pests:{type:String},
    nodulation:{type:String},
    weedsStatus:{type:String},
    type:{type:String, required:true}

});

// Custom validation for email


module.exports = mongoose.model('Grower', growerSchema);