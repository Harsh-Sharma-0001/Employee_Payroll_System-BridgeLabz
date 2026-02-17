const express = require("express");
const path = require("path");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

/* ================= HOME ================= */
app.get("/", async (req, res) => {
  try {
    let employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      employees = [];
    }

    res.render("index", { employees });
  } catch (err) {
    console.error(err);
    res.render("index", { employees: [] });
  }
});

/* ================= ADD PAGE ================= */
app.get("/add", (req, res) => {
  res.render("add");
});

/* ================= ADD POST ================= */
app.post("/add", async (req, res) => {
  const employees = await fileHandler.read();

  const newEmployee = {
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    basicSalary: Number(req.body.basicSalary),
    avatarColor: req.body.avatarColor || "blue",
  };

  employees.push(newEmployee);
  await fileHandler.write(employees);

  res.redirect("/");
});

/* ================= DELETE ================= */
app.get("/delete/:id", async (req, res) => {
  let employees = await fileHandler.read();

  employees = employees.filter((emp) => emp.id != req.params.id);

  await fileHandler.write(employees);
  res.redirect("/");
});

/* ================= EDIT PAGE ================= */
app.get("/edit/:id", async (req, res) => {
  const employees = await fileHandler.read();
  const employee = employees.find((emp) => emp.id == req.params.id);

  if (!employee) return res.redirect("/");

  res.render("edit", { employee });
});

/* ================= EDIT POST ================= */
app.post("/edit/:id", async (req, res) => {
  const employees = await fileHandler.read();

  const updated = employees.map((emp) => {
    if (emp.id == req.params.id) {
      return {
        ...emp,
        name: req.body.name,
        department: req.body.department,
        basicSalary: Number(req.body.basicSalary),
        avatarColor: req.body.avatarColor,
      };
    }
    return emp;
  });

  await fileHandler.write(updated);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
