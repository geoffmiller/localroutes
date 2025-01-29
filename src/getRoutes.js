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
  const HTTP_VERBS = [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "options",
    "head",
  ];

  function hasRouteFiles(dir) {
    const files = fs.readdirSync(dir);

    const validFiles = files.filter((file) => {
      // Check file extension
      const hasValidExt = file.endsWith(".js") || file.endsWith(".json");

      // Check starts with HTTP verb
      const startsWithVerb = HTTP_VERBS.some((verb) =>
        file.toLowerCase().startsWith(verb + "-")
      );

      return hasValidExt && startsWithVerb;
    });

    return validFiles.length > 0 ? validFiles : [];
  }

  const routesDir = process.cwd();

  const validFiles = hasRouteFiles(routesDir);

  if (validFiles.length < 1) {
    console.warn("\nNo valid route files found in current directory!");
    console.warn("\nFiles must:");
    console.warn(`1. Start with HTTP verb (${HTTP_VERBS.join(", ")})`);
    console.warn("2. End with .js or .json");
    console.warn("\nExample valid files:");
    console.warn("- get-users.json");
    console.warn("- post-user-500.js");
    console.warn("- put-user-:id.json\n");
    process.exit(1);
  }

  const routes = [];
  const routeGroups = new Map(); // Group routes by base path

  validFiles.forEach((file) => {
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
