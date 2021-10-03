const express = require("express");
const cors = require("cors");
const RaspberryRoutes = require("./src/routes/raspberry");

const app = express();
const PORT = 8080;

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => res.json({ message: "Raspberry Pi Status" }));
app.use("/api/raspberry", RaspberryRoutes);

app.listen(PORT, () => console.log(`Server at ${PORT}`));
