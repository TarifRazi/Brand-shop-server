const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s33xtra.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s33xtra.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    await client.connect();

    const productsCollection = client.db('techStore').collection('products');

    // for cart collection
    const cartCollection = client.db('techStore').collection('cart');

    app.get('/products/:brandName', async(req, res)=>{
      const brandName = req.params.brandName;
      const cursor = productsCollection.find({Brand_Name:brandName});
      const result = await cursor.toArray();
      res.json(result) 
    })
    app.get('/getProduct/:id', async(req, res)=>{
      const _id = req.params.id;
      const cursor = await productsCollection.findOne({ _id: new ObjectId(_id) });
      const result = await cursor;
      res.json(result) 
    })
    
    app.get('/products', async(req,res)=>{
      const result = await productsCollection.find({});
      const data = await result.toArray()
      res.send(data)
    })
    
    app.put('/getProduct/:_id', async(req,res)=>{
      const id = req.params._id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedProduct = req.body;
      
      // Check for the existence of the document before updating it
      const existingProduct = await productsCollection.findOne({_id:new ObjectId(id)});
      if (!existingProduct) {
        // Document does not exist, so create a new one
      //  const result = await productsCollection.insertOne(updatedProduct);
       res.send("not found");
      } else {
        // Document exists, so update it
        const updated = {
          $set: {
            Price: updatedProduct.Price,
            Image: updatedProduct.Image,
            Name: updatedProduct.Name,
            Short_description: updatedProduct.Short_description,
            Brand_Name: updatedProduct.Brand_Name,
            Type: updatedProduct.Type,
            Rating: updatedProduct.Rating
          }
        };
       const result =  await productsCollection.updateOne(filter, updated);
       res.send(result);
      }
      
      // Send the result back to the client
      
    })

    app.post('/products', async(req, res)=>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);
    })

    // cart related api
    app.post('/cart', async(req, res) => {
      const cart =req.body;
      console.log(cart)
      const result = await cartCollection.insertOne(cart);
      res.send(result)
    })

    app.get('/cart', async(req, res) =>{
      const cursor = cartCollection.find();
      const cart = await cursor.toArray();
      res.send(cart)
    })

    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('tech stor is cooking...!')
})

app.listen(port, () => {
    console.log(`tech store server is working at ${port}`)
})