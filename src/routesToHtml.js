function generateRouteHtml(route) {
  const { method, route: path, type, fullRoute, statusCode } = route;
  const curlCmd =
    method.toLowerCase() === "get"
      ? `curl "${fullRoute}"`
      : `curl -X ${method.toUpperCase()} "${fullRoute}" -H "Content-Type: application/json" -d '{}'`;

  return `
    <div class="route ${type}">
      <div class="method ${method.toLowerCase()}">${method.toUpperCase()}</div>
      <div class="path">${path}</div>
      <div class="details">
        <div class="status">Status: ${statusCode}</div>
        <div class="type">Type: ${type}</div>
        <div class="curl-container">
          <pre class="curl"><code>${curlCmd}</code></pre>
          <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
        </div>
      </div>
    </div>
  `;
}

function routesToHtml(routes) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>API Routes Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      text-align: center;
      color: #333;
      border-bottom: 2px solid #ddd;
      padding-bottom: 10px;
    }
    .route {
      background: white;
      margin: 10px 0;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .route.test {
      border-left: 4px solid #9c27b0;
    }
    .route.json {
      border-left: 4px solid #2196f3;
    }
    .route.js {
      border-left: 4px solid #4caf50;
    }
    .method {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 3px;
      color: white;
      font-weight: bold;
      margin-right: 10px;
    }
    .method.get { background: #4caf50; }
    .method.post { background: #2196f3; }
    .method.put { background: #ff9800; }
    .method.delete { background: #f44336; }
    .path {
      display: inline-block;
      font-family: monospace;
      font-size: 1.1em;
    }
    .details {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
    .curl {
      background: #333;
      color: #fff;
      padding: 10px;
      border-radius: 3px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .status, .type {
      color: #666;
      font-size: 0.9em;
      margin: 5px 0;
    }
    .curl-container {
      position: relative;
      margin: 10px 0;
    }
    .copy-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      padding: 4px 8px;
      background: #555;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }
    .copy-btn:hover {
      background: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
    thead th {
      border-bottom: 2px solid #ddd;
    }
    .param-name {
      font-family: monospace;
      color: #2196f3;
    }
  </style>
  <script>
    function copyToClipboard(button) {
      const curlCode = button.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(curlCode).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      });
    }
  </script>
</head>
<body>
  <h1>API Routes Documentation</h1>
  
  <table>
    <thead>
      <tr>
        <th>Query Parameter</th>
        <th>Description</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="param-name">status</td>
        <td>Serve the file appended with <code>-{status}</code> or override the default status code of the response</td>
        <td><code>?status=404</code></td>
      </tr>
      <tr>
        <td class="param-name">delay</td>
        <td>Add artificial delay to the response (in milliseconds)</td>
        <td><code>?delay=2000</code></td>
      </tr>
    </tbody>
  </table>

  ${routes.map(generateRouteHtml).join("\n")}
</body>
</html>
  `;

  return html;
}

module.exports = routesToHtml;
