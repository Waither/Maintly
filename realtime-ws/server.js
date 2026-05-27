const http = require('http');
const WebSocket = require('ws');

const port = parseInt(process.env.PORT || '8001', 10);
const heartbeatMs = parseInt(process.env.HEARTBEAT_MS || '30000', 10);
const broadcastToken = process.env.BROADCAST_TOKEN;

async function handleRequest(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');

  if (req.method === 'POST' && url.pathname === '/broadcast') {
    if (broadcastToken) {
      const authHeader = req.headers.authorization || '';
      if (authHeader !== `Bearer ${broadcastToken}`) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('unauthorized');
        return;
      }
    }

    const body = await readBody(req);
    let event;
    try {
      event = JSON.parse(body || '{}');
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('invalid json');
      return;
    }

    if (!event || typeof event.type !== 'string') {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('invalid event');
      return;
    }

    broadcastEvent(event);

    res.writeHead(202, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, delivered: wss.clients.size }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1000000) {
        req.destroy();
        reject(new Error('payload too large'));
      }
    });

    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function broadcastEvent(event) {
  const payload = JSON.stringify({
    ...event,
    ts: event.ts || new Date().toISOString(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(() => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('error');
  });
});

const wss = new WebSocket.Server({ server });

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.send(JSON.stringify({ type: '__connected', ts: new Date().toISOString() }));

  ws.on('message', (data) => {
    try {
      const event = JSON.parse(data.toString());
      if (!event || typeof event.type !== 'string') {
        return;
      }
      broadcastEvent(event);
    } catch {
      // Ignore non-JSON messages.
    }
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, heartbeatMs);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`Realtime WS listening on :${port}`);
});
