const userRouter = require("express").Router();
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authentication");


userRouter.get("/", (req, res) => {
    res.send("hello world!");
}
)

userRouter.post("/sign-up", async (req, res) => {
    try {
        //SET UP VALUES FROM THE BODY TO NEW FIELDS
        const { email, password, passwordCheck, displayName } = req.body;

        //LETS GET VALIDATION (exception handling)
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }
        if (password.length < 5) {
            return res.status(400).json({ msg: "The password needs to be at least 5 characters long." });
        }
        if (password !== passwordCheck) {
            return res.status(400).json({ msg: "Make sure the Password and the Password verification match." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ msg: "An account with this email already exists." });
        }
        console.log("looks good");

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        })
        const savedUser = await newUser.save();
        res.json(savedUser);



        return res.send("made it to the end");

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }

});


userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        ///LETS CHECK FOR VALIDATION    
        if (!email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "No account with this email has been registered." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        //NEXT IT WILL SIGN AN OBJECT A PAYLOAD
        //FROM THE USER ID
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
            },
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
});


//router to delete an account
userRouter.delete("/deleteAccount", auth, async (req, res) => {
    // console.log(req.user);
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        //this incase we want to add a message using the deleted user.
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
});

//AND ENDPOINT THAT GIVES ME TRUE OR FALSE IF WE HAVE 
// A TOKEN AND IS VALID
userRouter.post("/isTokenValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}
)




module.exports = userRouter;