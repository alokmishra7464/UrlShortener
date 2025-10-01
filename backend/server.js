// import env variables
require('dotenv').config();

// core imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/url', require('./routes/urlRoutes'));

const { redirectUrl } = require('./controllers/UrlController');
app.get('/:shortCode', redirectUrl);


// connect db
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser : true, 
    useUnifiedTopology : true
})
.then(() => {
    console.log('DB connected')
})
.catch((err) => {
    console.log(`Db failed ${err}`)
});

app.get('/', (req,res) => {
    res.send("Welcome to my server");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});