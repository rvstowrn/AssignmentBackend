const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Teacher = require("../../models/Users/Teacher");
const Student = require("../../models/Users/Student");
const bcrypt = require("bcryptjs");

// @route		GET api/auth
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Auth");
});

// @route   POST api/auth/login
// @desc    Login users according to their role
// @access  Public
router.post(
  "/login",
  [
    check("email", "Email is required")
      .not()
      .isEmpty(),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("type", "Type is required")
      .not()
      .isEmpty(),     
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      type
    } = req.body;

    try {
      // See if User Exists
      var user;
      const salt = await bcrypt.genSalt(10);
      if(type=="student"){
      	user = await Student.findOne({ email });
      }
      else if(type=="teacher"){
	    user = await Teacher.findOne({ email });
      }

      if(!user){
      	 return res
          .status(400)
          .json({ errors: [{ msg: "User doesn't exist" }] });
      }

      pass = await bcrypt.compare(password,user.password);
      if(!pass){
      	 return res
          .status(400)
          .json({ errors: [{ msg: "Wrong Password" }] });
      }


      // Return jsonwebtoken
      const payload = {
        user: {
          id:user._id,	
          type: type
        }
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);  


  

module.exports = router;