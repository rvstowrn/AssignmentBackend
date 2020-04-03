const express = require("express");
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middlewares
app.use(express.json({ extended: false }));

// App Config
app.use(methodOverride("_method"));

// App Cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("JSDFLj");
});

// Define Routes
app.use("/api/admin", require("./routes/api/Admin/adminAttendanceHandler"));
app.use("/api/admin", require("./routes/api/Admin/adminSectionHandler"));
app.use("/api/admin", require("./routes/api/Admin/adminTaskHandler"));

app.use("/api/admin", require("./routes/api/Admin/adminTimetablesHandler"));
app.use("/api/admin", require("./routes/api/Admin/adminUserHandler"));
app.use("/api/admin", require("./routes/api/Admin/adminSubjectHandler"));

app.use("/api/students", require("./routes/api/Users/Student"));
app.use("/api/teachers", require("./routes/api/Users/Teacher"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
