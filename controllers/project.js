const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Project = require("../models/project");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.projectById = (req, res, next, id) => {
    Project.findById(id)
        .populate("category")
        .exec((err, project) => {
            if (err || !project) {
                return res.status(400).json({
                    error: "Project not found"
                });
            }
            req.project = project;
            next();
        });
};

exports.view = (req, res) => {
    req.project.photo = undefined;
    return res.json(req.project);
};

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

exports.remove = (req, res) => {
    let project = req.project;
    project.remove((err, deletedProject) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Project deleted successfully"
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let project = req.project;
        project = _.extend(project, fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            project.photo.data = fs.readFileSync(files.photo.path);
            project.photo.contentType = files.photo.type;
        }

        project.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    let donate = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Project.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, donate]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Project not found"
                });
            }
            res.json(projects);
        });
};
