const logRoutes = require("../logRoutes");

describe("logRoutes", () => {
  let consoleLogSpy;
  const originalLog = console.log;

  beforeEach(() => {
    consoleLogSpy = jest.fn();
    console.log = consoleLogSpy;
  });

  afterEach(() => {
    console.log = originalLog;
    jest.clearAllMocks();
  });

  test("should log header correctly", () => {
    logRoutes([]);

    expect(consoleLogSpy).toHaveBeenCalledWith("****************************");
    expect(consoleLogSpy).toHaveBeenCalledWith("*     Available Routes     *");
    expect(consoleLogSpy).toHaveBeenCalledWith("****************************");
  });

  test("should log test route correctly", () => {
    const routes = [
      {
        method: "get",
        route: "/hello-world",
        type: "test",
        fullRoute: "http://localhost:3000/hello-world",
        statusCode: 200,
      },
    ];

    logRoutes(routes);

    // Find all calls containing test route info
    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls).toContain("\nMethod: GET");
    expect(calls).toContain("Route: /hello-world");
    expect(calls).toContain("Status Code: 200");
    expect(
      calls.some((call) =>
        call.includes('curl "http://localhost:3000/hello-world"')
      )
    ).toBeTruthy();
  });

  test("should log route a route with no status code as 200", () => {
    const routes = [
      {
        method: "get",
        route: "/hello-world",
        type: "test",
        fullRoute: "http://localhost:3000/hello-world",
        statusCode: undefined,
      },
    ];

    logRoutes(routes);

    // Find all calls containing test route info
    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls).toContain("\nMethod: GET");
    expect(calls).toContain("Route: /hello-world");
    expect(calls).toContain("Status Code: 200");
    expect(
      calls.some((call) =>
        call.includes('curl "http://localhost:3000/hello-world"')
      )
    ).toBeTruthy();
  });

  test("should log JSON route with status code correctly", () => {
    const routes = [
      {
        method: "get",
        route: "/users?status=404",
        type: "json",
        fullRoute: "http://localhost:3000/users?status=404",
        statusCode: 404,
      },
    ];

    logRoutes(routes);

    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls).toContain("\nMethod: GET");
    expect(calls).toContain("Route: /users?status=404");
    expect(calls).toContain("Status Code: 404");
  });

  test("should log POST route correctly", () => {
    const routes = [
      {
        method: "post",
        route: "/users",
        type: "js",
        fullRoute: "http://localhost:3000/users",
        statusCode: 200,
      },
    ];

    logRoutes(routes);

    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls.some((call) => call.includes("curl -X POST"))).toBeTruthy();
    expect(
      calls.some((call) => call.includes('-H "Content-Type: application/json"'))
    ).toBeTruthy();
    expect(calls.some((call) => call.includes("-d '{}'"))).toBeTruthy();
  });

  test("should log multiple routes", () => {
    const routes = [
      {
        method: "get",
        route: "/users",
        type: "js",
        fullRoute: "http://localhost:3000/users",
        statusCode: 200,
      },
      {
        method: "post",
        route: "/users",
        type: "js",
        fullRoute: "http://localhost:3000/users",
        statusCode: 200,
      },
    ];

    logRoutes(routes);

    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls.filter((call) => call.includes("Method:")).length).toBe(2);
  });
});
