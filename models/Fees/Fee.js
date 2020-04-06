var mongoose = require("mongoose");

var feeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        requitred: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    }
},
{
  timestamps: true
});

module.exports = mongoose.model("Fee", feeSchema);
