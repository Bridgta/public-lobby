const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        amountNeeded: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: "Category",
            required: true
        },
        goalReached: {
            type: Number
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        tax: {
            required: false,
            type: Boolean
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
