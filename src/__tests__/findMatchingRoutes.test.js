const findMatchingRoute = require("../findMatchingRoutes");

describe("findMatchingRoute", () => {
  const mockRoutes = [
    { method: "get", route: "/users", statusCode: 200, type: "json" },
    { method: "get", route: "/users/:id", statusCode: 200, type: "json" },
    { method: "post", route: "/users", statusCode: 201, type: "json" },
    {
      method: "get",
      route: "/users/:id/profile",
      statusCode: 200,
      type: "json",
    },
    {
      method: "get",
      route: "/users/:id/profile",
      statusCode: 404,
      type: "json",
    },
    { method: "put", route: "/users/:id", statusCode: 200, type: "json" },
    { method: "delete", route: "/users/:id", statusCode: 204, type: "json" },
  ];

  test("matches exact route", () => {
    const req = {
      method: "GET",
      path: "/users",
      query: {},
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toEqual(mockRoutes[0]);
  });

  test("matches route with path parameter", () => {
    const req = {
      method: "GET",
      path: "/users/123",
      query: {},
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toEqual(mockRoutes[1]);
  });

  test("matches nested route with path parameter", () => {
    const req = {
      method: "GET",
      path: "/users/123/profile",
      query: {},
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toEqual(mockRoutes[3]);
  });

  test("matches route with specific status code", () => {
    const req = {
      method: "GET",
      path: "/users/123/profile",
      query: { status: "404" },
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toEqual(mockRoutes[4]);
  });

  test("matches different HTTP methods", () => {
    const postReq = {
      method: "POST",
      path: "/users",
      query: {},
    };
    const putReq = {
      method: "PUT",
      path: "/users/123",
      query: {},
    };
    const deleteReq = {
      method: "DELETE",
      path: "/users/123",
      query: {},
    };

    expect(findMatchingRoute(postReq, mockRoutes)).toEqual(mockRoutes[2]);
    expect(findMatchingRoute(putReq, mockRoutes)).toEqual(mockRoutes[5]);
    expect(findMatchingRoute(deleteReq, mockRoutes)).toEqual(mockRoutes[6]);
  });

  test("returns null for non-matching route", () => {
    const req = {
      method: "GET",
      path: "/nonexistent",
      query: {},
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toBeNull();
  });

  test("returns null for wrong method on existing path", () => {
    const req = {
      method: "POST",
      path: "/users/123",
      query: {},
    };
    const result = findMatchingRoute(req, mockRoutes);
    expect(result).toBeNull();
  });

  test("handles multiple path parameters", () => {
    const routesWithMultipleParams = [
      ...mockRoutes,
      {
        method: "get",
        route: "/users/:userId/posts/:postId",
        statusCode: 200,
        type: "json",
      },
    ];

    const req = {
      method: "GET",
      path: "/users/123/posts/456",
      query: {},
    };
    const result = findMatchingRoute(req, routesWithMultipleParams);
    expect(result).toEqual(routesWithMultipleParams[7]);
  });
});
