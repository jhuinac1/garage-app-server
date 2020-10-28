const jwt = require("jsonwebtoken");


const auth = async (req, res, next) => {

    try {
        const token = req.header("x-auth-token");
        if (!token) {
            //401 means un-authorize
            return res.status(401).json({ msg: "No Authentication token, Authorization denied" });
        }

        // The token is being decoded with the password to match the 
        //jwt_secret, if not verified then someone tried to hack the jwt Secret comes back as null
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            //401 means un-authorize
            return res.status(401).json({ msg: "Token verification failed, Authorization denied" });
        }

        //now we can accesss the id that matches the user id
        //and then this res.user will get passed to function that is
        //using this entire function as middleware
        req.user = verified.id;
        // console.log(req.user);
        //will execute whatever comes after
        next();

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }



}


module.exports = auth;