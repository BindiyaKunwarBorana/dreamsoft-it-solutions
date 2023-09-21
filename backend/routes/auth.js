const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = 'bindiya@borana'

//ROUTE 1: create a User using: POST "/api/auth/createuser". No login require
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 6 characters').isLength({ min: 5 }),

] , async (req, res)=> {
    let success = false;
    //if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array()});
      }

      ///check whether the user with this email exists already
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res
            .status(400)
            .json({ success, error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });

        const data = {
          user: {
            id: user.id
          }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // console.log(authtoken);


        // res.json(user);
        success = true;
        res.json({success, authtoken});

        //   .then(user => res.json(user))
        //   .catch(err => {console.log(err)
        // res.json({ error: "Please enter a unique value for email" })})

        // console.log(req.body);
        // const user = User(req.body);
        // user.save();
        // res.send(req.body);


      } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
      }
})


//ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login require
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists(),

] , async (req, res)=> {
  let success = false;

  //if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ errors: "Please try to login with correct Credentials" });
    } 
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, errors: "Please try to login with correct Credentials" }); 
    }
    
    const data = {
      user: {
        id: user.id
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success= true;
    res.json({ success, authtoken });

  } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
  }

});

//ROUTE 3: Get loggedin User details using: POST "/api/auth/getuser". login require
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;