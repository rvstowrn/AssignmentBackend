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
