var mongoose = require("mongoose");
var Student = require('../Users/Student');

var studentFeeSchema = new mongoose.Schema({
    studentName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Student,
        required: true
    },
    monthYear: {
        type: Date,
        required: true
    },
    admissionNumber: {
        type: Number,
        required: true,
        unique: true
    },
    allFee: [
        {
            fee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Fee",
                required: true
            },
            amount: Number
        }
    ],
    feeListings: [
        {
            fee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Fee",
                required: true
            },
            amount: Number,
            amountToPay: Number,
            balance: Number,
            monthYear: Date,
            due: String,
            paid: Number,
        }
    ]
},
{
  timestamps: true
});

module.exports = mongoose.model("StudentFee", studentFeeSchema);
