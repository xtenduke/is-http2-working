import fs from "fs";
import https from "https"; // Use HTTPS instead of HTTP
import http2 from "http2";

const HTTP1_PORT = process.env.HTTP1_PORT ?? 3000;
const HTTP2_PORT = process.env.HTTP2_PORT ?? 3001;
const ORIGIN = process.env.CORS_ORIGIN ?? "*";
const SSL_KEY = process.env.SSL_KEY ?? "/var/ssl/server.key";
const SSL_CERT = process.env.SSL_CERT ?? "/var/ssl/server.crt";

// Load SSL certificate and key for both servers
const options = {
  key: fs.readFileSync(SSL_KEY),
  cert: fs.readFileSync(SSL_CERT),
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Create an HTTPS (HTTP/1.1 over TLS) server with CORS
const httpsServer = https.createServer(options, (req, res) => {
  console.log("HTTPS Request:", req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  res.writeHead(200, { "Content-Type": "application/json", ...corsHeaders });
  res.end(JSON.stringify({ message: "Hello from HTTPS (HTTP/1.1) server!" }));
});

// Start HTTPS server
httpsServer.listen(HTTP1_PORT, () => {
  console.log(`🚀 HTTPS (HTTP/1.1) server running at https://localhost:${HTTP1_PORT}`);
});

// Create an HTTP/2 secure server with CORS
const http2Server = http2.createSecureServer(options);

http2Server.on("stream", (stream, headers) => {
  console.log("HTTP/2 Request:", headers[":path"]);

  // Set response headers (including CORS)
  stream.respond({
    "content-type": "application/json",
    ":status": 200,
    ...corsHeaders,
  });

  // Send JSON response
  stream.end(JSON.stringify({ message: "Hello from HTTP/2 server!" }));
});

// Start HTTP/2 server
http2Server.listen(HTTP2_PORT, () => {
  console.log(`🚀 HTTP/2 server running at https://localhost:${HTTP2_PORT}`);
});

