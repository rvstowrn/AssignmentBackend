var mongoose = require("mongoose");

var teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fatherOrSpouseName: String,
    address: String,
    dob: {
        type: Date,
        required: true
    },
    aadharNumber: String,
    accountNumber: String,
    photo: String,
    email: {
        type: String,
        required: true
    },
    sectionAccess:{
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
    },
    dateOfJoining: Date,
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    positionOfResponsibility: String,
    education: String,
    salary: String,
    SSSMID: String
});

module.exports = mongoose.model("Teacher", teacherSchema);
