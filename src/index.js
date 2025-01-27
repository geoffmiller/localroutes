const express = require("express");
const app = express();
const cors = require("cors");

// custom modules
const getRoutes = require("./getRoutes");
const loadRoutes = require("./loadRoutes");
const logRoutes = require("./logRoutes");

// add middleware
app.use(cors());
app.use(express.json());

// enable pre-flight for all routes
app.options("*", cors());
// disable caching
app.disable("etag");

const routes = getRoutes();

app.all("*", async (req, res) => {
  loadRoutes(req, res, routes);
});

logRoutes(routes);

const startServer = (port = 3000) => {
  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
    console.log("****************************");
  });
};

// Export the function if being required (local dev)
// else start the server
if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
