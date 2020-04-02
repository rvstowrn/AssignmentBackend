const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    subCode: { type: String, required: true },
    sections:{
        type:[
          {  
            sectionName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            }
          }   
        ],
        default: []
    }
  },   
  { strict: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;