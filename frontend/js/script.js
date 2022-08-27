console.log("hello");

// -----Inputs-----
const projectInput = document.getElementById("project-input");
const nameInput = document.getElementById("name-input");
const imageURLInput = document.getElementById("image-url-input");

//-----buttons-----
const add = document.getElementById("project-button");
const submit = document.getElementById("submit-button");

const addForm = document.getElementById("tools");

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

add.onclick = () => {
  addForm.style.display = "block";
};

submit.onclick = () => {
  console.log("clicked");
  $.ajax({
    url: `http://localhost:3000/addProject`,
    type: "POST",
    data: {
      image_url: imageURLInput.value,
      name: nameInput.value,
      project: projectInput.value
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

let collectDeleteButtons = () => {
  let deleteButtonsArray = document.getElementsByClassName("delete-button");
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let currentId = deleteButtonsArray[i].parentNode.parentNode.id;
      deleteProject(currentId);
    };
  }
};

let renderProjects = (projects) => {
  console.log("The render project function is running");
  result.innerHTML = "";
  projects.forEach((item, index) => {
    result.innerHTML += `
        <div class="result-container" id="${item._id}" data-index="${index}">
        <img src="${item.image_url}" alt="${item.name}">
        <div class="modal-container">
        <i class="bi bi-x" data-index="${index}"></i>
        <h3>${item.name}</h3>
        <p>${item.project}</p>
        <i class="bi bi-trash delete-button"></i>
        </div>
        </div>
        `;
  });
  collectDeleteButtons();
  let container = document.getElementsByClassName("result-container");
  let exit = document.getElementsByClassName("bi-x");
  for (let i = 0; i < container.length; i++) {
    container[i].onclick = () => {
      let modal = document.getElementsByClassName("modal-container");
      let projectId = container[i].dataset.index;
      modal[projectId].style.display = "block";
    };
  }
  for (let i = 0; i < exit.length; i++) {
    exit[i].onclick = () => {
      let modal = document.getElementsByClassName("modal-container");
      let projectId = exit[i].dataset.index;
      console.log(modal[projectId]);
      modal[projectId].toggleAttribute = "none";
    };
  };
};

//-----start app-----
showAllProjects();