const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicDirectory = __dirname;
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT must be a number between 1 and 65535.");
  process.exit(1);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(publicDirectory, `.${requestedPath}`);

  if (filePath !== publicDirectory && !filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const headers = {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": stats.size,
      "X-Content-Type-Options": "nosniff"
    };
    response.writeHead(200, headers);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.on("error", (error) => {
      console.error(`Could not read ${filePath}:`, error);
      if (!response.headersSent) {
        response.writeHead(500);
      }
      response.end("Internal server error");
    });
    fileStream.pipe(response);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Set another port with PORT=3001.`);
    process.exitCode = 1;
    return;
  }
  console.error("Could not start the local server:", error);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`SafeSpace is running at http://${host}:${port}`);
  console.log("Press Ctrl+C to stop the server.");
});
