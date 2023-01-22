const mongoose = require('mongoose');

var mobileSchema = new mongoose.Schema({
    number:{type:String},
});

// Custom validation for email


module.exports = mongoose.model('Mobile', mobileSchema);