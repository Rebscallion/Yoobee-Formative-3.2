console.log("hello");

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

let renderProjects = (projects) => {
    console.log("The render project function is running");
    result.innerHTML = "";
    projects.forEach((item) => {
      result.innerHTML += `
        <div class="result-container">
        <img src="${item.image_url}" alt="${item.name}">
        <div class="modal-container">
        <h3>${item.name}</h3>
        <p>${item.project}</p>
        </div>
        </div>
        `;
    });
  };
  
  //-----start app-----
  showAllProjects();