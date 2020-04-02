const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const Subject = require("../../../models/Subject/Subject");

// @route   POST api/admin/createSubject
// @desc    Creates Subject with express-validator 
// @access  Public
router.post("/createSubject",
  [
    check("name", "Include subject name")
      .not()
      .isEmpty(),
    check("subCode", "Include subject code")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name,subCode,sections }=req.body;
    try {
    // See if Subject already exist
    let subject = await Subject.find({ name });
    if (subject.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "subject for given constraints already exists" }] });
    }
    subject = new Subject({ name,subCode,sections });
    await subject.save();
    return res.send("subject added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateSubject
// @desc    Updates a Subject for a given day and subject
// @access  Public
router.post("/updateSubject",
  [
    check("_id", "Include Subject Id")
      .not()
      .isEmpty(),  
    check("name", "Include Subject Name")
      .not()
      .isEmpty(),
    check("subCode", "Include Subject Code")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { 
    _id,
    name,
    subCode,
    sections,
  } = req.body;
  try {
    let subject = await Subject.findByIdAndUpdate({ _id }, { name,subCode,sections});
    if (subject) {
      return res.send("subject updated successfully");
    } else {
      return res.send("No subject to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteSubject
// @desc    Deletes Subject for given id
// @access  Public
router.delete("/deleteSubject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Attendance Exists
    let subject = await Subject.findById(id);
    if (subject) {
      subject.deleteOne();
      return res.send("subject deleted successfully");
    } else {
      return res.send("No subject to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readSubject
// @desc    Read Subject with or without filter(s)
// @access  Public

router.get("/readSubject", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Attendance Exist
    let subject = await Subject.find(qdata);
    if (subject.length) {
      res.send(subject);
    } else {
      return res.send("No subject found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
