const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Timetable = require("../../../models/Timetables/Timetables");
const Section = require("../../../models/Section/Section");
const Student = require("../../../models/Users/Student");
const Teacher = require("../../../models/Users/Teacher");


// @route   POST api/admin/createTimetable
// @desc    Creates Timetable with express-validator 
// @access  Public
router.post("/createTimetable",
  [
    check("sectionName", "Include Section Id")
      .not()
      .isEmpty(),
    check("releaseDate", "Include Release Date")
      .not()
      .isEmpty(),
    check("timetableDetails", "Include Timetable Details")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // See if section is valid
    const { sectionName,releaseDate,timetableDetails }=req.body;
    try {
    // See if TimeTable already exist
    let timetable = await Timetable.find({ sectionName });
    if (timetable.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "timetable for given section already exists" }] });
    }
    timetable = new Timetable({ sectionName,releaseDate,timetableDetails });
    await timetable.save();
    let sec = await Section.findByIdAndUpdate(sectionName,{timetable:timetable._id});

    return res.send("timetable added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateTimetable
// @desc    Updates a Timetable for a given section
// @access  Public
router.post("/updateTimetable",
  [
    check("_id", "Include Timetable Id")
      .not()
      .isEmpty(),  
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("releaseDate", "Include Release Date")
      .not()
      .isEmpty(),
    check("timetableDetails", "Include Timetable Details")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //for update all attributes shouldn't be required except id
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { 
    _id,
    sectionName,
    releaseDate,
    timetableDetails,
  } = req.body;
  try {
    let timetable = await Timetable.findByIdAndUpdate({ _id }, { sectionName,releaseDate,timetableDetails});
    if (timetable) {
      return res.send("timetable updated successfully");
    } else {
      return res.send("No timetable to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteTimetable
// @desc    Deletes Timetable for given id
// @access  Public
router.delete("/deleteTimetable/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Attendance Exists
    let timetable = await Timetable.findById(id);
    if (timetable) {
      timetable.deleteOne();
      return res.send("timetable deleted successfully");
    } else {
      return res.send("No timetable to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readTimetable
// @desc    Read Timetable with or without filter(s)
// @access  Public

router.get("/readTimetable", async (req, res) => {
  try {
    // qurey params != mongoose fields , selected fields , id casting error
    let qdata = req.query;

    // See if Attendance Exist
    let timetable = await Timetable.find(qdata).populate('timetableDetails.slots.teacherTeaching');
    if (timetable.length) {
      res.send(timetable);
    } else {
      return res.send("No timetable found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/readTimetable", async (req, res) => {
  try {
    // qurey params != mongoose fields , selected fields , id casting error
    let qdata = req.query;

    // See if Attendance Exist
    let timetable = await Timetable.find(qdata).populate('timetableDetails.slots.teacherTeaching');
    if (timetable.length) {
      res.send(timetable);
    } else {
      return res.send("No timetable found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




router.get("/timetableForStudents/:studentId", async (req, res) => {
  try {
    // check if student exists
    let { studentId } = req.params;
    var student = await Student.findById(studentId);
    let timetable = await Timetable.findOne({sectionName:student.sectionName}).populate('subName');
    if (timetable) {
      var arr=[];
      timetable.timetableDetails.forEach(detail=>{
        var obj={};
        obj['dayName']=detail.dayName;
        obj['slots']=[];
        detail.slots.forEach(slot=>{
          obj['sectionName']=timetable.sectionName;
          obj['subName']=slot.subName.name;
          obj['startTime']=slot.startTime;
          obj['endTime']=slot.endTime;
        });
        arr.push(obj);
      });
      return res.send(arr);
    } else {
      return res.send("Timetable not set");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




router.get("/timetableForTeachers/:teacherId", async (req, res) => {
  try {
    // check if teacher exists
    let { teacherId } = req.params;
    var teacher = await Teacher.findById(teacherId);
    let timetable = await Timetable.find({teacherTeaching:teacherId});
    if (timetable) {
      var arr=[];
      timetable.timetableDetails.forEach(detail=>{
        var obj={};
        obj['dayName']=detail.dayName;
        obj['slots']=[];
        detail.slots.forEach(slot=>{
          obj['sectionName']=timetable.sectionName;
          obj['subName']=slot.subName.name;
          obj['startTime']=slot.startTime;
          obj['endTime']=slot.endTime;
        });
        arr.push(obj);
      });
      return res.send(arr);
    } else {
      return res.send("Timetable not set");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




// viewTimetable
//    [
// { 
// dayName: 'monday', 
// slots: [
// { 
//   subName: 'Math',
//   sectionName: 'XI A', 
//   startTime: '2012-12-04T8:00:00.000Z', 
//   endTime: '2012-12-04T9:00:00.000Z' 
// } 
// ] 
// }
//    ]





// router.get("/timetableForTeachers/:teacherId", async (req, res) => {
//   const { teacherId } = req.params;
//   try {
//     // See if teacher exist
//     let timetable = await Timetable.find({teacherTeaching:teacherId});
//     if (timetable.length) {
//       let days = ["monday", "tuesday","wednesday","thursday","friday","saturday","sunday"];
//       var arr=[];
//       days.forEach(day=>{
//         let t = timetable.find(el=>{})



//       });


//       // var arr=[];
//       // timetable.forEach(table=>{
//       //   var obj={};
//       //   table.timetableDetails.forEach(details=>{
//       //     obj['dayName']=details.dayName;
//       //     obj['slo']
      
//       //     details.slots.forEach(slot=>{
            
//       //       let t = slot.find(el => { return el.teacherTeaching == teacherId});



//       //     });
//       //   });
//       // });
//     } else {
//       return res.send("No timetable found for given teacher");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }

// });


module.exports = router;