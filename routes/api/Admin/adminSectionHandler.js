const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Section = require("../../../models/Section/Section");

// ===============================
//          Section
// ===============================

// @route   POST api/admin/createSection
// @desc    Creates a section with express-validator implementation
// @access  Public
router.post(
  "/createSection",
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
    //Check if teachers exist
    const { name, academicYear, nameInWords,teachersTeachingInThisSection, totalStudents } = req.body;

    try {
      // See if Section Exists
      let oldSection = await Section.findOne({ name });
      if (oldSection) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Section already exists" }] });
      }
      newSection = new Section({
        name,
        academicYear,
        nameInWords,
        teachersTeachingInThisSection,
        totalStudents,
      });

      await newSection.save();

      return res.json({ msg: "Section created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);



// @route   PUT api/admin/updateSection
// @desc    Creates a section with express-validator implementation
// @access  Public
router.put(
  "/updateSection/:id",
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
    // Remove the number of fields required as params, id should be enough in updates
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, academicYear, nameInWords, totalStudents } = req.body;
    const { id } = req.params;

    try {
      // See if Section Exists
      let oldSection = await Section.findById(id);
      if (!oldSection) {
        return res.status(400).json({ errors: [{ msg: "No section exists" }] });
      }

      const updatedSection = await oldSection.set({
        name,
        academicYear,
        nameInWords,
        totalStudents
      });
      await updatedSection.save();

      return res.json({ updatedSection });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/admin/deleteSection/:id
// @desc    Creates a section with express-validator implementation
// @access  Public
router.delete(
  "/deleteSection/:id",

  async (req, res) => {
    try {
      const { id } = req.params;
      // See if Section Exists
      let deleteSection = await Section.findById(id);
      if (!deleteSection) {
        return res.status(400).json({ errors: [{ msg: "No section exists" }] });
      }

      await deleteSection.deleteOne();
      res.json({ msg: "Section deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


// @route   GET api/admin/viewSection
// @desc    Creates a section with express-validator implementation
// @access  Public
router.get(
  "/viewSection",
  async (req, res) => {
    try {
      // Query params should assume different names than actual mongoose model fields
      const queryObject = req.query;

      // See if Section Exists
      let foundSectiones = await Section.find(queryObject).populate('teachersTeachingInThisSection.teacherId')
                                                            .populate('teachersTeachingInThisSection.subject');
      if (!foundSectiones.length) {
        return res.status(400).json({ errors: [{ msg: "No section exists" }] });
      }

      return res.json({ sections: foundSectiones });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/viewSection/:id
// @desc    Creates a section with express-validator implementation
// @access  Public
router.get(
  "/viewSection/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      // See if Section Exists
      let foundSection = await Section.findById(id).populate('teachersTeachingInThisSection.teacherId');
      if (!foundSection.length) {
        return res.status(400).json({ errors: [{ msg: "No section exists" }] });
      }

      return res.json({ section: foundSection });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;