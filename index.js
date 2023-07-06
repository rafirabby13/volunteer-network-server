const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

//volunteerUser
//MCJdvwBIb0B4kSZF
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bbiovs6.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({message: 'Unauthorize access'})
    
  }
const token = authHeader.split(' ')[1];
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
  if (error) {
    res.status(401).send({message: 'Unauthorize access'})
  }
  req.decoded = decoded;
  next();
})
  
}



async function run() {
  try {
    const volunteerCollection = client.db('volunteerCollectionNetwork').collection('volunteer');
    const checkoutCollection = client.db('volunteerCollectionNetwork').collection('checkout');


    //jwt token er kaj
    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10h'});
      res.send({token})

    })



    app.get('/volunteer',async(req,res)=>{
        const query = {};
        const cursor = volunteerCollection.find(query);
        const reuslt = await cursor.toArray();
        res.send(reuslt); 

    });
    app.get('/volunteer/:id',async(req,res)=>{
        const id = req.params.id;
        // console.log(id);
        const query = {_id: new ObjectId(id)};
        const result =await volunteerCollection.findOne(query);
        // const result = await result.toArray();
        // console.log(cursor);
        res.send(result); 

    });
    app.delete('/volunteer/:id',async(req,res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const result =await volunteerCollection.deleteOne(query);
      // const result = await result.toArray();
      // console.log(cursor);
      res.send(result); 

  });

  app.delete('/checkout/:id',async(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    const query = {_id: new ObjectId(id)};
    const result =await checkoutCollection.deleteOne(query);
    // const result = await result.toArray();
    console.log(result);
    res.send(result); 

});


    app.post('/checkout',async(req,res)=>{
        const checkoutData=req.body;
        console.log(checkoutData);
        const data={
          name: checkoutData.name,
          address: checkoutData.address,
          age: checkoutData.age,
          serviceName: checkoutData.serviceName,
          img: checkoutData.img,
          email: checkoutData.email

        }
        const result = await checkoutCollection.insertOne(data)
        // const cursor = volunteerCollection.find(query);
        // const reuslt = await cursor.toArray();
        res.send(result); 

    });
    app.post('/addEvent',async(req,res)=>{
      const addEventData=req.body;
      // console.log(checkoutData);
      const data={
        img: addEventData.url,
        title:addEventData.des 

      }
      const result = await volunteerCollection.insertOne(data)
      // const cursor = volunteerCollection.find(query);
      // const reuslt = await cursor.toArray();
      res.send(result); 

  });
    app.get('/checkout', async(req,res)=>{
      // const data = req.query;
      // console.log(data);
      // const decoded = req.decoded;
      // console.log('inside orders api',decoded);
      // if (decoded.email !== req.query.email) {
      //   res.send({message: 'unauthorized'})
      // }


      let query = {};
      if (req.query.email) {
        query={ 
          email:req.query.email
        }
      }
      const cursor = checkoutCollection.find(query);
      const reuslt = await cursor.toArray();
      res.send(reuslt); 

  });


  app.get('/userList', async(req,res)=>{
    

    let query = {};
    
    const cursor = checkoutCollection.find(query);
    const reuslt = await cursor.toArray();
    res.send(reuslt); 

});




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})