const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const multer = require('multer')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// app config
const app = express()

// Middle ware
app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static("volunteers"))

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipvgi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteers").collection("task");

  // post grud
  app.post('/userRegister', (req, res) => {
    const userRegister = req.body;
    collection.insertOne(userRegister)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addVolunteer', (req, res) => {
    const file = req.files.file
    const title = req.body.title
    const date = req.body.date
    const discription = req.body.discription
    console.log(title, date, discription, file);
    file.mv(`${__dirname}/volunteers/${file.name}`, err => {
      if (err) {
        console.log(err);
        return res.status(5000).send({ msg: 'image upload is failed...' })
      }
      return res.send({ name: file.name, path: `${file.name}` })
    })
  })

  // get grud 
  app.get('/userEvent', (req, res) => {
    collection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/allUser', (req, res) => {
    collection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })








});

app.get('/', (req, res) => {
  res.send('hello world')
})
app.listen(5000)
console.log('5000 Port successfully run');