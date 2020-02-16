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
        let project = new Project(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            Project.photo.data = fs.readFileSync(files.photo.path);
            project.photo.contentType = files.photo.type;
        }
        project.save((err, result) => {
            if (err) {
                console.log("P CREATE ERROR ", err);
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
    let donate = req.query.donate ? req.query.donate : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Project.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, donate]])
        .limit(limit)
        .exec((err, project) => {
            if (err) {
                return res.status(400).json({
                    error: "Project not found"
                });
            }
            res.json(projects);
        });
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Project.find({ _id: { $ne: req.project }, category: req.project.category })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, project) => {
            if (err) {
                return res.status(400).json({
                    error: "Projects not found"
                });
            }
            res.json(projects);
        });
};

exports.listCategories = (req, res) => {
    Project.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "ot found"
            });
        }
        res.json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let donate = req.body.donate ? req.body.donate : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "amountNeeded") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Project.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, donate]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Project not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.project.photo.data) {
        res.set("Content-Type", req.project.photo.contentType);
        return res.send(req.project.photo.data);
    }
    next();
};
