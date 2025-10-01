const express = require('express');
const router = express.Router(); // use Router feature of express
const {register, login} = require('../controllers/AuthController'); // import controllers to guide the routing

// creating routes 
router.post('/register', register);
router.post('/login', login);

module.exports = router;