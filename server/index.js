const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejfr6xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const usersCollection = client.db('users').collection('singleUser');

        app.post("/loginUser", async (req, res) => {
            const info = req.body;

            console.log(info)
            if (info.phone) {
                info.phone = info.phone.toString(); // Ensure phone number is a string
            }
            const result = await usersCollection.insertOne(info);
            res.send(result);
        });
        

        app.get('/singleUser', async (req, res) => {
            const { identifier, pin } = req.query; // Changed from req.params to req.query
            // console.log(typeof identifier);

            const user = await usersCollection.findOne({
                $or: [{ email: identifier }, { phone: identifier }],
                pin: pin
            });

            res.send(user)

        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Do not close the client connection here to keep the server running
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("my assets is running");
})

app.listen(port, () => {
    console.log(`My assets is running on port ${port}`);
});
