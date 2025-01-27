const fs = require("fs");
const path = require("path");
const port = 3000; // moved from index.js

// This function reads the routes directory and returns an array of route objects.
/* Example route object:
{
  method: 'get',
  route: '/users/:id',
  filePath: '/routes/get-users-:id.js',
  type: 'js',
  statusCode: 200,
  fullRoute: 'http://localhost:3000/users/:id'
}
*/
function getRoutes() {
  const routesDir = path.join(process.cwd(), "routes");
  if (!fs.existsSync(routesDir)) {
    console.warn("No /routes directory found in current folder!");
    console.warn("Please create a /routes directory and add route files.");
    console.warn("Example: mkdir routes\n");
    process.exit(1);
  }

  const routes = [];
  const routeGroups = new Map(); // Group routes by base path

  const files = fs.readdirSync(routesDir);

  files.forEach((file) => {
    const parts = file.split("-");
    const method = parts[0];

    // Check if last part is status code
    const lastPart = parts[parts.length - 1].replace(/\.(js|json)$/, "");
    const statusCode = parseInt(lastPart);
    const hasStatusCode =
      !isNaN(statusCode) && statusCode >= 100 && statusCode < 600;

    // Build route parts
    const routeParts = hasStatusCode ? parts.slice(1, -1) : parts.slice(1);
    const basePath = "/" + routeParts.join("/").replace(/\.(js|json)$/, "");
    const filePath = path.join(routesDir, file);
    const type = file.endsWith(".json") ? "json" : "js";

    const route = {
      method,
      route: hasStatusCode ? `${basePath}?status=${statusCode}` : basePath,
      filePath,
      type,
      statusCode: hasStatusCode ? statusCode : 200,
      fullRoute: `http://localhost:${port}${basePath}${
        hasStatusCode ? `?status=${statusCode}` : ""
      }`,
    };

    // Group routes by base path
    const routeKey = `${method}-${basePath}`;
    if (!routeGroups.has(routeKey)) {
      routeGroups.set(routeKey, []);
    }
    routeGroups.get(routeKey).push(route);
  });

  // Add default docs route
  routes.push({
    method: "get",
    route: "/",
    type: "docs",
    statusCode: 200,
    fullRoute: `http://localhost:${port}/`,
  });

  // Process route groups
  routeGroups.forEach((groupedRoutes) => {
    groupedRoutes.forEach((route) => {
      routes.push(route);
    });
  });

  return routes;
}

module.exports = getRoutes;
