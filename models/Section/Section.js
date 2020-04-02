var mongoose = require("mongoose");

var sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  nameInWords: {
    type: String,
    required: true
  },
  timeTable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeTable"
  },
  teachersTeachingInThisSection: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
      },
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
      }
    }
  ],
  totalStudents: {
    type: Number,
    required: true
  }
});

module.exports = Section = mongoose.model("Section", sectionSchema);
