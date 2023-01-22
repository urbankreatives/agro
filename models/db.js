const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL ||'mongodb://localhost/growerDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true
} )

mongoose.connection.on('connected',()=>{
    console.log('Mongoose is connected!!!')
})

require('./grower');