const mongoose = require("mongoose");

const express = require("express");
const app = express();
var cors = require("cors");


mongoose
  .connect(
    "mongodb+srv://bindiya:6V9SmUISkv23Avc1@website.jl0srwi.mongodb.net/dreamsoft-it-solutions-db",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    // Start your application here
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });


  const port = 5000;


  app.use(cors());

//   app.get("/", (req, res) => {
//     res.send("Hello World!");
//   });
//   app.get("/api/v1/login", (req, res) => {
//     res.send("Hello login!");
//   });
//   app.get("/api/v1/signup", (req, res) => {
//     res.send("Hello signup!");
//   });

///when we want to req.body then we use app.use(express.json());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use("/api/notes", require("./routes/notes"));

  app.listen(port, () => {
    console.log(`Notebook backend listening on port http://localhost:${port}`);
  });