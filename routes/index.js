require('dotenv').config();
require('../config5/keys')
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Grower = require('../models/grower')
var Grower2 = require('../models/grower2')
const User =require('../models/user')
const Region = require('../models/region')
var passport = require('passport')
const Vonage = require('@vonage/server-sdk')
const nonContract = require('../models/noncontract')
var xlsx = require('xlsx')
var multer = require('multer')
var moment = require('moment')
var nodemailer = require('nodemailer');
const fs = require('fs')
var path = require('path');
var Receive = require('../models/receive')
var Mobile = require('../models/mobile')
const USB = require("webusb").USB;
const Center = require('../models/center')
const accountSid = 'ACacb1e653e4ada35eb9ba8292ae270059'; 
const authToken = '1aa69aedddd9dca569561258f790e055'; 
const client = require('twilio')(accountSid, authToken);
const alphanumeric_id = "Golden Foods"; 
var bcrypt = require('bcrypt-nodejs');


var storage = multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,'./public/uploads/')
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
})



var upload = multer({
  storage:storage
})




router.get('/', function (req, res, next) {
  var messages = req.flash('error');
  res.render('users/login', { messages: messages, hasErrors: messages.length > 0});
});
router.post('/', passport.authenticate('local.signin', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res, next) {
 
      res.redirect('/dash');
  
});



router.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



router.get('/fix',isLoggedIn,function(req,res){
  var id = req.user._id
 var readonly
 var prefix 
   User.find({_id:id},function(err,noc){
     if(noc[0].prefix == 'null'){
       console.log('good')
       readonly = '';
     }else{
     readonly = 'readonly'
     prefix = noc[0].prefix
     region = noc[0].region
     }
 
     res.render('users/fix',{readonly:readonly,prefix:prefix,region:region})
   })    
 })
 
 router.post('/fix',isLoggedIn,function(req,res){
  
 var prefix = req.body.prefix
 var region = req.body.region
 var id = req.user._id
   req.check('prefix','Enter Prefix').notEmpty().isString();
  
      
   var errors = req.validationErrors();
       if (errors) {
 
         req.session.errors = errors;
         req.session.success = false;
         res.render('users/fix',{user:req.body, errors:req.session.errors,
     })
   }
 
 
   User.findByIdAndUpdate(id,{$set:{prefix:prefix,region:region}},function(err,docs){
     res.redirect('/fix')
   })
 
 
 })




//add teachers


router.get('/addUser',function(req,res){
 var pro = req.user





res.render('admit',)
})

router.post('/addUser', function(req,res){
 var m = moment()
                 var year = m.format('YYYY')
                 var name = req.body.name
                 var surname = req.body.surname
                 var fullname = name+" "+surname
                 var email = req.body.email
                 var region = 'MashWest'
                 var mobile = req.body.mobile
                 var password = req.body.password
                 var pro = req.user
               
               req.check('name','Enter Name').notEmpty();
               req.check('surname','Enter Surname').notEmpty();
    
               req.check('email','Enter email').notEmpty().isEmail();
   
               req.check('mobile', 'Enter Phone Number').notEmpty();
               req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                   
               
                     
                  
               var errors = req.validationErrors();
                   if (errors) {
                   
                   
                     req.session.errors = errors;
                     req.session.success = false;
                     res.render('admit',{ errors:req.session.errors,})
                    
                   
                 }
                 else
               
                {
                   User.findOne({'email':email, })
                   .then(user =>{
                       if(user){ 
                     // req.session.errors = errors
                     
                      req.session.message = {
                        type:'errors',
                        message:'email already in use'
                      }     
                      
                         res.render('admit', {
                             message:req.session.message,  }) 
                         
                       
                 }
                 
                               else  {   
              

                 
                 var user = new User();
                 user.name = name
                 user.surname = surname
                 user.role = 'Field Officer'
                 user.mobile = mobile
                 user.center = 'null'
                 user.growerNumber = 'null'
                 user.nonNumber = 100
                 user.nonGrowerNumber = 'null'
                 user.lotNumber=1
                 user.fullname = fullname
                 user.prefix = 'MC'
                 user.region = 'MashWest'
                 user.email = email
                 user.password = user.encryptPassword(password)


                 
                  
             
                  
         
                 user.save()
                   .then(user =>{
                   /*  const CLIENT_URL = 'http://' + req.headers.host;
     
                     const output = `
                     <h2>Please click on below link to activate your account</h2>
                     <a href="${CLIENT_URL}/">click here to login</a>
                     <h1> User credentials</h1>
                     <p>userID:${email}</p>
                     <p>password:${password}</p>
                     <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
                     `;
               
                    
                     const transporter = nodemailer.createTransport({
                       service: 'gmail',
                       auth: {
                           user: "cashreq00@gmail.com",
                           pass: "itzgkkqtmchvciik",
                       },
                     });
                     
               
                     // send mail with defined transport object
                     const mailOptions = {
                         from: '"Admin" <cashreq00@gmail.com>', // sender address
                         to: email, // list of receivers
                         subject: "Account Verification ✔", // Subject line
                         html: output, // html body
                     };
               
                   transporter.sendMail(mailOptions, (error, info) => {
                         if (error) {
                           console.log(error)
                          
                      req.session.message = {
                        type:'errors',
                        message:'confirmation emails not sent'
                      }
                      
                      res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                  
                   
                         }
                         else {
                             console.log('Mail sent : %s', info.response);
                             idNumber++
                          
                        
         
                             req.session.message = {
                               type:'success',
                               message:'confirmation emails sent'
                             }     
                             
                             res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                           
                         }
                     
             
                   
                     
                     
                     //
                    
                  
                 })*/
                 res.redirect('/addUser')

               })   
               }

                   })
                 }
             
                
               
                   
                   
               
                
                 

                 
})

router.get('/txt77',isLoggedIn,function(req,res){
res.render('text9')
})


router.post('/txt77',isLoggedIn,function(req,res){
  const accountSid = 'ACdc7e8259a058658c7fa252b15bdf64ff'; 
const authToken = '62f188ebfa4767ed29ca1671d75e6c71'; 
const client = require('twilio')(accountSid, authToken); 
const alphanumeric_id = "Agrozoid"; 
 
client.messages 
      .create({  
        
         to: '+263781165357' ,
         messagingServiceSid: 'MG0801c66cce322926a94802f3429a393b', 
         body: req.body.name
       }) 
      .then(message => console.log(message.sid)) 
      .done();
})

/*
router.post('/txt77',isLoggedIn,function(req,res){
const accountSid = 'ACdc7e8259a058658c7fa252b15bdf64ff'; 
const authToken = '62f188ebfa4767ed29ca1671d75e6c71'; 
const client = require('twilio')(accountSid, authToken);
const alphanumeric_id = "Golden Foods"; 
 
client.messages 
      .create({     
        
         to: '+263781165357',
         body: req.body.name
       }) 
      .then(message => console.log(message.sid)) 
      .done();
})
*/
//twilio code
//ZtWEAMGGUdKYe5F6uBv_Pdkd0WoD3PAgcJClAvOz


//enter grower bales for contracted growers
router.get('/batchContract',isLoggedIn,  function(req,res){
res.render('contract/batchContract')
})




router.post('/batchContract',isLoggedIn,  function(req,res){
var bales = req.body.bales;
var growerNumber = req.body.growerNumber;
var center = req.body.center
var region = req.body.region
var id


req.check('bales','Enter Number of Bales').isNumeric();
req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('center','Enter Buying Center').notEmpty();





var errors = req.validationErrors();
 
if (errors) {
  req.session.errors = errors;
  req.session.success = false;
  res.render('contract/batchContract',{ errors:req.session.errors,user:req.user, use:req.body})

}

else 

Grower.findOne({'growerNumber':growerNumber})
.then(grower =>{

  
    Grower.find({growerNumber:growerNumber},function(err,doc){
      id = doc[0]._id
      console.log(id)
      Grower.findByIdAndUpdate(id,{$set:{bales:bales}},function(err,loc){
        var uid = req.user._id
          User.findByIdAndUpdate(uid,{$set:{growerNumber:growerNumber}}, function(rr,coc){
          console.log(uid)
          Grower.findByIdAndUpdate(id,{$set:{buyingCenter:center, buyingRegion:region}},function(err,loc){
          
          })
        
           
          })
          
      })
     
      res.redirect('/buy')
      
  })


})


})








// buying from contracted farmers
router.get('/buy',isLoggedIn, function(req,res){
var id = req.user._id;
console.log('ID',id)
User.find({_id:id},function(err,locs){
console.log(locs[0].growerNumber)
  if(locs[0].growerNumber == 'null'){
    res.redirect('/batchContract')
  }else
  var growerNumber =locs[0].growerNumber
  Grower.find({growerNumber:growerNumber},function(err,docs){
res.render('contract/buyContract',{user:docs[0], use:req.user})
  })
})
})










router.post('/buy',isLoggedIn, function(req,res){
var barcodeNumber = req.body.barcodeNumber
var total, total1
var arr = []
console.log('region', req.body.buyingRegion)
var arr1 = []
console.log(barcodeNumber)
var growerNumber=req.body.growerNumber
var proceeds;
var newAmount;
var cet;
var lot = req.body.lotNumber;
var vbales;
var nbales = req.body.bales;
var vbatch = req.body.batch;
var newBatch;
var newId, newTotal, finalIncome2;

var ntotal =  req.body.total
const accountSid = 'ACdc7e8259a058658c7fa252b15bdf64ff'; 
const authToken = '62f188ebfa4767ed29ca1671d75e6c71'; 
const client = require('twilio')(accountSid, authToken); 
const alphanumeric_id = "Agrozoid"; 


req.check('barcodeNumber','Capture Barcode').notEmpty();
req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('total','Enter Amount Owing').notEmpty();
req.check('lotNumber','Enter lotNumber').notEmpty();
req.check('mass','Enter Mass').notEmpty();




var errors = req.validationErrors();

if (errors ) {
req.session.errors = errors;
req.session.success = false;
res.render('contract/buyContract',{ errors:req.session.errors, user:req.user, use:req.body})

req.session.message = null;


}
else 

{
Grower2.findOne({'barcodeNumber':barcodeNumber})
.then(grower =>{
    if(grower){ 
  // req.session.errors = errors
    //req.success.user = false;
   req.session.message = {
     type:'errors',
     message:'barcode already in use'
   }    
   Grower.find({growerNumber:growerNumber},function(err,docs){ 
      res.render('contract/buyContract', {
         message:req.session.message ,user:docs[0],use:req.body
      })
    })
    }else



var grower = new Grower2();
grower.fullname = req.body.name +" "+ req.body.surname;
grower.growerNumber = req.body.growerNumber;
grower.barcodeNumber = req.body.barcodeNumber;
grower.amount = req.body.total;
grower.newAmountOwing = 0;
grower.lotNumber = req.body.lotNumber;
grower.buyingCenter = req.body.buyingCenter;
grower.buyingRegion =  req.body.buyingRegion;
grower.finalIncome = 0;
grower.finalIncome2 = 0;
proceeds = req.body.mass * req.body.price;
grower.totalIncome = req.body.price * req.body.mass;
grower.capturer = req.user.name;
grower.center = req.user.center;
grower.mass = req.body.mass;
grower.position = "Not Set";
grower.bales = req.body.bales;
grower.batch = req.body.batch;

grower.type = 'contract'
grower.save()
.then(grower =>{


//record to filter to update recently saved voucher/grower2 with current lot
Grower2.find({growerNumber:growerNumber,batch:vbatch},function(err,docs){
//updating each voucher of the same batch & grower number with new income earned from new lot
for(var i = 0;i<docs.length; i++){
arr.push(docs[i].totalIncome)
}
//adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
 total=0;
for(var i in arr) { total += arr[i]; }

//subtracting total income from amount owing
finalIncome2 = total - ntotal;


 
//updating each lot, finalIncome - totalIncome of all lots,  finalIncome2 - amount remaining from subtracting totalIncome from amount owing
for(var x = 0;x<docs.length;x++){
Grower2.findByIdAndUpdate(docs[x],{$set:{finalIncome:total, finalIncome2:finalIncome2}},function(err,locs){
     
 
  })
}
Grower.find({growerNumber:growerNumber},function(err,socs){
  
  id = socs[0]._id;
  newAmount = socs[0].total  -  proceeds;

   //if amount owing is less than 0 then the grower debt is cleared to 0 
   if (newAmount <  0){
    Grower.findByIdAndUpdate(id,{$set:{total: 0,proceeds:total}},function(err,tricks){
     
    })
  }else
  //else the amount owing is updating to the new amount owed
       Grower.findByIdAndUpdate(id,{$set:{total: newAmount,proceeds:total}},function(err,tricks){
   
        Grower2.find({barcodeNumber:barcodeNumber},function(err,flint){
        
            cet = flint[0]._id;
            //if the debt is cleared, the current voucher amount owing will be updated to zero
            if(newAmount < 0){
             Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:0}},function(err,lith){


             })
            }

            else
         Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:newAmount}},function(err,slith){
          

         })
        
              
          
         if(nbales == lot){
                   

          Grower2.find({growerNumber:growerNumber,batch:vbatch,lotNumber:lot},function(err,smocs){
            console.log('waddi',smocs[0]._id)
     
            spos = smocs[0]._id;
      
          Grower2.findByIdAndUpdate(spos,{$set:{position:'last'}},function(err,sgocs){

           
                     var newLot

                     Grower.find({growerNumber:growerNumber},function(err,sfocs){
                      
                        newId = sfocs[0]._id
                        newLot =sfocs[0].lotNumber + 1
                        console.log('newId',newId)
                      newBatch =  sfocs[0].batch + 1;
                      console.log('new',newBatch)
                      var cId = req.user._id;
                      Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch,bales:0, lotNumber:1, proceeds:0}},function(err,sresult){
                        User.findByIdAndUpdate(cId,{$set:{growerNumber:"null"}},function(err,bbds){

                          client.messages 
                          .create({     
                           
         to: '+263781165357' ,
         messagingServiceSid: 'MG0801c66cce322926a94802f3429a393b', 
                             body: 'Grower Number  ' +"  "+ growerNumber +"  "+ 'sales proceeds for ' + nbales +  " bags   "  + " amount: "+"  "+ '$'+ total
                           }) 
                          .then(message => console.log(message.sid)) 
                          .done();

                        })
                      })
                     



                      })
              


          })
        })
        res.redirect('/batchContract')
      }
      
else{
Grower.find({growerNumber:growerNumber},function(err,los){

  var xId = los[0]._id;
  var xLot = los[0].lotNumber + 1;
  console.log('lotNumber',xLot)
console.log('userIdX',xId)
  Grower.findByIdAndUpdate(xId,{$set:{ lotNumber:xLot}},function(err,sresult){
   /* client.messages 
    .create({     
     messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
       to: '+263771446827',
       body: 'sales proceeds for barcode number: '+" "+ barcodeNumber +"    " +"amount: "+"  "+ '$'+proceeds
     }) 
    .then(message => console.log(message.sid)) 
    .done();*/


  })
 
})


res.redirect('/buy')

}
         
            
            })

          })



 })
})









})


  })


}


  



})




//grower bales for noncontracted farmers
router.get('/batchNonContract',isLoggedIn,  function(req,res){
res.render('noncontract/batchNonContract')
})

router.post('/batchNonContract',isLoggedIn,  function(req,res){
var bales = req.body.bales;
var growerNumber = req.body.growerNumber;
var center = req.body.center
var region = req.body.region
var id


req.check('bales','Enter Number of Bales').isNumeric();
req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('center','Enter Buying Center').notEmpty();





var errors = req.validationErrors();
 
if (errors) {
  req.session.errors = errors;
  req.session.success = false;
  res.render('noncontract/batchNonContract',{ errors:req.session.errors,user:req.user, use:req.body})

}

else 

Grower.findOne({'growerNumber':growerNumber})
.then(grower =>{

  
    Grower.find({growerNumber:growerNumber},function(err,doc){
      id = doc[0]._id
      console.log(id)
      Grower.findByIdAndUpdate(id,{$set:{bales:bales}},function(err,loc){
        var uid = req.user._id
          User.findByIdAndUpdate(uid,{$set:{growerNumber:growerNumber}}, function(rr,coc){
          console.log(uid)
          Grower.findByIdAndUpdate(id,{$set:{buyingCenter:center, buyingRegion:region}},function(err,loc){
          
          })
        
           
          })
          
      })
     
      res.redirect('/buyNoncontract')
      
  })


})

})

//registering noncontract 
router.get('/noncontract2',isLoggedIn,function(req,res){
res.redirect('/registerNonContract')
})

//registering non contract farmer
router.get('/registerNonContract',isLoggedIn,function(req,res){
var prefix = req.user.prefix
if(prefix == 'null'){
  res.redirect('/fix')
}else
var id6 = req.user.nonNumber;
  uidx = prefix+id6;
  res.render('noncontract/registerNonContract', { uid:uidx,user:req.user
});
})


router.post('/registerNonContract',isLoggedIn,function(req,res){
var prefix = req.user.prefix
var id6 = req.user.nonNumber;
var uidx
var gId = req.user._id;
var number = req.user.nonNumber;
var growerNumber = req.body.growerNumber


req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('name','Enter Name').notEmpty();
req.check('surname','Enter Surname').notEmpty();
req.check('mobile','Enter Mobile').notEmpty();
req.check('id','Enter ID').notEmpty();
req.check('center','Enter Center').notEmpty();
req.check('bales','Enter Bales').notEmpty();


var errors = req.validationErrors();

if (errors) {

uidx = prefix+id6;
req.session.errors = errors;
req.session.success = false;
res.render('noncontract/registerNonContract',{ errors:req.session.errors,uid:uidx,user:req.user, use:req.body})

}


{
Grower.findOne({'growerNumber':growerNumber})
  .then(grower =>{
      if(grower){ 
    // req.session.errors = errors
      //req.success.user = false;
     req.session.message = {
       type:'errors',
       message:'growerNumber already in use'
     }     
        res.render('noncontract/registerNonContract', {
           message:req.session.message ,user:req.user,use:req.body,uid:uidx
        }) 
  
      }
      else 
  
  var grow = new Grower();
  grow.growerNumber= req.body.growerNumber;
  grow.name = req.body.name;
  grow.surname = req.body.surname;
  grow.fullname = req.body.name +" "+ req.body.surname;
  grow.mobile = req.body.mobile;
  grow.region = req.body.region;
  grow.dateInputs = 'Not Set';
  grow.plantingDay = 'Not Set';
  grow.germinationDate ='Not Set';
  grow.germination = 'Not Set';
  grow.weedControlStatus = 'Not Set';
  grow.cumulativeRainfall = 'Not Set';
  grow.dateOfVisit = 'Not Set';
  grow.id = req.body.id;
  grow.address = req.body.address;
  grow.buyingCenter = req.body.center;
  grow.buyingRegion = req.body.region;
 /* grow.seedQty = 'Not Set';
  grow.seedAmount = 'Not Set';
  grow.gchemQty = 'Not Set';
  grow.gchemAmount ='Not Set';
  grow.herbQty ='Not Set';
  grow.herbAmount ='Not Set';
  grow.insurance = 'Not Set';
  grow.gypQty = 'Not Set';
  grow.gypAmount = 'Not Set';;
  grow.pestQty = 'Not Set';
  grow.pestAmount = 'Not Set';*/
  grow.total = 0;
  grow.batch = 1;
  grow.proceeds = 0;
  grow.bales = req.body.bales;
  grow.lotNumber = 1;
  grow.dateOfFirstFlowering ='Not Set';
  grow.weedsStatus = 'Not Set';
  grow.weedingDates = "Not Set";
  grow.pesticidesApplicationDates = 'Not Set';
  grow.gypsumApplicationDates = 'Not set';
  grow.dateOfFirstFlowering = 'Not Set';
  grow.countField = 'Not Set';
  grow.pegField = 'Not Set';
  grow.nodulation = 'Not Set';
  grow.waterLogging = 'Not set';
  grow.estimates = 'Not set';
  grow.type = "noncontract"


grow.save()
    .then(depts =>{
      number++
        User.findByIdAndUpdate(gId,{$set:{nonNumber:number++, growerNumber:growerNumber}},function(err,mofs){
          console.log('number66',number++)
           
      
 console.log(mofs)
    
  

    

   
    })
    res.redirect('/buyNoncontract')
  

  
  
   
  })     
  
})
}
})




//buying non-contract bags for contracted growers
router.get('/contract2',isLoggedIn,  function(req,res){
res.render('contract/buyContractNon',{user:req.user})
})





router.post('/contract2',isLoggedIn, function(req,res){
var barcodeNumber = req.body.barcodeNumber
var total, total1
var arr = []
var arr1 = []
console.log(barcodeNumber)
var growerNumber=req.body.growerNumber
var proc;
var newAmount;
var cet;
var lot = req.body.lotNumber;
var vbales;
var nbales = req.body.bales;
var vbatch = req.body.batch;
var newBatch;
var newId, newTotal, finalIncome2;
var nbatch= req.body.batch;
var ntotal =  req.body.total
var pos 
var initOw 

console.log('bales',nbales)


req.check('barcodeNumber','Capture Barcode').notEmpty();
req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('total','Enter Amount Owing').notEmpty();
req.check('lotNumber','Enter lotNumber').notEmpty();
req.check('mass','Enter Mass').notEmpty();
req.check('capturer','Enter Capturer').notEmpty();


if(nbales == 0){
req.session.message = {
  type:'errors',
  message:'Enter Number of bales'
} 
var mes = req.session.message;
}

var errors = req.validationErrors();

if (errors||mes ) {
req.session.errors = errors;
req.session.success = false;
res.render('contract',{ errors:req.session.errors,message:mes, user:req.user, use:req.body})

req.session.message = null;


}
else 

{
Grower2.findOne({'barcodeNumber':barcodeNumber})
.then(user =>{
    if(user){ 
  // req.session.errors = errors
    //req.success.user = false;
   req.session.message = {
     type:'errors',
     message:'barcode already in use'
   }     
      res.render('contract/buyContractNon', {
         message:req.session.message ,user:req.user,use:req.body
      })
    }else



var grower = new Grower2();
grower.growerNumber = req.body.growerNumber;
grower.barcodeNumber = req.body.barcodeNumber;
grower.amount = req.body.total;
grower.newAmountOwing = 0;
grower.lotNumber = req.body.lotNumber;
grower.name = req.body.name;
grower.finalIncome = 0;
grower.finalIncome2 = 0;
grower.surname = req.body.surname;
proc = req.body.mass * req.body.price;
grower.totalIncome = req.body.price * req.body.mass;
grower.capturer = req.body.capturer;
grower.center = req.body.center;
grower.mass = req.body.mass;
grower.position = "Not Set";
grower.bales = req.body.bales;
grower.batch = req.body.batch;

grower.type = 'noncontract'
grower.save()
.then(depts =>{




Grower2.find({growerNumber:growerNumber,batch:nbatch},function(err,docs){
for(var i = 0;i<docs.length; i++){
arr.push(docs[i].totalIncome)
}
 total=0;
for(var i in arr) { total += arr[i]; }

finalIncome2 = total - ntotal;

for(var x = 0;x<docs.length;x++){
Grower2.findByIdAndUpdate(docs[x],{$set:{finalIncome:total, finalIncome2:finalIncome2}},function(err,locs){
     
  Grower.find({growerNumber:growerNumber},function(err,socs){
   if(!err){

    id = socs[0]._id;
    newAmount = socs[0].total  -  proc;
    
    if (newAmount <= 0){
      Grower.findByIdAndUpdate(id,{$set:{total: 0}},function(err,tricks){
       
      })
    }else

    Grower.findByIdAndUpdate(id,{$set:{total: newAmount}},function(err,tricks){
if(!err){
     Grower2.find({barcodeNumber:barcodeNumber},function(err,flint){
       if(!err){
         cet = flint[0]._id;
         if(newAmount < 0){
          Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:0}},function(err,lith){

            Grower2.find({growerNumber:growerNumber, batch:vbatch},function(err,dox){
              for(var q = 0;q<dox.length; q++){
                arr1.push(dox[q].totalIncome)
                      }
                       total1=0;
                      for(var v in arr1) { total1 += arr1[v]; }
                       console.log('final',total1)
                       Grower.find({growerNumber:growerNumber},function(err,focs){
                         if(!err){
                           
                           newId = focs[0]._id
                           console.log('newId',newId)
                         newBatch =  focs[0].batch + 1;
                         console.log('new',newBatch)
                           Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch}},function(err,result){
                             
                 

                                 
                           })
                         }

                       })
            })


          })
         }else
         Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:newAmount}},function(err,slith){
            if(!err){
              Grower.find({growerNumber:growerNumber},function(err,stox){
                if(!err){
                  vbales = stox[0].bales
                  console.log(vbales)
                  if(vbales == lot){
                    Grower2.find({growerNumber:growerNumber, batch:vbatch},function(err,sdox){

                      Grower2.find({growerNumber:growerNumber,batch:nbatch,lotNumber:lot},function(err,smocs){
                        console.log('waddi',smocs[0]._id)
                 
                        spos = smocs[0]._id;
                  
                      Grower2.findByIdAndUpdate(spos,{$set:{position:'last'}},function(err,sgocs){

       
                      for(var q = 0;q<sdox.length; q++){
                        arr1.push(sdox[q].totalIncome)
                              }
                               total1=0;
                              for(var v in arr1) { total1 += arr1[v]; }
                               console.log('final',total1)
                               Grower.find({growerNumber:growerNumber},function(err,sfocs){
                                 if(!err){
                                   newId = sfocs[0]._id
                                   console.log('newId',newId)
                                 newBatch =  sfocs[0].batch + 1;
                                 console.log('new',newBatch)
                                   Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch,bales:0}},function(err,sresult){
                                   
                                   })
                                 }
                               })
                    })
                  })
                })
                  }
                }
              })
            }
         })
       }
     })
    
 } 
    })
   }
     
  })

})
}





res.redirect('/contract2')
req.session.message = null;


})

.catch(err => console.log(err))

})   
})
}

})




//buying non-contract bags for noncontracted growers
router.get('/buyNoncontract',isLoggedIn,function(req,res){
var id = req.user._id
var fullname = req.user.fullname
var growerNumber = req.user.growerNumber
User.find({_id:id},function(err,locs){

  if(locs[0].growerNumber == 'null'){
    res.redirect('/registerNoncontract')
  }else
Grower.find({growerNumber:growerNumber},function(err,docs){
  res.render('noncontract/buyingNonContract',{user:docs[0], fullname:fullname})
})
})

})


router.post('/buyNoncontract',isLoggedIn, function(req,res){
var barcodeNumber = req.body.barcodeNumber
var total, total1
var fullname = req.user.fullname
var arr = []
var arr1 = []
console.log(barcodeNumber)
var growerNumber=req.body.growerNumber
var proc;
var newAmount;
var cet;
var lot = req.body.lotNumber;
var vbales;
var nbales = req.body.bales;
var vbatch = req.body.batch;
var newBatch;
var newId, newTotal, finalIncome2;
var nbatch= req.body.batch;
var ntotal =  req.body.total
var pos 
var initOw 

console.log('bales',nbales)


req.check('barcodeNumber','Capture Barcode').notEmpty();
req.check('growerNumber','Enter Grower Number').notEmpty();
req.check('total','Enter Amount Owing').notEmpty();
req.check('lotNumber','Enter lotNumber').notEmpty();
req.check('mass','Enter Mass').notEmpty();
req.check('capturer','Enter Capturer').notEmpty();


if(nbales == 0){
req.session.message = {
  type:'errors',
  message:'Enter Number of bales'
} 
var mes = req.session.message;
}

var errors = req.validationErrors();

if (errors||mes ) {
Grower.find({growerNumber:growerNumber},function(err,docs){
req.session.errors = errors;
req.session.success = false;
res.render('noncontract/buyingNonContract',{ errors:req.session.errors,message:mes, user:docs[0], fullname:fullname})

req.session.message = null;

})
}
else 

{
Grower2.findOne({'barcodeNumber':barcodeNumber})
.then(user =>{
    if(user){ 
  // req.session.errors = errors
    //req.success.user = false;
    Grower.find({growerNumber:growerNumber},function(err,docs){
   req.session.message = {
     type:'errors',
     message:'barcode already in use'
   }     
      res.render('noncontract/buyingNonContract', {
         message:req.session.message ,user:docs[0], fullname:fullname
      })
    })
    }else



var grower = new Grower2();
grower.fullname = req.body.name +" "+ req.body.surname;
grower.growerNumber = req.body.growerNumber;
grower.barcodeNumber = req.body.barcodeNumber;
grower.amount = req.body.total;
grower.newAmountOwing = 0;
grower.lotNumber = req.body.lotNumber;
grower.buyingCenter = req.body.buyingCenter;
grower.buyingRegion =  req.body.buyingRegion;
grower.finalIncome = 0;
grower.finalIncome2 = 0;
proceeds = req.body.mass * req.body.price;
grower.totalIncome = req.body.price * req.body.mass;
grower.capturer = req.body.capturer;

grower.mass = req.body.mass;
grower.position = "Not Set";
grower.bales = req.body.bales;
grower.batch = req.body.batch;



grower.type = 'noncontract'
grower.save()
.then(depts =>{


//record to filter to update recently saved voucher/grower2 with current lot
Grower2.find({growerNumber:growerNumber,batch:vbatch},function(err,docs){
  //updating each voucher of the same batch & grower number with new income earned from new lot
  for(var i = 0;i<docs.length; i++){
arr.push(docs[i].totalIncome)
  }
  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
   total=0;
  for(var i in arr) { total += arr[i]; }

  //subtracting total income from amount owing
  finalIncome2 = total - ntotal;


   
  //updating each lot, finalIncome - totalIncome of all lots,  finalIncome2 - amount remaining from subtracting totalIncome from amount owing
for(var x = 0;x<docs.length;x++){
  Grower2.findByIdAndUpdate(docs[x],{$set:{finalIncome:total, finalIncome2:finalIncome2,proceeds:total}},function(err,locs){
       
   
    })
  }
 

   
            
           if(nbales == lot){
                     
 
            Grower2.find({growerNumber:growerNumber,batch:vbatch,lotNumber:lot},function(err,smocs){
              console.log('waddi',smocs[0]._id)
       
              spos = smocs[0]._id;
        
            Grower2.findByIdAndUpdate(spos,{$set:{position:'last'}},function(err,sgocs){

             
                       var newLot

                       Grower.find({growerNumber:growerNumber},function(err,sfocs){
                        
                          newId = sfocs[0]._id
                          newLot =sfocs[0].lotNumber + 1
                          console.log('newId',newId)
                        newBatch =  sfocs[0].batch + 1;
                        console.log('new',newBatch)
                        var cId = req.user._id;
                        Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch,bales:0, lotNumber:1, proceeds:0}},function(err,sresult){
                          User.findByIdAndUpdate(cId,{$set:{growerNumber:"null"}},function(err,bbds){

                            client.messages 
                          .create({     
                           
         to: '+263781165357' ,
         messagingServiceSid: 'MG0801c66cce322926a94802f3429a393b', 
                             body: 'Grower Number  ' +"  "+ growerNumber +"  "+ 'sales proceeds for ' + nbales +  " bags   "  + " amount: "+"  "+ '$'+ total
                           }) 
                          .then(message => console.log(message.sid)) 
                          .done();

                        

                            })
                          })
                        })
                      })
                      res.redirect('/batchNoncontract')
                    })
                      
                    
                        
                        
                    }
                  
       
else{
Grower.find({growerNumber:growerNumber},function(err,los){

  var xId = los[0]._id;
  var xLot = los[0].lotNumber + 1;
  console.log('lotNumber',xLot)
console.log('userIdX',xId)
  Grower.findByIdAndUpdate(xId,{$set:{ lotNumber:xLot, proceeds:total}},function(err,sresult){
   /* client.messages 
    .create({     
     messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
       to: '+263771446827',
       body: 'sales proceeds for barcode number: '+" "+ barcodeNumber +"    " +"amount: "+"  "+ '$'+proceeds
     }) 
    .then(message => console.log(message.sid)) 
    .done();*/


  })
 
})


res.redirect('/buyNoncontract')


}
})
})
})

}
 


})
        
   
      
      
                             
      //search growers
      router.get('/growers',isLoggedIn,(req, res) => {
 
        Grower.find({},(err, docs) => {
             if (!err) {
                 res.render("growX", {
                     list: docs, 
                     
                 });
             }
             else {
                 console.log('Error in retrieving  list :' + err);
             }
         });
         });   









router.get('/vou',isLoggedIn, function(req,res){
res.render('bar/scan')
})


router.get('/list',isLoggedIn, function(req,res){
Grower.find((err, docs) => {
  if (!err) {
      res.render("list", {
          list: docs,
          
      });
  }
  else {
      console.log('Error in retrieving Grower list :' + err);
  }
});
})

// verify bag info
router.get('/verify',isLoggedIn, function(req,res){
res.render('contract/verify')
})








//buying contract autocomplete
router.get('/autocomplete1/',isLoggedIn, function(req, res, next) {
  var name, growerNumber, surname,id,batch,bales, total, mobile;
  var regex= new RegExp(req.query["term"],'i');

  var growerFilter =Grower.find({growerNumber:regex},{'growerNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

    
    growerFilter.exec(function(err,data){
   
 
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(grower=>{
 
        
     
  
          
         let obj={
           id:grower._id,
           label: grower.growerNumber,

       
         /*  name:name,
           surname:surname,
           batch:batch*/
          
          
       
         
          
  
           
         };
        
         result.push(obj);
         console.log('object',obj.id)
       });
  
     }
   
     res.jsonp(result);
     console.log('Result',result)
    }
  
  })
 
  });




//this routes autopopulates growers info from the growerNumber selected from automplete1
router.post('/auto',isLoggedIn,function(req,res){
var growerNumber = req.body.code

var companyId = req.user.companyId

Grower.find({growerNumber:growerNumber},function(err,docs){
if(docs == undefined){
 res.redirect('/buy')
}else

  res.send(docs[0])
})


})




//batch contract autocomplete
router.get('/autocomplete2/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var growerFilter =Grower.find({growerNumber:regex},{'growerNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  growerFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(grower=>{

      
   

        
       let obj={
         id:grower._id,
         label: grower.growerNumber,

    
     
       
        

         
       };
      
       result.push(obj);
       console.log('object',obj.id)
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});




//this routes autopopulates growers info from the growerNumber selected from automplete2
router.post('/auto1',isLoggedIn,function(req,res){
var growerNumber = req.body.code

var companyId = req.user.companyId

Grower.find({growerNumber:growerNumber},function(err,docs){
if(docs == undefined){
 res.redirect('/batchContract')
}else

  res.send(docs[0])
})


})













//buying noncontract autocomplete
router.get('/autocomplete3/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var growerFilter =Grower.find({growerNumber:regex,type:'noncontract'},{'growerNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  growerFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(grower=>{

      
   

        
       let obj={
         id:grower._id,
         label: grower.growerNumber,

     
     
       
        

         
       };
      
       result.push(obj);
       console.log('object',obj.id)
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});



 //this routes autopopulates growers info from the growerNumber selected from automplete3
router.post('/auto2',isLoggedIn,function(req,res){
var growerNumber = req.body.code

var companyId = req.user.companyId

Grower.find({growerNumber:growerNumber},function(err,docs){
if(docs == undefined){
 res.redirect('/buyNoncontract')
}else

  res.send(docs[0])
})


})




//batch noncontract autocomplete
router.get('/autocomplete4/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var growerFilter =Grower.find({growerNumber:regex},{'growerNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  growerFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(grower=>{

      
   

        
       let obj={
         id:grower._id,
         label: grower.growerNumber,

    
     
       
        

         
       };
      
       result.push(obj);
       console.log('object',obj.id)
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});



 //this routes autopopulates growers info from the growerNumber selected from automplete4
router.post('/auto3',isLoggedIn,function(req,res){
var growerNumber = req.body.code

var companyId = req.user.companyId

Grower.find({growerNumber:growerNumber},function(err,docs){
if(docs == undefined){
 res.redirect('/batchContract')
}else

  res.send(docs[0])
})


})


//buying center  autocomplete
router.get('/autocomplete6/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var centerFilter =Center.find({centEr:regex},{'center':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  centerFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(center=>{

      
   

        
       let obj={
         id:center._id,
         label: center.center,

    
     
       
        

         
       };
      
       result.push(obj);
       
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});




 //this routes autopopulates buying center info from the center selected from automplete6
 router.post('/autoCenter',isLoggedIn,function(req,res){
  var center = req.body.code
  

 
  Center.find({center:center},function(err,docs){
 if(docs == undefined){
   res.redirect('/batchContract')
 }else

    res.send(docs[0])
  })


})





//buying region autocomplete

router.get('/autocomplete7/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var regionFilter =Region.find({region1:regex},{'region1':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  regionFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(region=>{

      
   

        
       let obj={
         id:region._id,
         label: region.region1,

    
     
       
        

         
       };
      
       result.push(obj);
       
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});





 //this routes autopopulates buying region info from the rgion selected from automplete6
 router.post('/autoRegion',isLoggedIn,function(req,res){
  var region = req.body.code
  

 
  Region.find({region1:region},function(err,docs){
 if(docs == undefined){
   res.redirect('/fix')
 }else

    res.send(docs[0])
  })


})











//batch noncontract autocomplete
router.get('/autoBatchNon/',isLoggedIn, function(req, res, next) {
var name, growerNumber, surname,id,batch,bales, total, mobile;
var regex= new RegExp(req.query["term"],'i');

var growerFilter =Grower.find({growerNumber:regex},{'growerNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  growerFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(grower=>{

      
   

        
       let obj={
         id:grower._id,
         label: grower.growerNumber,

    
     
       
        

         
       };
      
       result.push(obj);
       console.log('object',obj.id)
     });

   }
 
   res.jsonp(result);
   console.log('Result',result)
  }

})

});




//this routes autopopulates growers info from the growerNumber selected from automplete2
router.post('/autoBatchNon1',isLoggedIn,function(req,res){
var growerNumber = req.body.code

var companyId = req.user.companyId

Grower.find({growerNumber:growerNumber},function(err,docs){
if(docs == undefined){
 res.redirect('/batchContract')
}else

  res.send(docs[0])
})


})









router.post('/quagg',function(req,res){
var barc = req.body.code
console.log(req.body.code)

Grower2.find({barcodeNumber:barc},function(err,docs){
if(docs == undefined){
 res.redirect('/ver')
}else

  res.send(docs[0])
})
})



//loading chart info of totalMass & totalQty of regions
router.post('/chartX',function(req,res){

Region.find(function(err,docs){
if(docs == undefined){
 res.redirect('/dash')
}else

  res.send(docs)
  console.log(docs)

})
})










router.post('/vou',function(req,res){
var arr = [];
var total;
var barc = req.body.code
var growerNumber = req.body.growerNumber

// console.log(req.body.code)

Grower2.find({barcodeNumber:barc},function(err,docs){
  //console.log(docs[0].name)\


  if(docs == undefined){
    res.redirect('/vou')
   
  }else
  
  
  res.send(docs[0])


 
})
 
})

router.post('/verifyScan',function(req,res){
  
 
  Grower2.find(function(err,docs){
 if(docs == undefined){
   res.redirect('/verify')
 }else

    res.send(docs[0])
  })
})


//upload contract batch
router.get('/contractBatch',isLoggedIn,function(req,res){
  res.render('offlineContract/contractBatch')
})

router.post('/contractBatch',isLoggedIn,upload.single('myFile'),function(req,res){



  if(!req.file){
    req.session.message = {
      type:'errors',
      message:'Select File!'
    }     
    res.render('offlineContract/contractBatch', {message:req.session.message,
                                             
    }) 
    }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        req.session.message = {
            type:'errors',
            message:'Upload Excel File'
          }     
          res.render('offlineContract/contractBatch', {message:req.session.message,
                                             
          }) 



    
    }else{


  var id

    
 var file = req.file.filename;


var wb =  xlsx.readFile('./public/uploads/' + req.file.filename)

// var ws = wb.Sheets[req.body.sheet1];
 var sheets = wb.Sheets;
 var sheetNames = wb.SheetNames;

 var sheetName = wb.SheetNames[0];
var sheet = wb.Sheets[sheetName ];

for (var i = 0; i < wb.SheetNames.length; ++i) {
var sheet = wb.Sheets[wb.SheetNames[i]];

console.log(wb.SheetNames.length)
var data =xlsx.utils.sheet_to_json(sheet)

var newData = data.map(function(record){
var growerNumber= record.growerNumber;
var bales = record.bales
console.log(growerNumber)

Grower.find({growerNumber:growerNumber},function(err,doc){
  console.log(doc.length)

id = doc[0]._id;
console.log(id)

Grower.findByIdAndUpdate(id,{$set:{bales:bales}},function(err, noc){
 

  
})


})


})
res.redirect('/contractBatch')
}


}

})






 //upload contract bags   
router.get('/uploadContract',isLoggedIn,function(req,res){
  res.render('offlineContract/uploadContract')
})



                                    router.post('/uploadContract',isLoggedIn,upload.single('myFile'),function(req,res){
                                      var name, surname, id, total, batch,zid;
                                      var arr = []
                                      
                                      if(!req.file){
                                        req.session.message = {
                                          type:'errors',
                                          message:'Select File!'
                                        }     
                                        res.render('offlineContract/uploadContract', {message:req.session.message,
                                                                                 
                                        }) 
                                        }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                                            req.session.message = {
                                                type:'errors',
                                                message:'Upload Excel File'
                                              }     
                                              res.render('offlineContract/uploadContract', {message:req.session.message,
                                                                                 
                                              }) 
                                  
                                  
                                  
                                        
                                        }else{
                                    
                                    
                                      var file = req.file.filename;
                                      var wb =  xlsx.readFile('./public/uploads/' + file)
                                    
                                      // var ws = wb.Sheets[req.body.sheet1];
                                       var sheets = wb.Sheets;
                                       var sheetNames = wb.SheetNames;
                                    
                                       var sheetName = wb.SheetNames[0];
                                    var sheet = wb.Sheets[sheetName ];
                                    
                                    for (var i = 0; i < wb.SheetNames.length; ++i) {
                                    var sheet = wb.Sheets[wb.SheetNames[i]];
                                    
                                    console.log(wb.SheetNames.length)
                                    var data =xlsx.utils.sheet_to_json(sheet)
                                    
                                    var newData = data.map(function(record){
                                    
                                    // console.log(record.growerNumber, record.name)
                                    
                                           var barcodeNumber = record.barcodeNumber;
                                           var growerNumber= record.growerNumber;
                                           console.log('chi',growerNumber)
                                           var lotNumber = record.lotNumber;
                                           var capturer = record.capturer;
                                           var center = record.center;
                                           var mass = record.mass;
                                           var price = record.price;
                                           var lot = lotNumber
                                      
                                           var total, total1
                                           var arr = []
                                           var arr1 = []
                                           console.log(barcodeNumber)
                                        
                                           var proc;
                                           var newAmount;
                                           var cet;
                                       
                                           var vbales;
                                           
                                           var newBatch;
                                           var newId, newTotal, finalIncome2;
                                        
                                           var pos 
                                         var initOw 
                                          
                                    
                                    
                                        Grower.find({growerNumber:growerNumber},function(err,docs){
                                          console.log(growerNumber,"numb")
                                          name = docs[0].name;
                                          console.log(name)
                                          surname = docs[0].surname;
                                          id = docs[0].id;
                                          total = docs[0].total;
                                          bales = docs[0].bales;
                                          console.log('haa',bales)
                                          batch = docs[0].batch;
                                          var nbales = docs[0].bales;
                                           var vbatch = docs[0].batch;
                                           var nbatch= docs[0].batch;
                                           var ntotal =  docs[0].total;

                                                  
                                      Grower2.findOne({'barcodeNumber':record.barcodeNumber})
                                      .then(grower =>{
                                          if(grower){ 
                                        // req.session.errors = errors
                                          //req.success.user = false;
                                     res.redirect('/uploadContract')
                                          }else
                                          
                                        
var grower = new Grower2();
grower.fullname = name +" "+ surname;
grower.growerNumber = record.growerNumber;
grower.barcodeNumber = record.barcodeNumber;
grower.amount = total;
grower.newAmountOwing = 0;
grower.lotNumber = record.lotNumber;
grower.buyingCenter = record.buyingCenter;
grower.buyingRegion =  record.buyingRegion;
grower.finalIncome = 0;
grower.finalIncome2 = 0;
proceeds = record.mass * record.price;
grower.totalIncome = record.price * record.mass;
grower.capturer = req.user.fullname;
grower.mass = record.mass;
grower.position = "Not Set";
grower.bales = bales;
grower.batch = batch;

grower.type = 'contract'
grower.save()
.then(grower =>{


//record to filter to update recently saved voucher/grower2 with current lot
Grower2.find({growerNumber:growerNumber,batch:vbatch},function(err,docs){
//updating each voucher of the same batch & grower number with new income earned from new lot
for(var i = 0;i<docs.length; i++){
arr.push(docs[i].totalIncome)
}
//adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
 total=0;
for(var i in arr) { total += arr[i]; }

//subtracting total income from amount owing
finalIncome2 = total - ntotal;


 
//updating each lot, finalIncome - totalIncome of all lots,  finalIncome2 - amount remaining from subtracting totalIncome from amount owing
for(var x = 0;x<docs.length;x++){
Grower2.findByIdAndUpdate(docs[x],{$set:{finalIncome:total, finalIncome2:finalIncome2}},function(err,locs){
     
 
  })
}
Grower.find({growerNumber:growerNumber},function(err,socs){
  
  id = socs[0]._id;
  newAmount = socs[0].total  -  proceeds;

   //if amount owing is less than 0 then the grower debt is cleared to 0 
   if (newAmount <  0){
    Grower.findByIdAndUpdate(id,{$set:{total: 0,proceeds:total}},function(err,tricks){
     
    })
  }else
  //else the amount owing is updating to the new amount owed
       Grower.findByIdAndUpdate(id,{$set:{total: newAmount,proceeds:total}},function(err,tricks){
   
        Grower2.find({barcodeNumber:barcodeNumber},function(err,flint){
        
            cet = flint[0]._id;
            //if the debt is cleared, the current voucher amount owing will be updated to zero
            if(newAmount < 0){
             Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:0}},function(err,lith){


             })
            }

            else
         Grower2.findByIdAndUpdate(cet,{$set:{newAmountOwing:newAmount}},function(err,slith){
          

         })
        
              
          
         if(nbales == lot){
                   

          Grower2.find({growerNumber:growerNumber,batch:vbatch,lotNumber:lot},function(err,smocs){
            console.log('waddi',smocs[0]._id)
     
            spos = smocs[0]._id;
      
          Grower2.findByIdAndUpdate(spos,{$set:{position:'last'}},function(err,sgocs){

           
                     var newLot

                     Grower.find({growerNumber:growerNumber},function(err,sfocs){
                      
                        newId = sfocs[0]._id
                        newLot =sfocs[0].lotNumber + 1
                        console.log('newId',newId)
                      newBatch =  sfocs[0].batch + 1;
                      console.log('new',newBatch)
                      var cId = req.user._id;
                      Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch,bales:0, lotNumber:1, proceeds:0}},function(err,sresult){
                     /*   User.findByIdAndUpdate(cId,{$set:{growerNumber:"null"}},function(err,bbds){

                          client.messages 
                          .create({     
                           messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
                             to: '+263771446827',
                             body: 'Grower Number  ' +"  "+ growerNumber +"  "+ 'sales proceeds for ' + nbales +  " bags   "  + " amount: "+"  "+ '$'+ total
                           }) 
                          .then(message => console.log(message.sid)) 
                          .done();

                        })*/
                      })
                     



                      })
              


          })
        })
    
      }
      
else{
Grower.find({growerNumber:growerNumber},function(err,los){

  var xId = los[0]._id;
  var xLot = los[0].lotNumber + 1;
  console.log('lotNumber',xLot)
console.log('userIdX',xId)
  Grower.findByIdAndUpdate(xId,{$set:{ lotNumber:xLot}},function(err,sresult){
   /* client.messages 
    .create({     
     messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
       to: '+263771446827',
       body: 'sales proceeds for barcode number: '+" "+ barcodeNumber +"    " +"amount: "+"  "+ '$'+proceeds
     }) 
    .then(message => console.log(message.sid)) 
    .done();*/


  })
 
})



}
         
            
            })
      

          })


          
 })
})









})


})





})
                                    })
                                    res.redirect('/uploadContract')
                                    }
                                  
                                    
                                }
                              
                                     
                                          
                                        
                              })                                   
                                  





          


                                
                                  
//register non-contract

  
                                    router.get('/regNoncontract',isLoggedIn,function(req,res){
                                      res.render('offlineNonContract/regNonContract')
                                    })

                          



router.post('/regNoncontract',isLoggedIn,  upload.single('myFile'),function(req,res){
var id = req.user._id
var id6

var companyId = req.user.companyId

  if(!req.file){
      req.session.message = {
        type:'errors',
        message:'Select File!'
      }     
      res.render('offlineNonContract/regNonContract', {message:req.session.message,
                                               
      }) 
      }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          req.session.message = {
              type:'errors',
              message:'Upload Excel File'
            }     
            res.render('offlineNonContract/regNonContract', {message:req.session.message,
                                               
            }) 



      }
        
      else{
          const file = req.file.filename;
  
          /* if(!file){
               const error = new Error('Please upload file')
               error.httpStatusCode= 400;
               return next(error)
           }*/
          // res.send(file)
               var wb =  xlsx.readFile('./public/uploads/' + file)
       
              // var ws = wb.Sheets[req.body.sheet1];
               var sheets = wb.Sheets;
               var sheetNames = wb.SheetNames;
   
               var sheetName = wb.SheetNames[0];
   var sheet = wb.Sheets[sheetName ];
   
      for (var i = 0; i < wb.SheetNames.length; ++i) {
       var sheet = wb.Sheets[wb.SheetNames[i]];
   
       console.log(wb.SheetNames.length)
       var data =xlsx.utils.sheet_to_json(sheet)
           
       var newData = data.map(function(record){
   
          // console.log(record.growerNumber, record.name)

         
    Grower.findOne({'growerNumber':record.growerNumber})
    .then(grower =>{
        if(grower){ 
      // req.session.errors = errors
        //req.success.user = false;
   res.redirect('/regNoncontract')
        }else
        var grow = new Grower();
        grow.growerNumber= record.growerNumber;
grow.name = record.name;
grow.surname = record.surname;
grow.fullname = record.name +" "+ record.surname;
grow.mobile = record.mobile;
grow.region = record.region;
grow.dateInputs = 'Not Set';
grow.plantingDay = 'Not Set';
grow.germinationDate ='Not Set';
grow.germination = 'Not Set';
grow.weedControlStatus = 'Not Set';
grow.cumulativeRainfall = 'Not Set';
grow.dateOfVisit = 'Not Set';
grow.id = record.id;

grow.buyingCenter = record.buyingCenter;
grow.buyingRegion = record.buyingRegion;

grow.total = 0;
grow.batch = 1;
grow.proceeds = 0;
grow.bales = record.bales;
grow.lotNumber = 1;
grow.dateOfFirstFlowering ='Not Set';
grow.weedsStatus = 'Not Set';
grow.weedingDates = "Not Set";
grow.pesticidesApplicationDates = 'Not Set';
grow.gypsumApplicationDates = 'Not set';
grow.dateOfFirstFlowering = 'Not Set';
grow.countField = 'Not Set';
grow.pegField = 'Not Set';
grow.nodulation = 'Not Set';
grow.waterLogging = 'Not set';
grow.estimates = 'Not set';
grow.type = "noncontract"
                   
              
                   
          
grow.save()
.then(depts =>{
 req.session.message = {
   type:'success',
   message:'Upload Successful'
 }  
 res.render('offlineNonContract/regNonContract', {message:req.session.message})

})
                
                   })
                
               
                   });
                 
                 
                
           
       }
    
      }


})







//upload non contract

router.get('/uploadNoncontract',isLoggedIn,function(req,res){
res.render('offlineNonContract/uploadNonContract')

})





      
                                    router.post('/uploadNoncontract',isLoggedIn,upload.single('myFile'),function(req,res){
                                     var fullname, bales, buyingCenter, buyingRegion, batch
                                      var arr = []
                                      
                                      if(!req.file){
                                        req.session.message = {
                                          type:'errors',
                                          message:'Select File!'
                                        }     
                                          res.render('offlineNonContract/uploadNonContract', {message:req.session.message}) 
                                        }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                                            req.session.message = {
                                                type:'errors',
                                                message:'Upload Excel File'
                                              }     
                                              res.render('offlineNonContract/uploadNonContract', {message:req.session.message}) 
                                  
                                  
                                        }
                                          
                                        else{
                                            const file = req.file.filename;
                                    
                                                 var wb =  xlsx.readFile('./public/uploads/' + file)
                                         
                                              
                                                 var sheets = wb.Sheets;
                                                 var sheetNames = wb.SheetNames;
                                     
                                                 var sheetName = wb.SheetNames[0];
                                     var sheet = wb.Sheets[sheetName ];
                                     
                                        for (var i = 0; i < wb.SheetNames.length; ++i) {
                                         var sheet = wb.Sheets[wb.SheetNames[i]];
                                     
                                         console.log(wb.SheetNames.length)
                                         var data =xlsx.utils.sheet_to_json(sheet)
                                             
                                         var newData = data.map(function(record){
                                     
                                            // console.log(record.growerNumber, record.name)
                                            Grower.find({growerNumber:record.growerNumber},function(err,docs){
                                              if(docs.length == 0){
                                           
                                              
                                              }
                                              fullname = docs[0].fullname;
                                              bales = docs[0].bales;
                                              buyingCenter = docs[0].buyingCenter;
                                              buyingRegion = docs[0].buyingRegion;
                                              batch = docs[0].batch;
                                              vbatch = batch
                                              nbales = bales
                                              lot = record.lotNumber
                                 
                                           
                                      Grower2.findOne({'barcodeNumber':record.barcodeNumber})
                                      .then(grower =>{
                                          if(grower){ 
                                        // req.session.errors = errors
                                          //req.success.user = false;
                                     res.redirect('/uploadNoncontract')
                                          }else
                                          
                                       var growerNumber = record.growerNumber;
                                       var ntotal = 0;
                                             
                                                   var grow = new Grower2();
                                                   grow.growerNumber  = growerNumber;
                                                   grow.barcodeNumber = record.barcodeNumber
                                                    grow.fullname = fullname;
                                                    grow.bales = bales;
                                                    grow.amount = 0;
                                                    grow.buyingCenter = buyingCenter;
                                                    grow.buyingRegion = buyingRegion;
                                                    grow.batch = batch;
                                                    grow.lotNumber = record.lotNumber;
                                                    grow.finalIncome = 0;
                                                    grow.finalIncome2 = 0;
                                        
                                                    proceeds = record.mass * record.price;
                                                    grow.totalIncome = proceeds;
                                                    grow.capturer = req.user.fullname
                                                    grow.mass = record.mass;
                                                    grow.position = "Not Set";
                                                    grow.type = "noncontract"
                                                    
                                                     
                                                
                                                     
                                            
                                                   
                                                    grow.save()
                                                    .then(depts =>{
                                                    
                                                    
                                                      //record to filter to update recently saved voucher/grower2 with current lot
                                                      Grower2.find({growerNumber:growerNumber,batch:vbatch},function(err,docs){
                                                        //updating each voucher of the same batch & grower number with new income earned from new lot
                                                        for(var i = 0;i<docs.length; i++){
                                                      arr.push(docs[i].totalIncome)
                                                        }
                                                        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                                                         total=0;
                                                        for(var z in arr) { total += arr[z]; }
                                                      console.log('total',total)
                                                        //subtracting total income from amount owing
                                                        
                                                      
                                                         
                                                        //updating each lot, finalIncome - totalIncome of all lots,  finalIncome2 - amount remaining from subtracting totalIncome from amount owing
                                                      for(var x = 0;x<docs.length;x++){
                                                        console.log('+++',docs[x])
                                                        Grower2.findByIdAndUpdate(docs[x]._id,{$set:{finalIncome:total, finalIncome2:total}},function(err,locs){
                                                             
                                                         
                                                          })
                                                        }
                                                       
                                                      
                                                         
                                                                  
                                                                 if(nbales == lot){
                                                                           
                                                       
                                                                  Grower2.find({growerNumber:growerNumber,batch:vbatch,lotNumber:lot},function(err,smocs){
                                                                    console.log('waddi',smocs[0]._id)
                                                             
                                                                    spos = smocs[0]._id;
                                                              console.log(spos)
                                                                  Grower2.findByIdAndUpdate(spos,{$set:{position:'last'}},function(err,sgocs){
                                                      
                                                                   
                                                                             var newLot
                                                      
                                                                             Grower.find({growerNumber:growerNumber},function(err,sfocs){
                                                                              
                                                                                newId = sfocs[0]._id
                                                                                newLot =sfocs[0].lotNumber + 1
                                                                                console.log('newId',newId)
                                                                              newBatch =  sfocs[0].batch + 1;
                                                                              console.log('new',newBatch)
                                                                              var cId = req.user._id;
                                                                              Grower.findByIdAndUpdate(newId,{$set:{batch:newBatch,bales:0, lotNumber:1, proceeds:0}},function(err,sresult){
                                                                                /*User.findByIdAndUpdate(cId,{$set:{growerNumber:"null"}},function(err,bbds){
                                                      
                                                                                 /* client.messages 
                                                                                  .create({     
                                                                                   messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
                                                                                     to: '+263771446827',
                                                                                     body: 'Grower Number  ' +"  "+ growerNumber +"  "+ 'sales proceeds for ' + nbales +  " bags   "  + " amount: "+"  "+ '$'+ total
                                                                                   }) 
                                                                                  .then(message => console.log(message.sid)) 
                                                                                  .done();*/
                                                      
                                                                                  //})
                                                                                })
                                                                              })
                                                                            })
                                                                            //res.redirect('/batchNoncontract')
                                                                          })
                                                                            
                                                                          
                                                                              
                                                                              
                                                                          }
                                                                        
                                                             
                                                    else{
                                                      Grower.find({growerNumber:growerNumber},function(err,los){
                                                    
                                                        var xId = los[0]._id;
                                                        var xLot = los[0].lotNumber + 1;
                                                        console.log('lotNumber',xLot)
                                                    console.log('userIdX',xId)
                                                        Grower.findByIdAndUpdate(xId,{$set:{ lotNumber:xLot, proceeds:total}},function(err,sresult){
                                                         /* client.messages 
                                                          .create({     
                                                           messagingServiceSid: 'MG4822ba2425caf9cb24b1add5914632f0',    
                                                             to: '+263771446827',
                                                             body: 'sales proceeds for barcode number: '+" "+ barcodeNumber +"    " +"amount: "+"  "+ '$'+proceeds
                                                           }) 
                                                          .then(message => console.log(message.sid)) 
                                                          .done();*/
                                                    
                                                      
                                                        })
                                                       
                                                      })
                                                     
                                                    
                                                    
                                                    
                                                    
                                                    }
                                                      })
                                                    })
                                                      })
                                                     
                                                     });
                                              
                                                    })
                                                    res.redirect('/uploadNoncontract')
                                                    }
                                                  }
                                                })
                                                
                                                   
                                                    
                                        
                                         
                                        
                                        
                                  
                                    
                                    

                         


  
//search growers
router.get('/search',isLoggedIn,function(req,res,next){
Grower2.find({},(err, docs) => {
  if (!err) {
      res.render("list5", {
          list: docs, 
          
      });
  }
  else {
      console.log('Error in retrieving Growers list :' + err);
  }
});

})



router.get('/importX',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('imports',{pro:pro})
})



   
  router.post('/importX',isLoggedIn, upload.single('file'),function(req,res){

    var m = moment()
    var year = m.format('YYYY')

  
    
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
          if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports', {message:req.session.message,pro:pro
                     
                 }) 
  
  
  
        }
          
        else{

        
            const file = req.file.filename;
    
            
                 var wb =  xlsx.readFile('./public/uploads/' + file)
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(async function (record){
     
        
         
      
          
          try{
        
       
      
            let growerNumber = record.growerNumber;
            let name = record.name;
            let surname = record.surname;
            let fullname = name +" "+surname
            let farm = record.farm;
            let address = record.address
            let mobile = record.mobile;
            let buyingCenter = record.buyingCenter;
            let buyingRegion = record.buyingRegion;
          let lotNumber = record.lotNumber
          let total = record.total
           let batch = record.batch
           let proceeds = record.proceeds
            let bales = record.bales;
            let id = record.id
            let type = record.type
            let sales = record.sales
            let fieldOfficer = record.fieldOfficer
            let num = record.num
        req.body.growerNumber=record.growerNumber
        req.body.name=record.name
        req.body.surname=record.surname
        req.body.address=record.address
        req.body.mobile=record.mobile
        req.body.farm=record.farm
        req.body.address=record.address
        req.body.buyingCenter=record.buyingCenter
        req.body.buyingRegion=record.buyingRegion
        req.body.lotNumber=record.lotNumber
      


req.check('growerNumber','Enter Grower Number').notEmpty();

    

var errors = req.validationErrors();
  
if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  for(let x=0;x<req.session.errors.length;x++){
    throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
  }

}


        
             /* 
         
            const token = jwt.sign({uid,name,surname,address,mobile,gender,fullname,prefix, dob, photo,dept, term, year,companyId, email,role, password,expdate,expStr }, JWT_KEY, { expiresIn: '100000m' });
            const CLIENT_URL = 'http://' + req.headers.host;
      
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <a href="${CLIENT_URL}/records/activate/${token}">click here</a>
            <h1> User credentials</h1>
            <p>userID:${uid}</p>
            <p>password:${password}</p>
            <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
            `;
      
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: "cashreq00@gmail.com",
                  pass: "itzgkkqtmchvciik",
              },
            });
            
      
            // send mail with defined transport object
            const mailOptions = {
                from: '"Admin" <cashreq00@gmail.com>', // sender address
                to: record.email, // list of receivers
                subject: "Account Verification ✔", // Subject line
                html: output, // html body
            };
      
         await   transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                 
             req.session.message = {
               type:'errors',
               message:'confirmation emails not sent'
             }
             
             res.render('imports/teacher', {message:req.session.message,pro:pro}) 
         
          
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    idNumber++
                 
                    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){

                    req.session.message = {
                      type:'success',
                      message:'confirmation emails sent'
                    }     
                    
                    res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                  })
                }
            })
              */



            {
              User.findOne({'growerNumber':growerNumber})
              .then(user =>{
                  if(user){ 
                // req.session.errors = errors
                  //req.success.user = false;
            
            
            
                 req.session.message = {
                   type:'errors',
                   message:'user id already in use'
                 }     
                 
                    res.render('imports', {
                         message:req.session.message ,pro:pro
                    }) 
                
            }
            else





            var grow = new Grower();
            grow.growerNumber = growerNumber;
            grow.name = name;
            grow.fullname = fullname;
          grow.surname = surname;
            grow.farm = farm;
            grow.address = address;
            grow.buyingCenter = buyingCenter;
            grow.buyingRegion = buyingRegion
            grow.lotNumber = lotNumber;
            grow.total = total;
            grow.mobile = mobile;
            grow.id = id
            grow.batch = batch;
            grow.proceeds = proceeds;
            grow.bales = bales;
            grow.type = type;
            grow.sales = sales;
            grow.fieldOfficer = fieldOfficer
              
           
            grow.save()
              .then(grow =>{
               
              
                  
                req.session.message = {
                  type:'success',
                  message:'Account Registered'
                }  
                res.render('imports',{message:req.session.message});
              })

            })
          }
                   
                    // .catch(err => console.log(err))
                  }
                  catch(e){
                    res.send(e.message)
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  })
  











  
router.get('/importC',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('importCenter',{pro:pro})
})



   
  router.post('/importC',isLoggedIn, upload.single('file'),function(req,res){

    var m = moment()
    var year = m.format('YYYY')

  
    
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
          if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('importCenter', {message:req.session.message,pro:pro
                     
                 }) 
  
  
  
        }
          
        else{

        
            const file = req.file.filename;
    
            
                 var wb =  xlsx.readFile('./public/uploads/' + file)
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(async function (record){
     
        
         
      
          
          try{
        
       
      
            let center = record.center;
            let region = record.region;
            let totalQty = record.totalQty;
            let totalMass = record.totalMass
            let totalAmountSpent = record.totalAmountSpent
            let contractMass = record.contractMass;
            let noncontractMass = record.noncontractMass
            let contractQty = record.contractQty;
            let noncontractQty = record.noncontractQty;
            let contractAmountSpent = record.contractAmountSpent;
          let noncontractAmountSpent = record.noncontractAmountSpent
        

var errors = req.validationErrors();
  
if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  for(let x=0;x<req.session.errors.length;x++){
    throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
  }

}


        
             /* 
         
            const token = jwt.sign({uid,name,surname,address,mobile,gender,fullname,prefix, dob, photo,dept, term, year,companyId, email,role, password,expdate,expStr }, JWT_KEY, { expiresIn: '100000m' });
            const CLIENT_URL = 'http://' + req.headers.host;
      
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <a href="${CLIENT_URL}/records/activate/${token}">click here</a>
            <h1> User credentials</h1>
            <p>userID:${uid}</p>
            <p>password:${password}</p>
            <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
            `;
      
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: "cashreq00@gmail.com",
                  pass: "itzgkkqtmchvciik",
              },
            });
            
      
            // send mail with defined transport object
            const mailOptions = {
                from: '"Admin" <cashreq00@gmail.com>', // sender address
                to: record.email, // list of receivers
                subject: "Account Verification ✔", // Subject line
                html: output, // html body
            };
      
         await   transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                 
             req.session.message = {
               type:'errors',
               message:'confirmation emails not sent'
             }
             
             res.render('imports/teacher', {message:req.session.message,pro:pro}) 
         
          
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    idNumber++
                 
                    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){

                    req.session.message = {
                      type:'success',
                      message:'confirmation emails sent'
                    }     
                    
                    res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                  })
                }
            })
              */



            {
              Center.findOne({'center':center})
              .then(user =>{
                  if(user){ 
                // req.session.errors = errors
                  //req.success.user = false;
            
            
            
                 req.session.message = {
                   type:'errors',
                   message:'user id already in use'
                 }     
                 
                    res.render('importCenter', {
                         message:req.session.message ,pro:pro
                    }) 
                
            }
            else





            var cent = new Center();
            cent.center = center;
            cent.region = region;
            cent.totalQty = totalQty;
          cent.totalMass = totalMass;
            cent.totalAmountSpent = totalAmountSpent;
            cent.contractMass = contractMass;
            cent.noncontractMass = noncontractMass;
            cent.contractQty = contractQty
            cent.noncontractQty = noncontractQty;
            cent.contractAmountSpent = contractAmountSpent;
            cent.noncontractAmountSpent = noncontractAmountSpent;
         
              
           
            cent.save()
              .then(grow =>{
               
              
                  
                req.session.message = {
                  type:'success',
                  message:'Success'
                }  
                res.render('importCenter',{message:req.session.message});
              })

            })
          }
                   
                    // .catch(err => console.log(err))
                  }
                  catch(e){
                    res.send(e.message)
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  })
  
  














  




  
router.get('/importR',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('importRegion',{pro:pro})
})



   
  router.post('/importR',isLoggedIn, upload.single('file'),function(req,res){

    var m = moment()
    var year = m.format('YYYY')

  
    
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
          if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('importRegion', {message:req.session.message,pro:pro
                     
                 }) 
  
  
  
        }
          
        else{

        
            const file = req.file.filename;
    
            
                 var wb =  xlsx.readFile('./public/uploads/' + file)
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(async function (record){
     
        
         
      
          
          try{
        
       
      
            let prefix = record.prefix;
            let region1 = record.region1;
            let totalQty = record.totalQty;
            let totalMass = record.totalMass
            let totalAmountSpent = record.totalAmountSpent
            let contractMass = record.contractMass;
            let noncontractMass = record.noncontractMass
            let contractQty = record.contractQty;
            let noncontractQty = record.noncontractQty;
            let contractAmountSpent = record.contractAmountSpent;
          let noncontractAmountSpent = record.noncontractAmountSpent
        

var errors = req.validationErrors();
  
if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  for(let x=0;x<req.session.errors.length;x++){
    throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" ")
  }

}


        
             /* 
         
            const token = jwt.sign({uid,name,surname,address,mobile,gender,fullname,prefix, dob, photo,dept, term, year,companyId, email,role, password,expdate,expStr }, JWT_KEY, { expiresIn: '100000m' });
            const CLIENT_URL = 'http://' + req.headers.host;
      
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <a href="${CLIENT_URL}/records/activate/${token}">click here</a>
            <h1> User credentials</h1>
            <p>userID:${uid}</p>
            <p>password:${password}</p>
            <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
            `;
      
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: "cashreq00@gmail.com",
                  pass: "itzgkkqtmchvciik",
              },
            });
            
      
            // send mail with defined transport object
            const mailOptions = {
                from: '"Admin" <cashreq00@gmail.com>', // sender address
                to: record.email, // list of receivers
                subject: "Account Verification ✔", // Subject line
                html: output, // html body
            };
      
         await   transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                 
             req.session.message = {
               type:'errors',
               message:'confirmation emails not sent'
             }
             
             res.render('imports/teacher', {message:req.session.message,pro:pro}) 
         
          
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    idNumber++
                 
                    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){

                    req.session.message = {
                      type:'success',
                      message:'confirmation emails sent'
                    }     
                    
                    res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                  })
                }
            })
              */



            {
              Region.findOne({'region1':region1})
              .then(user =>{
                  if(user){ 
                // req.session.errors = errors
                  //req.success.user = false;
            
            
            
                 req.session.message = {
                   type:'errors',
                   message:'user id already in use'
                 }     
                 
                    res.render('importRegion', {
                         message:req.session.message ,
                    }) 
                
            }
            else





            var cent = new Region();
            cent.prefix = prefix;
            cent.region1 = region1;
            cent.totalQty = totalQty;
          cent.totalMass = totalMass;
            cent.totalAmountSpent = totalAmountSpent;
            cent.contractMass = contractMass;
            cent.noncontractMass = noncontractMass;
            cent.contractQty = contractQty
            cent.noncontractQty = noncontractQty;
            cent.contractAmountSpent = contractAmountSpent;
            cent.noncontractAmountSpent = noncontractAmountSpent;
         
              
           
            cent.save()
              .then(grow =>{
               
              
                  
                req.session.message = {
                  type:'success',
                  message:'Success'
                }  
                res.render('importRegion',{message:req.session.message});
              })

            })
          }
                   
                    // .catch(err => console.log(err))
                  }
                  catch(e){
                    res.send(e.message)
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  })
  


module.exports = router;



function isLoggedIn(req, res, next) {
if (req.isAuthenticated()) {
    return next();
}
else{
    res.redirect('/')
}
}



















