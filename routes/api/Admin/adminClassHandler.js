const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Class = require("../../../models/Class/Class");

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
