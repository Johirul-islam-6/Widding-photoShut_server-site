const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);
async function run() {

    try {
        const serviceCollection = client.db('My-Services').collection('services-lisht');
        const allReviw = client.db('My-Services').collection('review');
        //all services find data mongoDb
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        // one service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const servicesOne = await serviceCollection.findOne(query);
            res.send(servicesOne)
        })

        // all review service _id filltering sen database
        app.get('/all-review', async (req, res) => {
            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = allReviw.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        //email filltering
        app.get('/all-reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = allReviw.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        //update informatin
        app.get('/all-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allReviw.findOne(query);
            res.send(result);
        })
        // Delete methort 
        app.delete('/all-reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const userDelete = await allReviw.deleteOne(query);
            res.send(userDelete);

        })
        // all review parson add
        app.post('/all-review', async (req, res) => {
            const review = req.body;
            const result = await allReviw.insertOne(review);
            res.send(result)
        })



    } catch (error) {
        console.log(error.name, error.message, error.stack);
    }

}
run().catch(error => console.log(error.name, error.message, error.stack))




// mongoDb ending
app.get('/', (req, res) => {
    res.send("server is runing now !")
})

app.listen(port, () => {
    console.log(`Server Runing is ${port}`);
})