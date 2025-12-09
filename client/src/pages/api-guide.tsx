import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const endpoints = [
  {
    method: "GET",
    path: "/",
    description: "Health check endpoint",
    curl: 'curl http://localhost:5000/',
    response: '{ "ok": true, "message": "AFK Bot Manager is running" }',
  },
  {
    method: "GET",
    path: "/api/list",
    description: "List all active bots",
    curl: 'curl http://localhost:5000/api/list',
    response: '{ "ok": true, "bots": [...], "count": 3 }',
  },
  {
    method: "POST",
    path: "/api/add",
    description: "Add a new bot",
    curl: `curl -X POST http://localhost:5000/api/add \\
  -H "Content-Type: application/json" \\
  -d '{"username": "Bot1", "host": "mc.server.com", "port": 25565, "human": true}'`,
    response: '{ "ok": true, "username": "Bot1" }',
  },
  {
    method: "POST",
    path: "/api/remove",
    description: "Remove a bot by username",
    curl: `curl -X POST http://localhost:5000/api/remove \\
  -H "Content-Type: application/json" \\
  -d '{"username": "Bot1"}'`,
    response: '{ "ok": true, "username": "Bot1" }',
  },
  {
    method: "POST",
    path: "/api/removeAll",
    description: "Remove all bots",
    curl: 'curl -X POST http://localhost:5000/api/removeAll',
    response: '{ "ok": true, "count": 3 }',
  },
  {
    method: "POST",
    path: "/api/bulk",
    description: "Add multiple bots with delay",
    curl: `curl -X POST http://localhost:5000/api/bulk \\
  -H "Content-Type: application/json" \\
  -d '{"baseUsername": "Bot", "host": "mc.server.com", "count": 5, "delayMs": 2000}'`,
    response: '{ "ok": true, "created": 5 }',
  },
];

const deployGuides = {
  replit: `# Replit Deployment Guide

## Setup
1. Fork/Import this Repl
2. Set environment variables in Secrets:
   - API_TOKEN (optional): Your API authentication token
3. Click Run to start the server

## Keep Alive 24/7
1. Go to uptimerobot.com and create free account
2. Add new HTTP(s) monitor
3. Enter your Repl URL (e.g., https://your-repl.username.repl.co)
4. Set monitoring interval to 5 minutes

## Notes
- Free tier: Max ~10 bots recommended
- Hacker plan: Up to 25 bots
- Pro plan: 50+ bots possible`,

  vps: `# VPS Deployment Guide (systemd)

## Prerequisites
- Node.js 18+ installed
- npm or yarn

## Installation
\`\`\`bash
# Clone or upload files
cd /opt/minecraft-bot-manager
npm install

# Create .env file
echo "API_TOKEN=your-secret-token" > .env
echo "PORT=5000" >> .env
\`\`\`

## Create systemd service
\`\`\`bash
sudo nano /etc/systemd/system/bot-manager.service
\`\`\`

\`\`\`ini
[Unit]
Description=Minecraft AFK Bot Manager
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/minecraft-bot-manager
ExecStart=/usr/bin/node dist/server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
\`\`\`

## Start service
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable bot-manager
sudo systemctl start bot-manager
sudo systemctl status bot-manager
\`\`\``,

  pterodactyl: `# Pterodactyl Deployment Guide

## Create Server
1. Create new server with Node.js egg
2. Set startup command:
   \`node dist/server/index.js\`

## Upload Files
1. Use SFTP or web file manager
2. Upload all project files
3. Create .env file with your settings

## Environment Variables
Add in Startup tab:
- API_TOKEN: Your secret token
- PORT: 5000

## Install & Start
1. Go to Console tab
2. Run: npm install
3. Run: npm run build
4. Start the server

## Notes
- Set appropriate memory limits
- Node.js 18+ recommended
- Check server logs for issues`,
};

export default function ApiGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Guide</h1>
        <p className="text-muted-foreground">HTTP API documentation and deployment guides</p>
      </div>

      <Tabs defaultValue="endpoints">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="endpoints" data-testid="tab-endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="deploy" data-testid="tab-deploy">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                If API_TOKEN is set in environment, include header:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="block bg-muted p-3 rounded-md font-mono text-sm">
                x-api-key: your-token-here
              </code>
            </CardContent>
          </Card>

          {endpoints.map((endpoint) => (
            <Card key={`${endpoint.method}-${endpoint.path}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant={endpoint.method === "GET" ? "secondary" : "default"}
                    className="font-mono"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="font-mono text-sm">{endpoint.path}</code>
                </div>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">cURL Example:</p>
                  <ScrollArea className="h-auto max-h-32">
                    <pre className="bg-muted p-3 rounded-md font-mono text-xs whitespace-pre-wrap break-all">
                      {endpoint.curl}
                    </pre>
                  </ScrollArea>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Response:</p>
                  <pre className="bg-muted p-3 rounded-md font-mono text-xs">
                    {endpoint.response}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="deploy" className="mt-4">
          <Tabs defaultValue="replit">
            <TabsList className="mb-4">
              <TabsTrigger value="replit">Replit</TabsTrigger>
              <TabsTrigger value="vps">VPS (systemd)</TabsTrigger>
              <TabsTrigger value="pterodactyl">Pterodactyl</TabsTrigger>
            </TabsList>

            {Object.entries(deployGuides).map(([key, guide]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-[500px]">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {guide}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
