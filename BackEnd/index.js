const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u4xav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Final Hackathon"); 
    // collections
    const userCollections = database.collection("users");
    const classCollections = database.collection("class");
    const cartCollections = database.collection("cart");
    const paymentCollections = database.collection("payment");
    const enrollmentCollections = database.collection("enrollment");
    const appliedCollections = database.collection("applied");
    // classes routes
    app.post('/new-class', async (req, res) => {
        const newClass = req.body;
        const result = await classCollections.insertOne(newClass);
        res.send(result);
    });

    app.get('/classes', async (req, res) => {
        const query = {status: "approved"};
        const classes = await classCollections.find(query).toArray();
        res.send(classes);
    });
     
    app.get('/classes/:email', async (req, res) => {
        const email = req.params.email;
      const query = {instructorEmail: email};
      const classes = await classCollections.find(query).toArray();
      res.send(classes);
    });

    app.get('/classes-manage', async (req, res) => {
        const classes = await classCollections.find(query).toArray();
        res.send(classes);
    });

    app.patch('/change-status/:id', async (req, res) => {
        const id = req.params.id;
        const status = req.body.status;
        const reason = req.body.reason;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
                status: status,
                  reason: reason
                }
            };
        const result = await classCollections.updateOne(filter, updateDoc, options);
        res.send(result);
    });

    app.get('/approved-classes', async (req,res)=>{
        const query = {status: "approved"};
        const classes = await classCollections.find(query).toArray();
        res.send(classes);
    });
    
    app.get('/class/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await classCollections.findOne(query);
        res.send(result);
    });

    app.get ('/update-class/:id', async (req,res)=>{
        const id = req.params.id;
        const updateClass = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
                 name: updateClass.name,
                 description: updateClass.description,
                 price: updateClass.price,
                 availableSeats: updateClass.availableSeats,
                 videoLink: updateClass.videoLink,
                 status: 'pending'
            }
        };
        const result = await classCollections.updateOne(filter, updateDoc, options);
        res.send(result);
    });

















    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello developer!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})  
