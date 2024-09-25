// Import MongoClient from 'mongodb'
import { MongoClient } from "mongodb";

// MongoDB URI from your environment variable
const uri =
  "mongodb+srv://FlowMate:VkSZyGmoZc77AvVg@cluster0.pflyccd.mongodb.net/FlowMateDatabase?retryWrites=true&w=majority&appName=Cluster0";

// Function to connect to MongoDB and list documents from a specific collection
async function showCollectionDocuments(collectionName) {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db("FlowMateDatabase");
    const collection = database.collection(collectionName);

    // Fetch all documents in the collection
    const documents = await collection.find({}).toArray();

    // Display the documents
    console.log(`Documents in collection '${collectionName}':`);
    console.log(documents);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the function and pass the name of the collection you want to view
showCollectionDocuments("task"); // Replace 'yourCollectionName' with the actual collection name
