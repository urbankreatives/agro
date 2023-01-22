const mongoose = require('mongoose');

var reconSchema = new mongoose.Schema({
    reconciling:{type:String,},
   unreconciling:{type:String},

});

// Custom validation for email


module.exports = mongoose.model('Recon', reconSchema);