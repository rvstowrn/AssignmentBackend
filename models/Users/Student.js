var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sectionName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    address: String,
    dob: {
        type: Date,
        required: true
    },
    aadharNumber: {
        type: String
    },
    accountNumber: String,
    SSSMID: String,
    photo: String,
    enrollmentNumber: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: false
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model("student", studentSchema);
