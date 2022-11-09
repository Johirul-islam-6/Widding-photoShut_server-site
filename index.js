const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

require('dotenv').config()
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhc2Vsa2hhbmRoYWthMkBnbWFpbC5jb20iLCJpYXQiOjE2NjgwMTI1MDQsImV4cCI6MTY2ODAxNjEwNH0.hqZB6J2R5SB65MQnpDetK1xowX4EE_uk_poY_4v_0yY
//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

//Verify Access token 
// function verifyJWT(req, res, next) {

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.DB_TOKEN, function (err, decoded) {

//         if (err) {
//             return res.status(403).send({ message: 'unauthorized access2' });
//         }
//         req.decoded = decoded;
//         next()

//     })

// }


async function run() {

    try {
        const serviceCollection = client.db('My-Services').collection('services-lisht');
        const allReviw = client.db('My-Services').collection('review');
        //jwt Token Access
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.DB_TOKEN, { expiresIn: '1h' });
            res.send({ token });
        })

        //all services find data mongoDb
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        //limite data
        app.get('/servicesl', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result)
        })
        //add sevice new
        app.post('/services', async (req, res) => {
            const review = req.body;
            const result = await serviceCollection.insertOne(review);
            res.send(result)
        })
        // one service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const servicesOne = await serviceCollection.findOne(query); // .sort({ _id: -1 })
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
            //verifyJWT(),
            // const decoded = req.decoded;
            // if (decoded.email != req.query.email) {
            //     res.status(403).send({ message: 'ও সোনা এখানে কি চাও তুমার টাই email যাও' })
            // }

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
        // patch methord
        app.put('/all-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updateUser = {
                $set: {
                    customer: user?.customer,
                    message: user?.message,
                    email: user?.email,
                    serviceName: user?.serviceName,
                    reting: user?.reting,

                }
            }
            const result = await allReviw.updateOne(filter, updateUser, option);
            res.send(result);

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