# 📊 Employee Payroll System – BridgeLabz

A full-stack **Employee Payroll Management System** built using **Node.js**, **Express**, and **EJS**. It is designed to perform CRUD operations on employee data with a simple and clean user interface.

This project demonstrates backend fundamentals, MVC-like structure, file handling, and server-side rendering.

## 🚀 Features

*   ➕ **Add** new employees
*   📋 **View** all employees
*   ✏️ **Edit** employee details
*   ❌ **Delete** employee records
*   💾 **Persistent storage** using a JSON file
*   🎨 **Simple UI** using EJS templates
*   ⚡ **Fast** server-side rendering

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** EJS (Embedded JavaScript Templates), CSS
*   **Storage:** JSON file (File-based DB)
*   **Other:** File System Module (`fs`)

## 📂 Project Structure

```text
Employee_Payroll_System-BridgeLabz/
│
├── modules/
│   └── fileHandler.js        # Handles file read/write operations
│
├── public/
│   └── style.css             # Styling for UI
│
├── views/
│   ├── index.ejs             # Home / Employee list
│   ├── add.ejs               # Add employee page
│   └── edit.ejs              # Edit employee page
│
├── employees.json            # Stores employee data
├── server.js                 # Main server file
├── package.json              # Project dependencies
├── package-lock.json
└── README.md
