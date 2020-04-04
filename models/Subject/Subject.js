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
            required: true
            }
          }   
        ],
        default: []
    }
  },   
  { strict: true }
);

module.exports = Subject = mongoose.model("Subject", subjectSchema);