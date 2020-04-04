const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    sectionName: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    teacherName: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    date: { type: Date, required: true },
    attendanceDetails: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },
        status: {
          type: String,
          enum: ["absent", "present","leave"],
          required: true
        },
      }
    ],
    metaData:Object
  },
  { strict: true }
);

module.exports = Attendance = mongoose.model("Attendance", attendanceSchema);