const getRoutes = require("../getRoutes");
const fs = require("fs");
const path = require("path");

// Mock fs and path
jest.mock("fs");
jest.mock("path");

describe("getRoutes", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock process.cwd()
    process.cwd = jest.fn().mockReturnValue("/test");

    // Mock path.join to return predictable paths
    path.join.mockImplementation((...args) => args.join("/"));
  });

  test("should have the default / route", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users.json"]);

    const routes = getRoutes();
    expect(routes[0]).toMatchObject({
      method: "get",
      route: "/",
      statusCode: 200,
      type: "docs",
    });
  });

  test("should parse basic route file names", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users.json"]);

    const routes = getRoutes();
    expect(routes[1]).toMatchObject({
      method: "get",
      route: "/users",
      statusCode: 200,
      type: "json",
    });
  });

  test("should parse route with status code", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users-500.json"]);

    const routes = getRoutes();
    expect(routes[1]).toMatchObject({
      method: "get",
      route: "/users?status=500",
      statusCode: 500,
      type: "json",
    });
  });

  test("should parse route with parameters", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users-:id-history.json"]);

    const routes = getRoutes();
    expect(routes[1]).toMatchObject({
      method: "get",
      route: "/users/:id/history",
      statusCode: 200,
      type: "json",
    });
  });

  test("should exit if routes directory does not exist", () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    fs.existsSync.mockReturnValue(false);

    getRoutes();
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("should handle both .js and .json files", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users.json", "post-user.js"]);

    const routes = getRoutes();
    expect(routes[1].type).toBe("json");
    expect(routes[2].type).toBe("js");
  });

  test("should group routes with same base path", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([
      "get-users-:id-history.json",
      "get-users-:id-history-500.json",
    ]);

    const routes = getRoutes();
    expect(routes).toHaveLength(3);
    expect(routes[1].statusCode).toBe(200);
    expect(routes[2].statusCode).toBe(500);
  });
});
