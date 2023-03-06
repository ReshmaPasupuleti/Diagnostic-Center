var express= require('express');
var path= require('path');
var bodyParser= require('body-parser');
var mongo= require('mongoose');

var db = mongo.connect("mongodb://localhost:27017/DiagnosticCenter", function(err, response){
    if(err){console.log(err);}
    else{ console.log('conntected to '+ db,' + ', response);}
});


var app = express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var Schema = mongo.Schema;
var AddressSchema = new Schema({
    firstLine:{type:String},
    secondLine:{type:String},
    city:{type:String},
    state:{type:String},
    country:{type:String},
    zip:{type:Number}
}, { versionKey: false })

var EmployeeSchema = new Schema({
    name:{type:String, required: true },
    email:{type:String, required: true },
    password: {type: String, required: true },
    mobileNumber:{type:Number, required: true },
    address:{
        type: AddressSchema,
        required: true
    }
}, { versionKey: false });
var employeeModel = mongo.model('employee', EmployeeSchema, 'employee');

var PatientSchema = new Schema({
    name:{type:String, required: true },
    email:{type:String, required: true },
    password: {type: String, required: true },
    mobileNumber:{type:Number, required: true },
    address:[{
        type: AddressSchema,
        required: true
    }]
}, { versionKey: false });
var patientModel = mongo.model('patient', PatientSchema, 'patient');

var TestSchema = new Schema({
    name:{type:String, required: true },
    description:{type:String, required: true },
    price:{type:Number, required: true },
}, { versionKey: false });
var testModel = mongo.model('test', TestSchema, 'test');

var TestSlotSchema = new Schema({
    status:{type:String, required: true },
    time:{type:Date, required: true},
    test:{
        type:TestSchema,
        required: true
    },
    employee:{
        type:EmployeeSchema
    },
    reportSent:{type:Boolean}
})

var PaymentSchema = new Schema({
    cardOwner:{type:String, required: true },
    cardNumber:{type:String, required: true },
    expiry:{type:String, required: true }
}, { versionKey: false });

var OrderSchema = new Schema({
    totalAmount:{type:Number, required: true },
    testSlots:[{
        type: TestSlotSchema,
        required: true,
    }],
    payment:{
        type: PaymentSchema,
        required: true,
    },
    patient:{
        type:PatientSchema,
        required: true
    }
}, { versionKey: false });
var orderModel = mongo.model('order', OrderSchema, 'order');

app.post("/api/register/patient", function(req, res){
    var mod = new patientModel(req.body);
        mod.save(function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({
                    message:"Patient Account Created Successfully",
                    data:data
                });
            }
        });
});
app.post("/api/register/employee", function(req, res){
    var mod = new employeeModel(req.body);
        mod.save(function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({
                    message:"Employee Account Created Successfully",
                    data:data
                });
            }
        });
});

app.post("/api/login", function(req, res){
    if(req.body.type =='employee'){
        employeeModel.find({email:req.body.email,password:req.body.password},function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({
                    message:"Login Successfully",
                    data:data
                });
            }
        });
    }
    else if(req.body.type=='patient'){
        patientModel.find({email:req.body.email,password:req.body.password},function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({
                    message:"Login Successfully",
                    data:data
                });
            }
        });
    }
    
});

app.get("/api/tests", function(req, res){
    testModel.find({},function(err,data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});

app.post("/api/tests/create", function(req, res){
    var mod = new testModel(req.body);
        mod.save(function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({message:"Test Created Successfully"});
            }
        });
});

app.delete("/api/tests/delete/:id", function(req, res){
    testModel.findByIdAndRemove(req.params.id,req.body, function(err,data)
    {
        if(err){
            res.send(err);
        }
        else{
            res.send({message:"Test Deleted Successfully"});
        }
    });
});

app.post("/api/orders/create", function(req, res){
    var mod = new orderModel(req.body);
        mod.save(function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({message:"Order Placed Successfully",data});
            }
        });
});
app.put("/api/orders/update", function(req, res){
    var query = {'_id': req.body._id};
    orderModel.findOneAndUpdate(query, req.body, {upsert: true},function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.send({message:"Order Updated Successfully",data});
            }
        });
});



app.get("/api/orders/patient/:userId", function(req, res){
    orderModel.find({"patient._id":req.params.userId},function(err,data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});

app.get("/api/orders/:orderId", function(req, res){
    orderModel.find({"_id":req.params.orderId},function(err,data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});

app.get("/api/orders", function(req, res){
    orderModel.find({},function(err,data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});

app.listen(8080, function(){
    console.log('App listening on port 8080!')
})


