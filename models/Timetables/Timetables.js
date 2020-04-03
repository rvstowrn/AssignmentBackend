const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timetableSchema = new Schema(
  {
    sectionName: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },
    releaseDate: { type: Date, required: true },
    timetableDetails: [
      {
        dayName: {
          type: String,
          enum: ["monday", "tuesday","wednesday","thursday","friday","saturday","sunday"],
          required: true
        },
        slots: [
          {  
            subName: { 
              type: Schema.Types.ObjectId,
              ref: "Subject", 
              required: true 
              },
            teacherTeaching: {
              type: Schema.Types.ObjectId,
              ref: "Teacher",
              required: true
            },
            startTime : {type:Date, required: true},
            endTime : {type:Date, required: true}              
          }  
        ],
      }
    ]
  },   
  { strict: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);
module.exports = Timetable;