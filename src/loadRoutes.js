const fs = require("fs");
const routesToHtml = require("./routesToHtml");
const findMatchingRoute = require("./findMatchingRoutes");
const delay = require("./delay");

async function loadRoutes(req, res, routes) {
  // Handle delay if specified
  if (req.query.delay) {
    const delayMs = parseInt(req.query.delay);
    if (delayMs > 60_000) {
      return res.status(400).send("Maximum delay is 60,000ms");
    }
    if (!isNaN(delayMs) && delayMs > 0) {
      await delay(delayMs);
    }
  }

  const matchedRoute = findMatchingRoute(req, routes);
  if (matchedRoute) {
    res.status(matchedRoute.statusCode);

    if (matchedRoute.type === "docs") {
      return res.send(routesToHtml(routes));
    }
    if (matchedRoute.type === "json") {
      const content = JSON.parse(
        fs.readFileSync(matchedRoute.filePath, "utf8")
      );
      return res.json(content);
    }
    if (matchedRoute.type === "js") {
      const handler = require(matchedRoute.filePath);
      return handler(req, res);
    }
    return res.status(404).send("no matching .js or .json files found");
  } else {
    // We don't have a matching route but we have a status query param
    if (req.query.status) {
      return res
        .status(parseInt(req.query.status))
        .json({ status: parseInt(req.query.status) });
    }
    // No matching route and no status query param
    return res.status(404).send("Route not found");
  }
}

module.exports = loadRoutes;
