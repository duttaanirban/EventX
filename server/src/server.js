import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './socket/index.js';

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.port, () => console.log(`EventX API running on port ${env.port}`));
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
