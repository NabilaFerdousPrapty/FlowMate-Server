require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 7000;


app.use(cors(
    {
        origin:["*","http://localhost:5173"],
        credentials:true
        
    }
))
app.use(express.json());




const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const UsersCollections= client.db("FlowMateDB").collection("Users");




async function dbConnect() {
    try {
        // await client.db('admin').command({ ping: 1 })
        console.log('You successfully connected to MongoDB!')
    } catch (err) {
        console.log(err)
    }
}
dbConnect()


app.get('/', (req, res) => {
    res.send('Fitness trainer is running!');
});









app.listen(port, () => {
    console.log(`Server is running on port: ${ port }`);
});
