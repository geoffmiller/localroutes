const getRoutes = require("../getRoutes");
const fs = require("fs");
const path = require("path");

// Mock fs, exit, and path
let mockExit;
jest.mock("fs");
jest.mock("path");

describe("getRoutes", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock process.cwd()
    process.cwd = jest.fn().mockReturnValue("/test");

    // Mock process.exit
    mockExit = jest.spyOn(process, "exit").mockImplementation((number) => {});

    // Mock path.join to return predictable paths
    path.join.mockImplementation((...args) => args.join("/"));
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

  test("should handle empty directory", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);

    expect(getRoutes().length).toBe(1);
  });

  test("should handle invalid files", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["users.js", "data.json"]);

    expect(getRoutes().length).toBe(1);
  });

  test("should handle valid route files", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(["get-users.js", "post-data.json"]);

    const routes = getRoutes();
    expect(routes.length).toBe(3); // includes default route
  });

  test("should handle mixed valid and invalid files", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([
      "get-users.js",
      "users.txt",
      "post-data.json",
      "data.md",
    ]);

    const routes = getRoutes();
    expect(routes.length).toBe(3);
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
