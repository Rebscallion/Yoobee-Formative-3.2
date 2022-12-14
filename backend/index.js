// -----Dependencies-----
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("./config.json");

// -----Schema-----
const Project = require("./models/project.js");

// -----Start Dependencies-----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// -----Start Server-----
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// -----Connect to MongoDB-----
mongoose
  .connect(
    `mongodb+srv://${config.username}:${config.password}@mycluster.mc6676s.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`You've connected to MongoDB!`);
  })
  .catch((err) => {
    console.log(`DB connection error ${err.message}`);
  });

// ====================
//       ADD Method
// ====================

app.post(`/addProject`, (req, res) => {
  const newProject = new Project({
    _id: new mongoose.Types.ObjectId(),
    image_url: req.body.image_url,
    name: req.body.name,
    project: req.body.project,
  });
  newProject
    .save()
    .then((result) => {
      console.log(`Added a new project successfully!`);
      res.send(result);
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
});

// ===================
//      GET Method
// ===================

app.get("/allProjects", (req, res) => {
  Project.find().then((result) => {
    res.send(result);
  });
});

// =====================
//     DELETE Method
// ====================

app.delete("/deleteProject/:id", (req, res) => {
  const projectId = req.params.id;
  console.log("The following project was deleted:");
  console.log(projectId);
  Project.findById(projectId, (err, project) => {
    if (err) {
      console.log(err);
    } else {
      console.log(project);
      Project.deleteOne({ _id: projectId })
        .then(() => {
          console.log("Success! Actually deleted from mongoDB");
          res.send(project);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

// =====================
//     EDIT Method
// ====================

app.patch("/updateProject/:id", (req, res) => {
  const idParam = req.params.id;
  Project.findById(idParam, (err, project) => {
    const updatedProject = {
      image_url: req.body.image_url,
      name: req.body.name,
      project: req.body.project,
    };
    Project.updateOne(
      {
        _id: idParam,
      },
      updatedProject
    )
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
});

app.get("/project/:id", (req, res) => {
  const projectId = req.params.id;
  Project.findById(projectId, (err, project) => {
    if (err) {
      console.log(err);
    } else {
      res.send(project);
    }
  });
});
