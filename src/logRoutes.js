// Logs all available routes to the console with a sample curl command.
function logRoutes(routes) {
  console.log("****************************");
  console.log("*     Available Routes     *");
  console.log("****************************");

  routes.forEach(({ method, route, fullRoute, type, statusCode }) => {
    console.log(
      `\n${
        type === "test"
          ? "-------- API DOCS ---------"
          : "----------------------------"
      }`
    );
    console.log(`\nMethod: ${method.toUpperCase()}`);
    console.log(`Route: ${route}`);
    console.log(`Status Code: ${statusCode || 200}`);
    const curlCmd =
      method.toLowerCase() === "get"
        ? `curl "${fullRoute}"`
        : `curl -X ${method.toUpperCase()} "${fullRoute}" -H "Content-Type: application/json" -d '{}'`;
    console.log("Sample curl:");
    console.log(curlCmd);
  });
  console.log("\n****************************");
}

module.exports = logRoutes;
