const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        image_url: String,
        name: String,
        project: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Project', projectSchema);