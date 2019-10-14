const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
var contReqs = 0;

//requests count
server.use((req, res, next)=>{
  contReqs+=1;
  console.log(`Contador de Requests: ${contReqs}`);

  return next();
});

function checkId (req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({error:"Project does not exist"});
  }

  //add a new req variable
  req.project = project;

  return next();
}


//register new project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});


//lists all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//change title project with id
server.put('/projects/:id', checkId, (req, res)=>{
  // const { id } = req.params;
  const { title } = req.body;
  // const project = projects.find(p => p.id == id);
  req.project.title = title;
  return res.json(req.project);
});

//delete a project
server.delete('/projects/:id', checkId, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();

});

//add new task to project id
server.post('/projects/:id/tasks', checkId, (req,res)=> {
  const { title } = req.body;

  // const { id } = req.params;
  // const project = projects.find(p => p.id == id);

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen(3333);
