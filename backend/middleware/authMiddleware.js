// use jwt token to verify the token 
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // optional chaining , [1] chooses the 1st indexed element 
    if(!token) return res.status(401).json({message: "Token not found"});

    // if token found try to verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // assign to user
        next(); // move to next route or middleware
    }
    catch(err) { // else catch the error 
        res.status(403).json({message: "Token invalid"});
    }
}

module.exports = verifyToken;