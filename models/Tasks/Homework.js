const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeworkSchema = new Schema(
  {
    subName: { type: String, required: true },
    homeworkGivenByTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    sectionName: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    homeworkDetails: { type: String, required: true },
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
        }
      }
    ]
  },
  { strict: true }
);

module.exports = Homework = mongoose.model("Homework", homeworkSchema);
