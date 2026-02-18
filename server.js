const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

/* ================= HOME (SEARCH ENABLED) ================= */
app.get("/", async (req, res) => {
  try {
    let employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      employees = [];
    }

    const search = req.query.search ? req.query.search.trim() : "";

    let filteredEmployees = employees;

    if (search) {
      const lower = search.toLowerCase();

      filteredEmployees = employees.filter((emp) =>
        emp.name.toLowerCase().includes(lower) || emp.department.toLowerCase().includes(lower),
      );
    }

    res.render("index", { employees: filteredEmployees, search});
  }
  catch (err) {
    console.error("Error loading home:", err);
    res.render("index", { employees: [], search: ""});
  }
});

/* ================= ADD PAGE ================= */
app.get("/add", (req, res) => {
  res.render("add");
});

/* ================= ADD POST ================= */
app.post("/add", async (req, res) => {
  try {
    let employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      employees = [];
    }

    const name = req.body.name?.trim();
    const department = req.body.department?.trim();
    const basicSalary = Number(req.body.basicSalary);

    // Basic validation
    if (!name || !department || basicSalary < 0) {
      return res.redirect("/add");
    }

    const newEmployee = {
      id: Date.now(),
      name,
      department,
      basicSalary,
      avatarColor: req.body.avatarColor || "blue",
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect("/");
  }
  catch (err) {
    console.error("Error adding employee:", err);
    res.redirect("/");
  }
});

/* ================= DELETE ================= */
app.get("/delete/:id", async (req, res) => {
  try {
    let employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      employees = [];
    }

    employees = employees.filter((emp) => emp.id != req.params.id);

    await fileHandler.write(employees);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting:", err);
    res.redirect("/");
  }
});

/* ================= EDIT PAGE ================= */
app.get("/edit/:id", async (req, res) => {
  try {
    const employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      return res.redirect("/");
    }

    const employee = employees.find((emp) => emp.id == req.params.id);

    if (!employee) return res.redirect("/");

    res.render("edit", { employee });
  } catch (err) {
    console.error("Error loading edit:", err);
    res.redirect("/");
  }
});

/* ================= EDIT POST ================= */
app.post("/edit/:id", async (req, res) => {
  try {
    let employees = await fileHandler.read();

    if (!Array.isArray(employees)) {
      employees = [];
    }

    const updatedEmployees = employees.map((emp) => {
      if (emp.id == req.params.id) {
        return {
          ...emp,
          name: req.body.name?.trim(),
          department: req.body.department?.trim(),
          basicSalary: Number(req.body.basicSalary),
          avatarColor: req.body.avatarColor || "blue",
        };
      }
      return emp;
    });

    await fileHandler.write(updatedEmployees);
    res.redirect("/");
  } catch (err) {
    console.error("Error updating:", err);
    res.redirect("/");
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
