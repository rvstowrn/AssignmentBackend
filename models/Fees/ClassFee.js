var mongoose = require("mongoose");

var classFeeSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    allFee: [
        {
            fee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Fee",
                requitred: true
            },
            amount: Number
        }
    ]
},
{
  timestamps: true
});

module.exports = mongoose.model("ClassFee", classFeeSchema);
