const routesToHtml = require("../routesToHtml");

describe("routesToHtml", () => {
  const sampleRoutes = [
    {
      method: "get",
      route: "/api/test",
      type: "json",
      fullRoute: "http://localhost:3000/api/test",
      statusCode: 200,
    },
    {
      method: "post",
      route: "/api/users",
      type: "json",
      fullRoute: "http://localhost:3000/api/users",
      statusCode: 201,
    },
  ];

  let html;

  beforeEach(() => {
    html = routesToHtml(sampleRoutes);
  });

  test("generates valid HTML structure", () => {
    expect(html).toMatch(/<!DOCTYPE html>/);
    expect(html).toMatch(/<html>/);
    expect(html).toMatch(/<\/html>/);
    expect(html).toMatch(/<head>/);
    expect(html).toMatch(/<body>/);
  });

  test("includes page title", () => {
    expect(html).toMatch(/<title>API Routes Documentation<\/title>/);
    expect(html).toMatch(/<h1>API Routes Documentation<\/h1>/);
  });

  test("renders all routes", () => {
    sampleRoutes.forEach((route) => {
      expect(html).toContain(route.route);
      expect(html).toContain(route.method.toUpperCase());
      expect(html).toContain(`Status: ${route.statusCode}`);
      expect(html).toContain(`Type: ${route.type}`);
    });
  });

  test("generates correct curl commands", () => {
    // Test GET route
    expect(html).toContain(`curl "http://localhost:3000/api/test"`);

    // Test POST route
    expect(html).toContain(
      `curl -X POST "http://localhost:3000/api/users" -H "Content-Type: application/json" -d '{}'`
    );
  });

  test("includes copy button for curl commands", () => {
    expect(html).toContain('class="copy-btn"');
    expect(html).toContain("copyToClipboard");
  });

  test("includes proper styling classes", () => {
    expect(html).toContain('class="route json"');
    expect(html).toContain('class="method get"');
    expect(html).toContain('class="method post"');
    expect(html).toContain('class="path"');
    expect(html).toContain('class="details"');
  });

  test("handles empty routes array", () => {
    const emptyHtml = routesToHtml([]);
    expect(emptyHtml).toMatch(/<!DOCTYPE html>/);
    expect(emptyHtml).not.toContain('class="route"');
  });
});
