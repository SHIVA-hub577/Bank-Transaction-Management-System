const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "INACTIVE", 'FROZEN'],
            message: "status must be either ACTIVE, INACTIVE or FROZEN"
        },
        default: "ACTIVE"

    },
    currency: {
        type: String,
        required: [true, "Currency is Required"],
        default: "INR"
    }



}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });
const accountmodel = mongoose.model("account", accountSchema);
module.exports = accountmodel;