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



    // SEED BASE
    // name: rishabh,
    // fatherOrSpouseName: raman,
    // address: hig,
    // dob: 1999-02-09,
    // aadharNumber: awmypass,
    // accountNumber: ac11111,
    // photo: url404,
    // email: rv@gmail.com
    // dateOfJoining: 20118-02-01,
    // password: 666666
    // positionOfResponsibility: lead,
    // education: bed,
    // salary: 7lakhs,
    // SSSMID: ssmid11