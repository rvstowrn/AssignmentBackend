const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Subject = require("../../../models/Subject/Subject");
const Assignment = require("../../../models/Tasks/Assignment");
const Homework = require("../../../models/Tasks/Homework");



// HOMEWORK & ASSIGNMENT /////////////////////////////////////////

// @route   POST api/admin/createAssignments
// @desc    Creates an Assignment with express-validator implementation 
// @access  Public
router.post("/createAssignments",
  [
    check("subName", "Include Subject Name")
      .not()
      .isEmpty(),
    check("assignmentGivenByTeacher", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("assignmentDetails", "Include Assignment Details")
      .not()
      .isEmpty(),
    check("assignedOn", "Include assigned on date")
      .not()
      .isEmpty(),
    check("dueDate", "Include due date")
      .not()
      .isEmpty(),
    check("assignmentDetails", "Include Assignment Details")
      .not()
      .isEmpty(),
    check("assignedToStudents", "Include Assigned to Student")
      .not()
      .isEmpty()   
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents }=req.body;
    try {
    // See if Assignment Exists
    let assignment = await Assignment.find({subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate});
    if (assignment.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Assignment already exists" }] });
    }
    assignment = new Assignment({subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents});
    await assignment.save();
    return res.send("assignment added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateAssignments
// @desc    Updates an Assignment with express-validator implementation
// @access  Public
router.post("/updateAssignments",
  [
    check("_id", "Include Assignment Id")
      .not()
      .isEmpty(),  
    check("subName", "Include Subject Name")
      .not()
      .isEmpty(),
    check("assignmentGivenByTeacher", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("assignmentDetails", "Include Assignment Details")
      .not()
      .isEmpty(),
    check("assignedOn", "Include assigned on date")
      .not()
      .isEmpty(),
    check("dueDate", "Include due date")
      .not()
      .isEmpty(),
    check("assignedToStudents", "Include Assigned to Student")
      .not()
      .isEmpty()   
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { 
    _id,
    subName,
    assignmentGivenByTeacher,
    sectionName,
    assignmentDetails,
    assignedOn,
    dueDate,
    assignedToStudents 
  } = req.body;
  try {
    let assignment = await Assignment.findByIdAndUpdate({ _id }, {subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents});
    if (assignment) {
      return res.send("assignment updated successfully");
    } else {
      console.log(assignment);
      return res.send("No assignment to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteAssignments
// @desc    Deletes an Assignment based on id
// @access  Public
router.delete("/deleteAssignments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Assignment Exists
    let assignment = await Assignment.findById(id);
    if (assignment) {
      assignment.deleteOne();
      return res.send("assignment deleted successfully");
    } else {
      return res.send(
        "No assignment to be deleted for given id"
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readAssignments
// @desc    Read Assignments with or without filter(s)
// @access  Public

router.get("/readAssignments", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Assignments Exist
    let assignments = await Assignment.find(qdata).populate('assignmentGivenByTeacher');
    if (assignments.length) {
      res.send(assignments);
    } else {
      return res.send("No assignments found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Make route /subjectsAssignmentForStudent/:studentId



// @route   POST api/admin/createHomeworks
// @desc    Creates a Homework
// @access  Public
router.post("/createHomeworks",
 [
    check("subName", "Include Subject Name")
      .not()
      .isEmpty(),
    check("homeworkGivenByTeacher", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("homeworkDetails", "Include Homework Details")
      .not()
      .isEmpty(),
    check("dueDate", "Include due date")
      .not()
      .isEmpty(),
    check("assignedToStudents", "Include Assigned to Student")
      .not()
      .isEmpty()   
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate,assignedToStudents }=req.body;
    try {
    // See if Homework Exists
    let homework = await Homework.find({ subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate });
    if (homework.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Homework already exists" }] });
    }
    homework = new Homework({ subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate,assignedToStudents });
    await homework.save();
    return res.send("homework added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateHomeworks
// @desc    Updates a Homework for a given day and subject
// @access  Public
router.post("/updateHomeworks",
  [
    check("_id", "Include Homework Id")
      .not()
      .isEmpty(),  
    check("subName", "Include Subject Name")
      .not()
      .isEmpty(),
    check("homeworkGivenByTeacher", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("homeworkDetails", "Include Homework Details")
      .not()
      .isEmpty(),
    check("dueDate", "Include due date")
      .not()
      .isEmpty(),
    check("assignedToStudents", "Include Assigned to Student")
      .not()
      .isEmpty()   
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { 
    _id,
    subName,
    homeworkGivenByTeacher,
    sectionName,
    homeworkDetails,
    assignedOn,
    dueDate,
    assignedToStudents 
  } = req.body;
  try {
    let homework = await Homework.findByIdAndUpdate({ _id }, { subName,homeworkGivenByTeacher,sectionName,homeworkDetails,assignedOn,dueDate,assignedToStudents });
    if (homework) {
      return res.send("homework updated successfully");
    } else {
      return res.send("No homework to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteAssignments
// @desc    Deletes a Homework for given id
// @access  Public
router.delete("/deleteHomeworks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Homework Exists
    let homework = await Homework.findById(id);
    if (homework) {
      homework.deleteOne();
      return res.send("homework deleted successfully");
    } else {
      return res.send("No homework to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readAssignments
// @desc    Read Homework with or without filter(s)
// @access  Public

router.get("/readHomeworks", async (req, res) => {
  try {
    // query params != mongoose fields , id casting handle, selected params
    let qdata = req.query;

    // See if Homework Exist
    let homeworks = await Homework.find(qdata).populate('homeworkGivenByTeacher');
    if (homeworks.length) {
      res.send(homeworks);
    } else {
      return res.send("No homework found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/subjectsHomeWorkForStudent/:studentId", async (req, res) => {
  try {
    // Check if the student exist
    const { studentId } = req.params;
    let homeworks = await Homework.find({student:studentId})
    .populate('homeworkGivenByTeacher')
    .populate('sectionName')
    .populate('subName');
    if (homeworks.length) {
      let arr = [];
      homeworks.forEach(homework => {
        let {subName,sectionName,homeworkGivenByTeacher,homeworkDetails,dueDate,assignedToStudents} = homework;
        let s = assignedToStudents.find(el => {return el.student == studentId});
        arr.push({subName: homework.subName.name,sectionName:sectionName.name,homeworkGivenByTeacher:homeworkGivenByTeacher.name,
          homeworkDetails:homeworkDetails,dueDate:dueDate,status:s.status});
      });
      return res.send(arr);
    } else {
      return res.send("No homework found for given student");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
