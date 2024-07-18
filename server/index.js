const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

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
        const paymentsCollection = client.db("users").collection("payments");

        app.post("/loginUser", async (req, res) => {
            const info = req.body;
            if (info.phone) {
                info.phone = info.phone.toString(); // Ensure phone number is a string
            }
            try {
                const result = await usersCollection.insertOne(info);
                res.send(result);
            } catch (error) {
                console.error('Error inserting user:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/singleUser', async (req, res) => {
            const { identifier, pin } = req.query; // Changed from req.params to req.query
            try {
                const user = await usersCollection.findOne({
                    $or: [{ email: identifier }, { phone: identifier }],
                    pin: pin
                });
                res.send(user);
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/allUser', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });


        // for agent 
        app.get('/Users', async (req, res) => {
            const user = { role: "User" }
            const result = await usersCollection.find(user).toArray();
            res.send(result);
        });

        app.put('/CashIn', async (req, res) => {
            const { agentPhone, userId } = req.body;

            const user = await usersCollection.findOne({ _id: new ObjectId (userId) });
            console.log(user)
            const agent = await usersCollection.findOne({ phone: agentPhone });

            if (user && agent && user.cashIn_request <= agent.balance) {
                const newUserBalance = user.balance + user.cashIn_request;
                const newAgentBalance = agent.balance - user.cashIn_request;

                await usersCollection.updateOne(
                    { _id: new ObjectId (userId) },
                    { $set: { balance: newUserBalance, status: 'approved', cashIn_request: 0 } }
                );

                await usersCollection.updateOne(
                    { phone: agentPhone },
                    { $set: { balance: newAgentBalance } }
                );

                res.send({ message: 'Cash-in successful' });
            } else {
                res.status(400).send({ message: 'Insufficient balance or invalid request' });
            }
        });


        app.post('/sendMoney', async (req, res) => {
            const { recipientPhone, amount, senderPhone, pin } = req.body;

            if (amount < 50) {
                return res.status(400).json({ success: false, message: "Minimum amount to send is 50 Taka." });
            }

            try {
                const senderAccount = await usersCollection.findOne({ phone: senderPhone });
                if (!senderAccount) {
                    return res.status(404).json({ success: false, message: "Sender not found." });
                }

                if (senderAccount.pin !== pin) {
                    return res.status(401).json({ success: false, message: "Invalid PIN." });
                }

                const recipientAccount = await usersCollection.findOne({ phone: recipientPhone });
                if (!recipientAccount) {
                    return res.status(404).json({ success: false, message: "Recipient not found." });
                }

                let fee = 0;
                if (amount > 100) {
                    fee = 5;
                }

                if (senderAccount.balance < amount + fee) {
                    return res.status(400).json({ success: false, message: "Insufficient balance." });
                }

                await usersCollection.updateOne(
                    { phone: senderPhone },
                    { $inc: { balance: -(amount + fee) } }
                );

                await usersCollection.updateOne(
                    { phone: recipientPhone },
                    { $inc: { balance: amount } }
                );

                const payment = {
                    senderPhone,
                    recipientPhone,
                    amount,
                    fee,
                    date: new Date(),
                };

                await paymentsCollection.insertOne(payment);

                res.status(200).json({ success: true, message: "Money sent successfully." });
            } catch (error) {
                console.error('Error sending money:', error);
                res.status(500).json({ success: false, message: "Server error." });
            }
        });


        // cash out

        app.post('/cashOut', async (req, res) => {
            const { amount, pin, phone, name } = req.body;

            console.log(amount, pin, phone, name)

            if (amount < 50) {
                return res.status(400).json({ success: false, message: "Minimum amount to send is 50 Taka." });
            }

            const user = await usersCollection.findOne({ phone: phone, name: name });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found or invalid PIN." });
            }

            // const isPinValid = await bcrypt.compare(pin, user.pin);
            // if (!isPinValid) {
            //     return res.status(401).json({ success: false, message: "Invalid PIN." });
            // }

            if (user.pin !== pin) {
                return res.status(401).json({ success: false, message: "Invalid PIN." });
            }

            // const agent = await usersCollection.findOne({ role: 'user' });
            // if (!agent) {
            //     return res.status(404).json({ success: false, message: "user not found." });
            // }

            const fee = amount * 0.015;
            const totalDeduction = amount + fee;

            if (user.balance < totalDeduction) {
                return res.status(400).json({ success: false, message: "Insufficient balance." });
            }

            await usersCollection.updateOne(
                { phone: phone },
                { $inc: { balance: -totalDeduction } }
            );

            await usersCollection.updateOne(
                { phone: user.phone },
                { $inc: { balance: fee } }
            );

            res.status(200).json({ success: true, message: 'Cash out successful' });
        });

        // app.put('/cashIn', async (req, res) => {
        //     const { amount, pin, phone, name, agentPhone } = req.body;

        //     const user = await usersCollection.findOne({ phone: phone, name: name });
        //     if (!user) {
        //         return res.status(404).json({ success: false, message: "User not found or invalid PIN." });
        //     }

        //     if (user.pin !== pin) {
        //         return res.status(401).json({ success: false, message: "Invalid PIN." });
        //     }

        //     const agent = await usersCollection.findOne({ phone: agentPhone, role: 'agent' });
        //     if (!agent) {
        //         return res.status(404).json({ success: false, message: "Agent not found." });
        //     }

        //     if (agent.balance < amount) {
        //         return res.status(400).json({ success: false, message: "Agent has insufficient balance." });
        //     }

        //     // Assuming the agent approves the transaction
        //     const agentApproval = true; // This would be an actual check in a real scenario

        //     if (agentApproval) {
        //         await usersCollection.updateOne(
        //             { phone: phone },
        //             { $inc: { balance: amount } }
        //         );

        //         await usersCollection.updateOne(
        //             { phone: agent.phone },
        //             { $inc: { balance: -amount } }
        //         );

        //         res.status(200).json({ success: true, message: 'Cash in successful' });
        //     } else {
        //         res.status(403).json({ success: false, message: 'Agent did not approve the transaction' });
        //     }
        // });



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("my assets is running");
});

app.listen(port, () => {
    console.log(`My assets is running on port ${port}`);
});
