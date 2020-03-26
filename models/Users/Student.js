var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
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
    aadharNumber: String,
    accountNumber: String,
    SSSMID: String,
    photo: String,
    enrollmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    }
});

module.exports = mongoose.model("student", studentSchema);
