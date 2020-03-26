const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeworkSchema = new Schema(
  {
    SubName: { type: String, required: true },
    HomeworkGivenByTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    SectionName: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    HomeworkDetails: { type: String, required: true },
    DueDate: { type: Date, required: true },
    AssignedToStudents: [
      {
        Student: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },
        Status: {
          type: String,
          enum: ["incomplete", "complete"],
          default: "incomplete"
        }
      }
    ]
  },
  { strict: true }
);

module.exports = Homework = mongoose.model("Homework", homeworkSchema);
