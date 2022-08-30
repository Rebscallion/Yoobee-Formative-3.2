console.log("hello");
console.log('connected');


// -----Inputs-----
const projectInput = document.getElementById("project-input");
const nameInput = document.getElementById("name-input");
const imageURLInput = document.getElementById("image-url-input");

//-----buttons-----
const add = document.getElementById("project-button");
const submit = document.getElementById("submit-button");
const addForm = document.getElementById("tools");

// ==================
//show all projects
// ==================

let showAllProjects = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/allProjects",
    success: (projects) => {
      console.log(projects);
      renderProjects(projects);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

// ==================
// dropdown
// ==================
//dropdown menu variables
const dropDownBtn = document.getElementById("drop-down-button");
const dropDownMenu = document.getElementById("drop-down-menu");
const dropDownMenuAbout = document.getElementById("about");


dropDownBtn.onclick = () => {
  dropDownMenu.classList.toggle('active');
}

// ==================
// add item function
// ==================
add.onclick = () => {
  addForm.classList.toggle('active');
  console.log('clicked add fiunction')

  addForm.classList.toggle("active");
  console.log("clicked");

};

// this will submit the add data to mongoDB and add it to its arraay and then it will be added to the page
submit.onclick = () => {
  console.log("clicked submit");
  $.ajax({
    url: `http://localhost:3000/addProject`,
    type: "POST",
    data: {
      image_url: imageURLInput.value,
      name: nameInput.value,
      project: projectInput.value,
    },
    success: () => {
      console.log("A new project was added.");
      showAllProjects();
    },
    error: () => {
      console.log("Error: cannot reach the backend");
    },
  });
};

console.log("connected");
// ==================
// dropdown
// ==================
//dropdown menu variables
const dropDownBtn = document.getElementById("drop-down-button");
const dropDownMenu = document.getElementById("drop-down-menu");

console.log(dropDownBtn);

dropDownBtn.onclick = () => {
  dropDownMenu.classList.toggle("active");
};


// ==================
// delete projects
// ==================

let deleteProject = (projectId) => {
  console.log(projectId);
  $.ajax({
    url: `http://localhost:3000/deleteProject/${projectId}`,
    type: "DELETE",
    success: () => {
      showAllProjects();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

// ==================
// add delete buttons to items via id
// ==================

let collectDeleteButtons = () => {
  let deleteButtonsArray = document.getElementsByClassName("delete-button");
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let currentId = deleteButtonsArray[i].parentNode.parentNode.parentNode.id;
      console.log(currentId);
      deleteProject(currentId);
    };
  }
};

// ==================
//render all projects in #result
// ==================

let renderProjects = (projects) => {
  console.log("The render project function is running");
  result.innerHTML = "";
  projects.forEach((item, index) => {
    result.innerHTML += `
        <div class="result-container" id="${item._id}" data-index="${index}">
        <img src="${item.image_url}" alt="${item.name}">
          <div class="modal-container">
            <div class="modal-content">
              <i class="bi bi-x" data-index="${index}"></i>
              <h3>${item.name}</h3>
              <p>${item.project}</p>
              <i class="bi bi-trash delete-button"></i>
              <i class="bi bi-pencil-square edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
            </div>
          </div>
        </div>
        `;
  });
  collectDeleteButtons();
  let container = document.getElementsByClassName("result-container");
  let exit = document.getElementsByClassName("bi-x");
  // open delete modal
  for (let i = 0; i < container.length; i++) {
    container[i].onclick = () => {
      let modal = document.getElementsByClassName("modal-container");
      let projectId = container[i].dataset.index;
      modal[projectId].classList.toggle("open");
    };
  }
  //close delete modal
  for (let i = 0; i < exit.length; i++) {
    exit[i].onclick = () => {
      let modal = document.getElementsByClassName("modal-container");
      let projectId = exit[i].dataset.index;
      modal[projectId].classList.toggle("open");
    };
  }
  collectEditButtons();
};

// =========================================
//             EDIT FUNCTIONLITY
// =========================================

let handleEditFunctionality = (project, id) => {
  let projectName = document.getElementById("projectName");
  let projectAuthorName = document.getElementById("projectAuthorName");
  let imageurl = document.getElementById("imageUrl");
  let imagePreview = document.getElementById("image-preview");

  projectName.value = project.project;
  projectAuthorName.value = project.name;
  imageurl.value = project.image_url;
  imagePreview.innerHTML = `
  <img src="${project.image_url}" alt="${projectName}">
  `;
  //console.log(`The ID was passed in ${id}`)
  // ===============================
  //        EDIT CLICK LISTENER
  // ===============================

  $("#updateProject").click(function () {
    event.preventDefault();
    let projectId = id;
    let projectAuthorName = document.getElementById("projectAuthorName").value;
    let projectName = document.getElementById("projectName").value;
    let imageurl = document.getElementById("imageUrl").value;
    console.log(projectId, projectAuthorName, projectName, imageurl);

    $.ajax({
      url: `http://localhost:3000/updateProject/${projectId}`,
      type: "PATCH",
      data: {
        image_url: imageurl,
        name: projectAuthorName,
        project: projectName,
      },
      success: function (data) {
        console.log(data);
        showAllProjects();
        $("#editModal").modal("hide");
        $("#updateProject").off("click");
      },
      error: function () {
        console.log("error: cannot update");
      },
    });
  });
};

//this function will ask the backend for data relating to the coffee we clicked on to edit
populateEditModal = (projectId) => {
  console.log(projectId);
  $.ajax({
    url: `http://localhost:3000/project/${projectId}`,
    type: "GET",
    success: (projectData) => {
      console.log("project was found");
      console.log(projectData);
      handleEditFunctionality(projectData, projectId);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

let collectEditButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let editButtonsArray = document.getElementsByClassName("edit-button");
  // this will loop over every edit button
  for (let i = 0; i < editButtonsArray.length; i++) {
    editButtonsArray[i].onclick = () => {
      let currentId = editButtonsArray[i].parentNode.parentNode.parentNode.id;
      console.log(currentId);
      // edit project based on the id
      populateEditModal(currentId);
    };
  }
};

//-----start app-----
showAllProjects();

// ==================
//       swiper
// ==================

const swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
=======

