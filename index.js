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
        // post the users data from client side to server side
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email };
            const existingUser = await UsersCollections.findOne(query);
            if (existingUser) {
                res.send({ message: "User already exists", insertedId: null })
                return
        
            }
            const result = await UsersCollections.insertOne(newUser);
            res.send(result);
        });
        // get the all users from server to client side
        app.get('/users', async (req, res) => {
            const query = req.body
            const result = await UsersCollections.find(query).toArray()
            res.send(result)
        })
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
