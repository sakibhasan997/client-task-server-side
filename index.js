const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7suhtvy.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const userCollection = client.db('ClientTast').collection('tast');

        // get user
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })
        // post user
        app.post('/addUsers', async (req, res) => {
            const body = req.body;
            const result = await userCollection.insertOne(body);
            res.send(result)
        })
        //   update the user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result)
        })
        // update mongodb
        app.put('/updateUser/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    name: body.name,
                    email: body.email,
                    phoneNumber: body.phoneNumber
                },
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })
        // deleted the user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('User is Running')
});


app.listen(port, () => {
    console.log(`server site is running port: ${port}`);
})