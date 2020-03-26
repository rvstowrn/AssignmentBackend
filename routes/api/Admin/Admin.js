const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Teacher = require("../../../models/Users/Teacher");
const Student = require("../../../models/Users/Student");
const Class = require("../../../models/Class/Class");
const Assignment = require("../../../models/Tasks/Assignment");
const Homework = require("../../../models/Tasks/Homework");

// @route		GET api/admin
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Admin");
});

// ===============================
//          Teacher
// ===============================

// @route   POST api/admin/createTeacher
// @desc    Creates a teacher with express-validator implementation
// @access  Public
router.post(
  "/createTeacher",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("dob", "Include DOB")
      .not()
      .isEmpty(),
    check("email", "Email is required")
      .not()
      .isEmpty(),
    check("password", "Min Password length is 6").isLength({ min: 6 })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      fatherOrSpouseName,
      address,
      dob,
      aadharNumber,
      accountNumber,
      photo,
      email,
      dateOfJoining,
      password,
      positionOfResponsibility,
      education,
      salary,
      SSSMID
    } = req.body;

    try {
      // See if Teacher Exists
      let oldTeacher = await Teacher.findOne({ email });
      if (oldTeacher) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      newTeacher = new Teacher({
        name,
        fatherOrSpouseName,
        address,
        dob,
        aadharNumber,
        accountNumber,
        photo,
        email,
        dateOfJoining,
        positionOfResponsibility,
        education,
        salary,
        SSSMID
      });

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      newTeacher.password = await bcrypt.hash(password, salt);
      await newTeacher.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          type: "teacher",
          id: newTeacher.id
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

// @route   GET api/admin/viewTeacher
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get("/viewTeacher", async (req, res) => {
  try {
    const queryObject = req.query;

    // See if Class Exists
    let foundTeachers = await Teacher.find(queryObject);
    if (!foundTeachers) {
      return res.status(400).json({ errors: [{ msg: "No teacher exists" }] });
    }
    return res.json({ teachers: foundTeachers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/viewTeacher/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get("/viewTeacher/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // See if Class Exists
    let foundTeacher = await Teacher.findById(id);
    if (!foundTeacher) {
      return res.status(400).json({ errors: [{ msg: "No Teacher exists" }] });
    }
    return res.json({ teacher: foundTeacher });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/updateTeacher
// @desc    Creates a class with express-validator implementation
// @access  Public
router.put(
  "/updateTeacher/:id",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("dob", "Include DOB")
      .not()
      .isEmpty(),
    check("email", "Email is required")
      .not()
      .isEmpty(),
    check("password", "Min Password length is 6").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      fatherOrSpouseName,
      address,
      dob,
      aadharNumber,
      accountNumber,
      photo,
      email,
      dateOfJoining,
      positionOfResponsibility,
      education,
      password,
      salary,
      SSSMID
    } = req.body;
    const { id } = req.params;

    try {
      // See if Teacher Exists
      let oldTeacher = await Teacher.findById(id);
      if (!oldTeacher) {
        return res.status(400).json({ errors: [{ msg: "No teacher exists" }] });
      }

      const updatedTeacher = await oldTeacher.set({
        name,
        fatherOrSpouseName,
        address,
        dob,
        aadharNumber,
        accountNumber,
        photo,
        email,
        dateOfJoining,
        positionOfResponsibility,
        education,
        salary,
        SSSMID
      });

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      updatedTeacher.password = await bcrypt.hash(password, salt);
      await updatedTeacher.save();

      return res.json({ updatedTeacher });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/admin/deleteTeacher/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.delete(
  "/deleteTeacher/:id",

  async (req, res) => {
    try {
      const { id } = req.params;
      // See if Class Exists
      let deleteTeacher = await Teacher.findById(id);
      if (!deleteTeacher) {
        return res.status(400).json({ errors: [{ msg: "No teacher exists" }] });
      }

      await deleteTeacher.deleteOne();
      res.json({ msg: "Teacher deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// ===============================
//          Student
// ===============================

// @route   POST api/admin/createStudent
// @desc    Creates a student with express-validator implementation
// @access  Public
router.post(
  "/createStudent",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("className", "Include Class Name")
      .not()
      .isEmpty(),
    check("fatherName", "Father Name")
      .not()
      .isEmpty(),
    check("motherName", "Include Mother Name")
      .not()
      .isEmpty(),
    check("enrollmentNumber", "Include Enrollment Number")
      .not()
      .isEmpty(),
    check("rollNumber", "Include Roll Number")
      .not()
      .isEmpty(),
    check("dob", "Include DOB")
      .not()
      .isEmpty(),
    check("password", "Min Password length is 6").isLength({ min: 6 })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      className,
      fatherName,
      motherName,
      address,
      dob,
      aadharNumber,
      accountNumber,
      photo,
      enrollmentNumber,
      rollNumber,
      password,
      SSSMID
    } = req.body;

    try {
      // See if Student Exists
      let oldStudent = await Student.findOne({ enrollmentNumber });
      if (oldStudent) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      newStudent = new Student({
        name,
        fatherName,
        motherName,
        address,
        dob,
        aadharNumber,
        accountNumber,
        photo,
        enrollmentNumber,
        rollNumber,
        password,
        SSSMID
      });

      // See if class Exists
      let foundClass = await Class.findOne({ name: className });
      if (!foundClass) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      newStudent.class = foundClass.id;

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      newStudent.password = await bcrypt.hash(password, salt);
      await newStudent.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          type: "student",
          id: newStudent.id
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

// @route   GET api/admin/viewStudent
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get(
  "/viewStudent",

  async (req, res) => {
    try {
      const queryObject = req.query;

      // See if Student Exists
      let foundStudents = await Student.find(queryObject);
      if (!foundStudents) {
        return res.status(400).json({ errors: [{ msg: "No Student exists" }] });
      }

      return res.json({ students: foundStudents });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/viewStudent/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get(
  "/viewStudent/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      // See if Student Exists
      let foundStudent = await Student.findById(id);
      if (!foundStudent) {
        return res.status(400).json({ errors: [{ msg: "No Student exists" }] });
      }

      return res.json({ student: foundStudent });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/admin/updateStudent/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.put(
  "/updateStudent/:id",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("className", "Include Class Name")
      .not()
      .isEmpty(),
    check("fatherName", "Father Name")
      .not()
      .isEmpty(),
    check("motherName", "Include Mother Name")
      .not()
      .isEmpty(),
    check("enrollmentNumber", "Include Enrollment Number")
      .not()
      .isEmpty(),
    check("rollNumber", "Include Roll Number")
      .not()
      .isEmpty(),
    check("dob", "Include DOB")
      .not()
      .isEmpty(),
    check("password", "Min Password length is 6").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      className,
      fatherName,
      motherName,
      address,
      dob,
      aadharNumber,
      accountNumber,
      photo,
      enrollmentNumber,
      rollNumber,
      password,
      SSSMID
    } = req.body;
    const { id } = req.params;

    try {
      // See if Student Exists
      let oldStudent = await Student.findById(id);
      if (!oldStudent) {
        return res.status(400).json({ errors: [{ msg: "No student exists" }] });
      }

      const updatedStudent = await oldStudent.set({
        name,
        fatherName,
        motherName,
        address,
        dob,
        aadharNumber,
        accountNumber,
        photo,
        enrollmentNumber,
        rollNumber,
        SSSMID
      });

      // See if class Exists
      let foundClass = await Class.findOne({ name: className });
      if (!foundClass) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      updatedStudent.class = foundClass.id;

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      updatedStudent.password = await bcrypt.hash(password, salt);
      await updatedStudent.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          type: "student",
          id: updatedStudent.id
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

// @route   DELETE api/admin/deleteStudent/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.delete(
  "/deleteStudent/:id",

  async (req, res) => {
    try {
      const { id } = req.params;
      // See if Class Exists
      let deleteStudent = await Student.findById(id);
      if (!deleteStudent) {
        return res.status(400).json({ errors: [{ msg: "No Student exists" }] });
      }

      await deleteStudent.deleteOne();
      res.json({ msg: "Student deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// ===============================
//          Class
// ===============================

// @route   POST api/admin/createClass
// @desc    Creates a class with express-validator implementation
// @access  Public
router.post(
  "/createClass",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("academicYear", "Include Academic Year")
      .not()
      .isEmpty(),
    check("nameInWords", "Include Name In Words")
      .not()
      .isEmpty(),
    check("totalStudents", "Include Total Number Of Students")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, academicYear, nameInWords, totalStudents } = req.body;

    try {
      // See if Class Exists
      let oldClass = await Class.findOne({ name });
      if (oldClass) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Class already exists" }] });
      }
      newClass = new Class({
        name,
        academicYear,
        nameInWords,
        totalStudents
      });

      await newClass.save();

      return res.json({ msg: "Class created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/viewClass
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get(
  "/viewClass",

  async (req, res) => {
    try {
      const queryObject = req.query;

      // See if Class Exists
      let foundClasses = await Class.find(queryObject);
      if (!foundClasses) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      return res.json({ classes: foundClasses });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/viewClass/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.get(
  "/viewClass/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      // See if Class Exists
      let foundClass = await Class.findById(id);
      if (!foundClass) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      return res.json({ class: foundClass });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/admin/updateClass
// @desc    Creates a class with express-validator implementation
// @access  Public
router.put(
  "/updateClass/:id",
  [
    check("name", "Include Name")
      .not()
      .isEmpty(),
    check("academicYear", "Include Academic Year")
      .not()
      .isEmpty(),
    check("nameInWords", "Include Name In Words")
      .not()
      .isEmpty(),
    check("totalStudents", "Include Total Number Of Students")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, academicYear, nameInWords, totalStudents } = req.body;
    const { id } = req.params;

    try {
      // See if Class Exists
      let oldClass = await Class.findById(id);
      if (!oldClass) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      const updatedClass = await oldClass.set({
        name,
        academicYear,
        nameInWords,
        totalStudents
      });
      await updatedClass.save();

      return res.json({ updatedClass });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/admin/deleteClass/:id
// @desc    Creates a class with express-validator implementation
// @access  Public
router.delete(
  "/deleteClass/:id",

  async (req, res) => {
    try {
      const { id } = req.params;
      // See if Class Exists
      let deleteClass = await Class.findById(id);
      if (!deleteClass) {
        return res.status(400).json({ errors: [{ msg: "No class exists" }] });
      }

      await deleteClass.deleteOne();
      res.json({ msg: "Class deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// HOMEWORK & ASSIGNMENT /////////////////////////////////////////

// @route   POST api/admin/createAssignments
// @desc    Creates an Assignment
// @access  Public
router.post("/createAssignments", async (req, res) => {
  try {
    // See if Assignment Exists
    let assignment = await Assignment.find(req.body);
    if (assignment.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Assignment already exists" }] });
    }
    assignment = new Assignment(req.body);
    await assignment.save();
    return res.send("assignment added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateAssignments
// @desc    Updates an Assignment for a given day and subject
// @access  Public
router.post("/updateAssignments", async (req, res) => {
  const { _id } = req.body;
  try {
    let assignment = await Assignment.findByIdAndUpdate({ _id }, req.body);
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
// @desc    Updates an Assignment for a given day and subject
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
        "No assignment to be deleted for the given day and subject"
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
    let assignments = await Assignment.find(qdata);
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

// @route   POST api/admin/createHomeworks
// @desc    Creates a Homework
// @access  Public
router.post("/createHomeworks", async (req, res) => {
  try {
    // See if Homework Exists
    let homework = await Homework.find(req.body);
    if (homework.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Homework already exists" }] });
    }
    homework = new Homework(req.body);
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
router.post("/updateHomeworks", async (req, res) => {
  const { _id } = req.body;
  try {
    let homework = await Homework.findByIdAndUpdate({ _id }, req.body);
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
// @desc    Updates an Assignment for a given day and subject
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
// @desc    Read Assignments with or without filter(s)
// @access  Public

router.get("/readHomeworks", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Assignments Exist
    let homeworks = await Homework.find(qdata);
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

module.exports = router;
