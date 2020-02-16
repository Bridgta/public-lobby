const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Project = require("../models/project");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {
            title,
            description,
            amountNeeded,
            category,
            goalReached
        } = fields;
        if (
            !title ||
            !description ||
            !amountNeeded ||
            !category ||
            !goalReached
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        let product = new Project(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                console.log("PRODUCT CREATE ERROR ", err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
