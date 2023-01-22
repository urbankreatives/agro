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

const vonage = new Vonage({
  apiKey: "f750f235",
  apiSecret: "eOJa8pE4juTqPpNk"
})

//require('../config4/keys')

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





router.get('/',isLoggedIn, function(req,res){
  var arr = [];
  var arr1 = []
  var arr2 = []
  var arr3 = []
  var arr4=[]
  var total1,total2, total3, total4, total5, total6, total7
  //totalQty
      Region.find({}, function(err,docs){
        for(var i =0; i<docs.length;i++){
          let name = docs[i].region1
          let number 
          let id = docs[i]._id
          Grower2.find({buyingRegion:name},function(err,hods){
    number=hods.length
    Region.findByIdAndUpdate(id,{$set:{totalQty:number}},function(err,iocs){

  
    })
        
          })
        }
        })
  
  
  //totalAmountSpent
  Region.find({}, function(err,bocs){
    for(var b =0; b<bocs.length;b++){
      let name4 = bocs[b].region1
      let number1 
      let id3 = bocs[b]._id
      Grower2.find({buyingRegion:name4},function(err,hods){
  console.log('region',name4)
  console.log('length',hods.length)
  if(hods.length >=1){


  for(var q = 0;q<hods.length; q++){
  
  arr1.push(hods[q].totalIncome)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     number1=0;
    for(var z in arr1) { number1 += arr1[z]; }
  
  Region.findByIdAndUpdate(id3,{$set:{totalAmountSpent:number1}},function(err,kocs){
console.log('id3',id3)
  
  })
}else
Region.findByIdAndUpdate(id3,{$set:{totalAmountSpent:0}},function(err,kocs){
  console.log('id3',id3)
    
    })
      })
    }
    
  
    })
  
  
  
  
    //totalMass
  Region.find({}, function(err,rocs){
    for(var r =0; r<rocs.length;r++){
      let name5 = rocs[r].region1
      let number1 
      let id5 = rocs[r]._id
      Grower2.find({buyingRegion:name5},function(err,hods){
  
        if(hods.length >=1){

  for(var t = 0;t<hods.length; t++){
  
  arr4.push(hods[t].mass)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     total3=0;
    for(var l in arr4) { total3 += arr4[l]; }
  
  Region.findByIdAndUpdate(id5,{$set:{totalMass:total3}},function(err,kocs){

  
  })
}else
Region.findByIdAndUpdate(id5,{$set:{totalMass:0}},function(err,kocs){

  
})
      })
    }
    
  
    })
  
  //contractQty
  Region.find({}, function(err,vocs){
    for(var v =0; v<vocs.length;v++){
      let name6 = vocs[v].region1
      let number6
      let id6 = vocs[v]._id
      Grower2.find({buyingRegion:name6,type:'contract'},function(err,hods){
  
  number6 = hods.length
  
  Region.findByIdAndUpdate(id6,{$set:{contractQty:number6}},function(err,kocs){

  
  })
    
      })
    }
    
  
    })
  
  
  
  
  
  
  
  
  
  
  //contractMass
        Region.find({}, function(err,pocs){
          for(var p =0; p<pocs.length;p++){
            let name1 = pocs[p].region1
            let number1 
            let id1 = pocs[p]._id
            Grower2.find({buyingRegion:name1,type:'contract'},function(err,hods){
      number=hods.length
      if(hods.length >=1){

      for(var x = 0;x<hods.length; x++){
        var xId =hods[x]._id
        arr2.push(hods[x].mass)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           total=0;
          for(var n in arr2) { total += arr2[n]; }
        
      Region.findByIdAndUpdate(id1,{$set:{contractMass:total}},function(err,kocs){
     
    
      })
    }else
      
    Region.findByIdAndUpdate(id1,{$set:{contractMass:0}},function(err,kocs){
     
    
    })
          
            })
          }
          
          
          })
  
  
  
  //contractIncome
  Region.find({}, function(err,aocs){
    for(var a =0; a<aocs.length;a++){
      let name2 = aocs[a].region1
      let number1 
      let id2 = aocs[a]._id
      Grower2.find({buyingRegion:name2,type:'contract'},function(err,hods){
  
        if(hods.length >=1){
  for(var z = 0;z<hods.length; z++){
  
  arr3.push(hods[z].totalIncome)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     total1=0;
    for(var z in arr3) { total1 += arr3[z]; }
  
  Region.findByIdAndUpdate(id2,{$set:{contractAmountSpent:total1}},function(err,kocs){

  
  })
}
else
Region.findByIdAndUpdate(id2,{$set:{contractAmountSpent:0}},function(err,kocs){

  
})
    
      })
    }
    
  
    })
  
    
  
     //totalQty noncontract
     Region.find({}, function(err,docs){
      for(var i =0; i<docs.length;i++){
        let name = docs[i].region1
        let number 
        let id = docs[i]._id
        Grower2.find({buyingRegion:name,type:'noncontract'},function(err,hods){
  number=hods.length
  Region.findByIdAndUpdate(id,{$set:{noncontractQty:number}},function(err,iocs){


  })
      
        })
      }
      })

  
  //noncontractMass
  Region.find({}, function(err,pocs){
    for(var p =0; p<pocs.length;p++){
      let name1 = pocs[p].region1
      let number1 
      let id1 = pocs[p]._id
      let totalX
      let arrx = []
      Grower2.find({buyingRegion:name1,type:'noncontract'},function(err,hods){
  number=hods.length
  if(hods.length >=1){
  for(var x = 0;x<hods.length; x++){
  var xId =hods[x]._id
  arr.push(hods[x].mass)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     totalX=0;
    for(var n in arrx) { totalX += arrx[n]; }
  
  Region.findByIdAndUpdate(id1,{$set:{contractMass:totalX}},function(err,kocs){
  
  
  })
  }else
  Region.findByIdAndUpdate(id1,{$set:{contractMass:0}},function(err,kocs){
  
  
  })

      })
    }
   
    })
  
  
//noncontactAmountSpent
    Region.find({}, function(err,pocs){
      for(var p =0; p<pocs.length;p++){
        let name1 = pocs[p].region1
        let number1 
        let id1 = pocs[p]._id
        let totalX
        let arrx = []
        Grower2.find({buyingRegion:name1,type:'noncontract'},function(err,hods){
    number=hods.length
    if(hods.length >=1){
    for(var x = 0;x<hods.length; x++){
    var xId =hods[x]._id
    arrx.push(hods[x].totalIncome)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       totalX=0;
      for(var n in arrx) { totalX += arrx[n]; }
    
    Region.findByIdAndUpdate(id1,{$set:{noncontractAmountSpent:totalX}},function(err,kocs){
    
    
    })
    }else
    Region.findByIdAndUpdate(id1,{$set:{noncontractAmountSpent:0}},function(err,kocs){
    
    
    })
  
        })
      }
     // res.render('dashboard/chart')
     res.render('dashboard/chart')
      
      })
  
  
  
  
  
  
  })
  
  
  









//contracted farmers dashboard


  router.get('/contract',isLoggedIn, function(req,res){
    var arr = [];
    var arr1 = []
    var arr2 = []
    var arr3 = []
    var arr4=[]
    var total1,total2, total3, total4, total5, total6, total7
    
    
    
    
    //contractQty
    Region.find({}, function(err,vocs){
      for(var v =0; v<vocs.length;v++){
        let name6 = vocs[v].region1
        let number6
        let id6 = vocs[v]._id
        Grower2.find({buyingRegion:name6,type:'contract'},function(err,hods){
    
    number6 = hods.length
    
    Region.findByIdAndUpdate(id6,{$set:{contractQty:number6}},function(err,kocs){
  
    
    })
      
        })
      }
      
    
      })
    
    
    
    
    
    
    
    
    
    
    //contractMass
          Region.find({}, function(err,pocs){
            for(var p =0; p<pocs.length;p++){
              let name1 = pocs[p].region1
              let number1 
              let id1 = pocs[p]._id
              Grower2.find({buyingRegion:name1,type:'contract'},function(err,hods){
        number=hods.length
        if(hods.length >=1){
  
        for(var x = 0;x<hods.length; x++){
          var xId =hods[x]._id
          arr2.push(hods[x].mass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
             total=0;
            for(var n in arr2) { total += arr2[n]; }
          
        Region.findByIdAndUpdate(id1,{$set:{contractMass:total}},function(err,kocs){
       
      
        })
      }else
        
      Region.findByIdAndUpdate(id1,{$set:{contractMass:0}},function(err,kocs){
       
      
      })
            
              })
            }
            
            
            })
    
    
    
    //contractIncome
    Region.find({}, function(err,aocs){
      for(var a =0; a<aocs.length;a++){
        let name2 = aocs[a].region1
        let number1 
        let id2 = aocs[a]._id
        Grower2.find({buyingRegion:name2,type:'contract'},function(err,hods){
    
          if(hods.length >=1){
    for(var z = 0;z<hods.length; z++){
    
    arr3.push(hods[z].totalIncome)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       total1=0;
      for(var z in arr3) { total1 += arr3[z]; }
    
    Region.findByIdAndUpdate(id2,{$set:{contractAmountSpent:total1}},function(err,kocs){
  
    
    })
  }
  else
  Region.findByIdAndUpdate(id2,{$set:{contractAmountSpent:0}},function(err,kocs){
  
    
  })
      
        })
      }
      res.render('dashboard/chart2')
      
    
      })
    
      
    
  
    
    
    
    
    
    })
    
    
    
  
  
  


    //noncontracted farmers dashboard



    
  router.get('/noncontract',isLoggedIn, function(req,res){
    var arr = [];
    var arr1 = []
    var arr2 = []
    var arr3 = []
    var arr4=[]
    var total1,total2, total3, total4, total5, total6, total7
    
    
    
    
    //noncontractQty
    Region.find({}, function(err,vocs){
      for(var v =0; v<vocs.length;v++){
        let name6 = vocs[v].region1
        let number6
        let id6 = vocs[v]._id
        Grower2.find({buyingRegion:name6,type:'noncontract'},function(err,hods){
    
    number6 = hods.length
    
    Region.findByIdAndUpdate(id6,{$set:{noncontractQty:number6}},function(err,kocs){
  
    
    })
      
        })
      }
      
    
      })
    
    
    
    
    
    
    
    
    
    
    //noncontractMass
    Region.find({}, function(err,pocs){
      for(var p =0; p<pocs.length;p++){
        let name1 = pocs[p].region1
        let number1 
        let id1 = pocs[p]._id
        Grower2.find({buyingRegion:name1,type:'noncontract'},function(err,hods){
  number=hods.length
  if(hods.length >=1){

  for(var x = 0;x<hods.length; x++){
    var xId =hods[x]._id
    arr2.push(hods[x].mass)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       total=0;
      for(var n in arr2) { total += arr2[n]; }
    
  Region.findByIdAndUpdate(id1,{$set:{noncontractMass:total}},function(err,kocs){
 

  })
}else
  
Region.findByIdAndUpdate(id1,{$set:{noncontractMass:0}},function(err,kocs){
 

})
      
        })
      }
      
      
      })

    
    
    //noncontractIncome
    Region.find({}, function(err,aocs){
      for(var a =0; a<aocs.length;a++){
        let name2 = aocs[a].region1
        let number1 
        let id2 = aocs[a]._id
        Grower2.find({buyingRegion:name2,type:'noncontract'},function(err,hods){
    
          if(hods.length >=1){
    for(var z = 0;z<hods.length; z++){
    
    arr3.push(hods[z].totalIncome)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       total1=0;
      for(var z in arr3) { total1 += arr3[z]; }
    
    Region.findByIdAndUpdate(id2,{$set:{noncontractAmountSpent:total1}},function(err,kocs){
  
    
    })
  }
  else
  Region.findByIdAndUpdate(id2,{$set:{noncontractAmountSpent:0}},function(err,kocs){
  
    
  })
      
        })
      }
      res.render('dashboard/chart3')
      
    
      })
    
      
    
  
    
    
    
    
    
    })
    
    
    
  
  
  
  //buying centers stats 
 
router.get('/centers',isLoggedIn, function(req,res){
  var arr = [];
  var arr1 = []
  var arr2 = []
  var arr3 = []
  var arr4=[]
  var total1,total2, total3, total4, total5, total6, total7
  //totalQty
      Center.find({}, function(err,docs){
        for(var i =0; i<docs.length;i++){
          let name = docs[i].center
          let number 
          let id = docs[i]._id
          Grower2.find({buyingCenter:name},function(err,hods){
    number=hods.length
    Center.findByIdAndUpdate(id,{$set:{totalQty:number}},function(err,iocs){

  
    })
        
          })
        }
        })
  
  
  //totalAmountSpent
  Center.find({}, function(err,bocs){
    for(var b =0; b<bocs.length;b++){
      let name4 = bocs[b].center
      let number1 
      let id3 = bocs[b]._id
      Grower2.find({buyingCenter:name4},function(err,hods){
  console.log('region',name4)
  console.log('length',hods.length)
  if(hods.length >=1){


  for(var q = 0;q<hods.length; q++){
  
  arr1.push(hods[q].totalIncome)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     number1=0;
    for(var z in arr1) { number1 += arr1[z]; }
  
  Center.findByIdAndUpdate(id3,{$set:{totalAmountSpent:number1}},function(err,kocs){
console.log('id3',id3)
  
  })
}else
Center.findByIdAndUpdate(id3,{$set:{totalAmountSpent:0}},function(err,kocs){
  console.log('id3',id3)
    
    })
      })
    }
    
  
    })
  
  
  
  
    //totalMass
  Center.find({}, function(err,rocs){
    for(var r =0; r<rocs.length;r++){
      let name5 = rocs[r].center
      let number1 
      let id5 = rocs[r]._id
      Grower2.find({buyingCenter:name5},function(err,hods){
  
        if(hods.length >=1){

  for(var t = 0;t<hods.length; t++){
  
  arr4.push(hods[t].mass)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     total3=0;
    for(var l in arr4) { total3 += arr4[l]; }
  
  Center.findByIdAndUpdate(id5,{$set:{totalMass:total3}},function(err,kocs){

  
  })
}else
Center.findByIdAndUpdate(id5,{$set:{totalMass:0}},function(err,kocs){

  
})
      })
    }
    
  
    })
  
  //contractQty
  Center.find({}, function(err,vocs){
    for(var v =0; v<vocs.length;v++){
      let name6 = vocs[v].center
      let number6
      let id6 = vocs[v]._id
      Grower2.find({buyingCenter:name6,type:'contract'},function(err,hods){
  
  number6 = hods.length
  
  Center.findByIdAndUpdate(id6,{$set:{contractQty:number6}},function(err,kocs){

  
  })
    
      })
    }
    
  
    })
  
  
  
  
  
  
  
  
  
  
  //contractMass
        Center.find({}, function(err,pocs){
          for(var p =0; p<pocs.length;p++){
            let name1 = pocs[p].center
            let number1 
            let id1 = pocs[p]._id
            Grower2.find({buyingCenter:name1,type:'contract'},function(err,hods){
      number=hods.length
      if(hods.length >=1){

      for(var x = 0;x<hods.length; x++){
        var xId =hods[x]._id
        arr2.push(hods[x].mass)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           total=0;
          for(var n in arr2) { total += arr2[n]; }
        
      Center.findByIdAndUpdate(id1,{$set:{contractMass:total}},function(err,kocs){
     
    
      })
    }else
      
    Center.findByIdAndUpdate(id1,{$set:{contractMass:0}},function(err,kocs){
     
    
    })
          
            })
          }
          
          
          })
  
  
  
  //contractIncome
  Center.find({}, function(err,aocs){
    for(var a =0; a<aocs.length;a++){
      let name2 = aocs[a].center
      let number1 
      let id2 = aocs[a]._id
      Grower2.find({buyingCenter:name2,type:'contract'},function(err,hods){
  
        if(hods.length >=1){
  for(var z = 0;z<hods.length; z++){
  
  arr3.push(hods[z].totalIncome)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     total1=0;
    for(var z in arr3) { total1 += arr3[z]; }
  
  Center.findByIdAndUpdate(id2,{$set:{contractAmountSpent:total1}},function(err,kocs){

  
  })
}
else
Center.findByIdAndUpdate(id2,{$set:{contractAmountSpent:0}},function(err,kocs){

  
})
    
      })
    }
    
  
    })
  
    
  
     //totalQty noncontract
     Center.find({}, function(err,docs){
      for(var i =0; i<docs.length;i++){
        let name = docs[i].center
        let number 
        let id = docs[i]._id
        Grower2.find({buyingCenter:name,type:'noncontract'},function(err,hods){
  number=hods.length
  Center.findByIdAndUpdate(id,{$set:{noncontractQty:number}},function(err,iocs){


  })
      
        })
      }
      })

  
  //noncontractMass
  Center.find({}, function(err,pocs){
    for(var p =0; p<pocs.length;p++){
      let name1 = pocs[p].center
      let number1 
      let id1 = pocs[p]._id
      let totalX
      let arrx = []
      Grower2.find({buyingCenter:name1,type:'noncontract'},function(err,hods){
  number=hods.length
  if(hods.length >=1){
  for(var x = 0;x<hods.length; x++){
  var xId =hods[x]._id
  arr.push(hods[x].mass)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     totalX=0;
    for(var n in arrx) { totalX += arrx[n]; }
  
  Center.findByIdAndUpdate(id1,{$set:{contractMass:totalX}},function(err,kocs){
  
  
  })
  }else
  Center.findByIdAndUpdate(id1,{$set:{contractMass:0}},function(err,kocs){
  
  
  })

      })
    }
   
    })
  
  
//noncontactAmountSpent
    Center.find({}, function(err,pocs){
      for(var p =0; p<pocs.length;p++){
        let name1 = pocs[p].center
        let number1 
        let id1 = pocs[p]._id
        let totalX
        let arrx = []
        Grower2.find({buyingRegion:name1,type:'noncontract'},function(err,hods){
    number=hods.length
    if(hods.length >=1){
    for(var x = 0;x<hods.length; x++){
    var xId =hods[x]._id
    arr.push(hods[x].totalIncome)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       totalX=0;
      for(var n in arrx) { totalX += arrx[n]; }
    
    Center.findByIdAndUpdate(id1,{$set:{contractAmountSpent:totalX}},function(err,kocs){
    
    
    })
    }else
    Center.findByIdAndUpdate(id1,{$set:{contractAmountSpent:0}},function(err,kocs){
    
    
    })
  
        })
      }
      Center.find({},function (err, nocs) {
        var centerChunks = [];
        var centerSize = 3;
        for (var i = 0; i < nocs.length; i += centerSize) {
            centerChunks.push(nocs.slice(i, i + centerSize));
            console.log(nocs.length)
        }
        res.render('dashboard/stats', { center: centerChunks,});
      });
      
      })
  
  
  
  
  
  
  })
  
  
  



































//adding buying center in the system
router.get('/addCenter',isLoggedIn, function(req,res){
    Region.find(function(err,docs){
      Center.find(function(err,focs){
       res.render('admin/regions',{arr1:docs, list:focs,user:req.user,admin:req.user.role=='admin'
   
       })
     })
   })
   
   
  })
  
  
  
  
  
  
  
  //adding buying region into the system
  router.get('/addRegion',isLoggedIn, function(req,res){
    Region.find(function(err,docs){
      Center.find(function(err,focs){
  res.render('admin/regions',{arr1:docs,
   user:req.user,list:focs
  })
  })
  })
  })
  
  
   router.post('/addCenter',isLoggedIn, function(req,res){
  
  
     req.check('center','Buying Center').notEmpty();
            req.check('region','Enter Buying region').notEmpty();
     
            var errors = req.validationErrors();
  
  
          
              if (errors) {
               var arr1=[]  
               Region.find({}, function(err,docs){
                 arr1=docs;
                  req.session.errors = errors;
                  req.session.success = false;
                  res.render('admin/regions',{ errors:req.session.errors,user:req.user,arr1:arr1})
               })
              }
   
           
         else{
          
     
             var center = new Center();
                     center.center = req.body.center;
                     center.region = req.body.region;
                    center.totalQty = 0;
                    center.totalMass = 0;
                    center.totalAmountSpent = 0;
                    center.contractMass = 0;
                    center.noncontractMass = 0;
                    center.contractQty = 0;
                    center.noncontractQty = 0;
                    center.contractAmountSpent = 0;
                    center.noncontractAmountSpent = 0;

                   
                    
                     center.save()
                       .then(center =>{
                         var arr1=[]  
                         Region.find({}, function(err,docs){
                           Center.find({},function(err,focs){
                           arr1=docs;
                         req.session.message = {
                           type:'success',
                           message:'Buying Center added'
                         }  
                         res.render('admin/regions',{message:req.session.message,arr1:arr1, user:req.user,list:focs,list:focs});
                       })
                     })
                     })
                       .catch(err => console.log(err))
                     
                     
                     }
                      });
             
  
    
               
  //add category
  router.post('/addRegion', isLoggedIn, function(req,res){
  req.check('region1','Enter Buying Region').notEmpty();
  
  
  var errors1 = req.validationErrors();
      
  if (errors1) {
   var arr1=[]  
   Region.find({}, function(err,docs){
     Center.find(function(err,focs){
     arr1=docs;
   req.session.errors = errors1;
   req.session.success = false;
   res.render('contract/regions',{ errors1:req.session.errors,user:req.user,list:focs, arr1:arr1})
   })
  })
  }
  else{
  
  var reg = new Region();
 
  reg.region1 = req.body.region1;
  reg.totalQty = 0;
  reg.totalMass = 0;
  reg.totalAmountSpent = 0;
  reg.contractMass = 0;
  reg.noncontractMass = 0;
  reg.contractQty = 0;
  reg.noncontractQty = 0;
  reg.contractAmountSpent = 0;
  reg.noncontractAmountSpent = 0;
  reg.prefix = "null"
  
  
  
  reg.save()
   .then(reg =>{
     Region.find({}, function(err,docs){
       Center.find({},function(err,focs){
       arr1=docs;
     req.session.message = {
       type:'success',
       message:'Buying Region added'
     }  
     res.render('admin/regions',{message6:req.session.message, user:req.user, arr1:arr1,list:focs,list:focs});
   })
  })
  })
   .catch(err => console.log(err))
  
  
  }
  
  
  
  
  
  
  
  })                 
   
  
router.get('/import',isLoggedIn,function(req,res){
res.render('admin/import')
})
  

  
router.post('/import',isLoggedIn,upload.single('myFile'),function(req,res){
 
    
      if(!req.file){
          req.session.message = {
            type:'errors',
            message:'Select File!'
          }     
            res.render('admin/import', {message:req.session.message,grower:req.body,admin:req.user.role=='admin'}) 
          }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
              req.session.message = {
                  type:'errors',
                  message:'Upload Excel File'
                }     
                  res.render('admin/import', {message:req.session.message,grower:req.body,admin:req.user.role=='admin', user:req.user
                       
                   }) 
    
    
    
          }
            
          else{
              const file = req.file.filename;
      
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
     
             
        Center.findOne({'center':record.center,'region':record.region})
        .then(clax =>{
            if(clax){ 
          
       res.redirect('/dash/listX')
            }else
               
                     var center = new Center();
                      center.center = record.center;
                      center.region = record.region;
                    
                  
                       
              
                       center.save()
                       .then(center =>{ 
                       
    
                     
                        res.redirect('/dash/listX')
                    
                       })
                       .catch(err => console.log(err))
                   
                       });
                     
                     
                      })
               
           }
        
          }
    
    
    })
    
   
     //they can also see the students who hold their books 
  
router.get('/listX',isLoggedIn, (req, res) => {
  
  Center.find((err, docs) => {
      if (!err) {
          res.render("admin/list", {
              list: docs
              
          });
      }
      else {
          console.log('Error in retrieving Center list :' + err);
      }
  });
});




    
module.exports = router;



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}





