function findMatchingRoute(req, routes) {
  const normalizedMethod = req.method.toLowerCase();
  const requestPath = req.path;
  const requestStatus = req.query.status;

  return (
    routes.find((route) => {
      // Check if methods match (case-insensitive)
      if (route.method.toLowerCase() !== normalizedMethod) {
        return false;
      }

      // Convert route pattern to regex
      const pattern = route.route.replace(/:[\w]+/g, "([^/]+)");
      const regex = new RegExp(`^${pattern}$`);

      // Check if paths match
      const pathMatches = regex.test(requestPath);

      // If status is specified in query, it must match
      if (requestStatus && route.statusCode.toString() !== requestStatus) {
        return false;
      }

      return pathMatches;
    }) || null
  );
}

module.exports = findMatchingRoute;
