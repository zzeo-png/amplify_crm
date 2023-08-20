const express = require('express')
const session = require('express-session')
const axios = require('axios')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const cors = require('cors')

mongoose.set('strictQuery', 'false')
// connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/amplify_LMS', { useNewUrlParser: true })
.then(() => {
    console.log("Connected to DB")
})
.catch((err) => {
    console.error("Error connecting to DB", err)
})

// models
const User = require('./models/user')

const PORT = 3001
const app = express()

const FACEBOOK_PAGE_ACCESS_TOKEN = 'EAAMCHpZA3LvYBOyUR39XtAk6rVULZA7RBcyAdX4mn1FvBM8MLzPSe5ZAC1NDHTUoSgw8s6jOjEgT3ZAFEQkBtTqPSX4lAR6E7nlF1b16ZCNP9UMyMyCZAZCl71yMNidEEYytY1j5pdGarILOVO8gO7ybOHtw2L9b8ApxuDCGMPlNLLImrF2gvMaPr625831ZB7MZD'

app.use(bodyParser.json())
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false
}))

app.use(cors({
    origin: [ "http://localhost:3000" ],
    credentials: true,
    cookie: { secure: false }
}))

app.post('/api/user/register', async (req, res) => {
    try{
        //if(req.session.admin){
            const { username, name, password } = req.body

            // check if user already exists
            const existingUser = await User.findOne({ username })
            if(existingUser){
                return res.status(403).json({ message: "user already exists" })
            }

            // hash password
            const salt = await bcrypt.genSalt()
            const hashedPass = await bcrypt.hash(password, salt)

            // create user
            const newUser = new User({ username: username, name: name, password: hashedPass })
            await newUser.save()

            return res.status(202).json({ message: "user registered" })
        //}
        //else{
        //    return res.status(402).json({ message: "insufficient permissions" })
        //}
    } catch (err) {
        console.error("Error registering user", err)
        return res.status(500).json({ message: "server error" })
    }
})

app.post('/api/user/login', async (req, res) => {
    try{
        const { username, password } = req.body
        // try to find user
        const user = await User.findOne({ username })
        if(!user){
            return res.status(410).json({ message: "user not found or incorrect password" })
        }

        //check password
        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(411).json({ message: "user not found or incorrect password" })
        }
        const userId = user._id

        req.session.username = username
        req.session.userId = userId

        // if is admin
        if(user.admin){
            req.session.admin = true
        }

        return res.status(201).json({ message: 'success' })
    } catch (err) {
        console.error("Error logging in user", err)
        return res.status(500).json({ message: "server error" })
    }
})

app.post('/api/user/logout', (req, res) => {
    if(req.session){
        req.session.destroy(() => {
            res.json({ status: "success" })
        })
    }
})

app.get("/api/user/status", (req, res) => {
    if (req.session.username){
        res.json({ status: 'success' });
    }
    else {
        res.json({ status: 'error' });
    }
})

app.get('/webhook', (req, res) => {
    // Facebook sends a GET request
    // To verify that the webhook is set up
    // properly, by sending a special challenge that
    // we need to echo back if the "verify_token" is as specified
    if (req.query['hub.verify_token'] === 'sadasoijmd091j0ipoasdm901kldmasd') {
        res.send(req.query['hub.challenge'])
        return
    }
})

// POST /webhook
app.post('/webhook', async (req, res) => {
    // Facebook will be sending an object called "entry" for "leadgen" webhook event
    if (!req.body.entry) {
        return res.status(500).send({ error: 'Invalid POST data received' })
    }

    // Travere entries & changes and process lead IDs
    for (const entry of req.body.entry) {
        for (const change of entry.changes) {
            // Process new lead (leadgen_id)
            await processNewLead(change.value.leadgen_id)
        }
    }

    // Success
    res.send({ success: true })
})

app.get('/', (req, res) => {
    res.json('Hi')
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

// Process incoming leads
async function processNewLead(leadId) {
    let response

    try {
        // Get lead details by lead ID from Facebook API
        response = await axios.get(`https://graph.facebook.com/v9.0/${leadId}/?access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`)
    }
    catch (err) {
        // Log errors
        return console.warn(`An invalid response was received from the Facebook API:`, err.response.data ? JSON.stringify(err.response.data) : err.response)
    }

    // Ensure valid API response returned
    if (!response.data || (response.data && (response.data.error || !response.data.field_data))) {
        return console.warn(`An invalid response was received from the Facebook API: ${response}`)
    }

    // Lead fields
    const leadForm = []

    // Extract fields
    for (const field of response.data.field_data) {
        // Get field name & value
        const fieldName = field.name
        const fieldValue = field.values[0]

        // Store in lead array
        leadForm.push(`${fieldName}: ${fieldValue}`)
    }

    // Implode into string with newlines in between fields
    const leadInfo = leadForm.join('\n')

    // Log to console
    console.log('A new lead was received!\n', leadInfo)

    // Use a library like "nodemailer" to notify you about the new lead
    // 
    // Send plaintext e-mail with nodemailer
    // transporter.sendMail({
    //     from: `Admin <admin@example.com>`,
    //     to: `You <you@example.com>`,
    //     subject: 'New Lead: ' + name,
    //     text: new Buffer(leadInfo),
    //     headers: { 'X-Entity-Ref-ID': 1 }
    // }, function (err) {
    //     if (err) return console.log(err);
    //     console.log('Message sent successfully.');
    // })
}