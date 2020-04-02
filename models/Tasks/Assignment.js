const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    subName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    assignmentGivenByTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    sectionName: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    assignmentDetails: { type: String, required: true },
    assignedOn: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    assignedToStudents: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },
        status: {
          type: String,
          enum: ["incomplete", "complete"],
          default: "incomplete"
        },
        marks: { type: Number, required: true },
        totalMarks: { type: Number, required: true }
      }
    ]
  },
  { strict: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
