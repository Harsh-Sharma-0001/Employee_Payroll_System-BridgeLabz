const express = require("express");
const path = require("path");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// HOME - Dashboard
app.get("/", async (req, res) => {
  const employees = await fileHandler.readData();
  res.render("index", { employees });
});

// ADD PAGE
app.get("/add", (req, res) => {
  res.render("add");
});

// ADD EMPLOYEE
app.post("/add", async (req, res) => {
  let { name, department, salary } = req.body;

  salary = Number(salary);

  if (!name || salary < 0) {
    return res.send("Invalid Input!");
  }

  const employees = await fileHandler.readData();

  const newEmployee = {
    id: Date.now(),
    name,
    department,
    salary,
  };

  employees.push(newEmployee);

  await fileHandler.writeData(employees);

  res.redirect("/");
});

// DELETE EMPLOYEE
app.get("/delete/:id", async (req, res) => {
  const id = Number(req.params.id);

  let employees = await fileHandler.readData();
  employees = employees.filter((emp) => emp.id !== id);

  await fileHandler.writeData(employees);

  res.redirect("/");
});

// EDIT PAGE
app.get("/edit/:id", async (req, res) => {
  const id = Number(req.params.id);
  const employees = await fileHandler.readData();

  const employee = employees.find((emp) => emp.id === id);

  res.render("edit", { employee });
});

// UPDATE EMPLOYEE
app.post("/edit/:id", async (req, res) => {
  const id = Number(req.params.id);
  let { name, department, salary } = req.body;

  salary = Number(salary);

  if (!name || salary < 0) {
    return res.send("Invalid Input!");
  }

  const employees = await fileHandler.readData();

  const updatedEmployees = employees.map((emp) => {
    if (emp.id === id) {
      return { id, name, department, salary };
    }
    return emp;
  });

  await fileHandler.writeData(updatedEmployees);

  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
