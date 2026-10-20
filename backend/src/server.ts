import app from './app.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  console.log(`[EESHA Backend] Server running in ${ENV.NODE_ENV} mode on http://localhost:${PORT}`);
  console.log(`[EESHA Backend] API base URL: http://localhost:${PORT}/api/v1`);
  console.log(`[EESHA Backend] Health check: http://localhost:${PORT}/api/v1/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server cleanly...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
