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
    timeTable: {
      [
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
                required: true 
              },
              teacherTeaching: {
                type: Schema.Types.ObjectId,
                ref: "Teacher",
                required: true
              },
              startTime : {type:Date.getTime(), required: true}
              endTime : {type:Date.getTime(), required: true}              
            }  
          ],
        }
      ]
    } 
  },
  { strict: true }
);

const Timetable = mongoose.model("timetable", timetableSchema);
module.exports = Timetable;
