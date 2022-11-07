const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

//middle wares
app.use(cors());
app.use(express.json());

//MongoDb connected

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('My-Services').collection('services-lisht');
        // const orders = client.db('geniusCar').collection('order');
        //all services find data mongoDb


    } catch (error) {
        console.log(error.name, error.message, error.stack);
    }

}
run().catch(error => console.log(error.name, error.message, error.stack))




// mongoDb ending
app.get('/', (req, res) => {
    res.send("server is runing now")
})

app.listen(port, () => {
    console.log(`Server Runing is ${port}`);
})