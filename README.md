# AFK Multi-Bot Manager

A Node.js-based Minecraft AFK bot manager that can run multiple bot instances, managed via HTTP API and web dashboard. Designed for 24/7 hosting on Replit, VPS, or Pterodactyl.

## Features

- **Multi-Bot Management**: Run multiple Minecraft bots simultaneously
- **HTTP API**: Add, remove, list bots via REST API
- **Web Dashboard**: Beautiful UI to monitor and control all bots
- **Auto-Reconnect**: Bots automatically reconnect on disconnect with exponential backoff
- **Anti-AFK**: Random look/jump movements to prevent AFK kicks
- **Human-like Mode**: Optional random movements to appear more natural
- **Persistence**: Bot configurations saved to `bots.json` and restored on restart
- **Token Auth**: Optional API key authentication via `x-api-key` header
- **Rate Limiting**: Protection against API abuse
- **AuthMe Support**: Auto-login for servers using AuthMe plugin

## Quick Start

1. Clone/fork this repository
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`
4. Open the web dashboard at `http://localhost:5000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `API_TOKEN` | Optional API authentication token | (none) |

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/
```

### List Bots
```bash
curl http://localhost:5000/api/list
```

### Add Bot
```bash
curl -X POST http://localhost:5000/api/add \
  -H "Content-Type: application/json" \
  -d '{"username": "Bot1", "host": "mc.server.com", "port": 25565, "human": true}'
```

### Remove Bot
```bash
curl -X POST http://localhost:5000/api/remove \
  -H "Content-Type: application/json" \
  -d '{"username": "Bot1"}'
```

### Remove All Bots
```bash
curl -X POST http://localhost:5000/api/removeAll
```

### Bulk Add Bots
```bash
curl -X POST http://localhost:5000/api/bulk \
  -H "Content-Type: application/json" \
  -d '{"baseUsername": "Bot", "host": "mc.server.com", "count": 5, "delayMs": 2000}'
```

## With Authentication

If `API_TOKEN` is set, include the header:
```bash
curl -H "x-api-key: your-token" http://localhost:5000/api/list
```

## Deployment Guides

### Replit

1. Fork this Repl
2. Set `API_TOKEN` in Secrets (optional)
3. Click Run
4. Set up UptimeRobot to ping your Repl URL every 5 minutes for 24/7 uptime

**Resource Limits:**
- Free tier: 5-10 bots recommended
- Hacker/Pro: 15-25 bots

### VPS (systemd)

1. Upload files to `/opt/minecraft-bot-manager`
2. Install Node.js 18+
3. Run `npm install && npm run build`
4. Create systemd service:

```ini
[Unit]
Description=Minecraft AFK Bot Manager
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/minecraft-bot-manager
ExecStart=/usr/bin/node dist/server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

5. Enable and start: `sudo systemctl enable --now bot-manager`

### Pterodactyl

1. Create server with Node.js egg
2. Upload all project files
3. Set startup command: `node dist/server/index.js`
4. Configure environment variables
5. Run `npm install` then start

## Bot Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `username` | string | required | Bot's Minecraft username |
| `host` | string | required | Server hostname/IP |
| `port` | number | `25565` | Server port |
| `human` | boolean | `false` | Enable human-like movements |
| `antiAfkInterval` | number | `20000` | Anti-AFK action interval (ms) |
| `authmePassword` | string | - | AuthMe login password |
| `version` | string | auto | Minecraft version |

## Tips

- **Stagger bot creation**: Add delay between bots to avoid rate limits
- **Monitor memory**: Each bot uses ~50-100MB RAM
- **Use offline mode**: Bots use offline/cracked authentication
- **Backup bots.json**: Contains your bot configurations

## License

MIT
