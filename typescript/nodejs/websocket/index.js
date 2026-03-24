const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();

app.get("/", (req, res) => {
    res.send("HTTP server running");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

let messageCount = 0;

function processMessage(text) {
    messageCount++;
    const upper = text.toUpperCase();
    const reversed = upper.split("").reverse().join("");
    return { original: text, upper, reversed, count: messageCount };
}

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const text = message.toString();
        console.log(`Received: ${text}`);

        const result = processMessage(text);
        ws.send(JSON.stringify(result));
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.send("Welcome to the WebSocket server!");
});