require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

require("./src/NOSQL/database/connection");
const PORT = process.env.PORT || 8000;
const app = express();

const api = require("./src/v1/routes/api");

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1/", api);

const server = http.createServer(app);
global.socket = require("./Socket/socket.event").socketConnection(server);

server.listen(PORT, () => {
  console.log("Server is active : http://localhost:%d", PORT);
});

module.exports = app;
