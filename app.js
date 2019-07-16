const stuff = require('../fixtures/stuff')
const Thing = require('./models/thing')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser:true})
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongod at mongodb://localhost:27017/')
})
mongoose.connection.on('error', ()=>{
    console.log('UnExpected error while connecting to mongodb')
})

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/stuff', (req, res, next)=>{
    Thing.find().then((things)=>{
        res.status(200).json(things)
    }).catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
}).post('/api/stuff', (req, res, next)=>{
     const thing = new Thing({
         title:req.body.title,
         description:req.body.description,
         userId:req.body.userId,
         imageUrl:req.body.imageUrl,
         price:req.body.price
     })

    thing.save().then(()=>{
        res.status(201).json({
            message:'Post saved successsfully'
        })
    }).catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})

module.exports = app