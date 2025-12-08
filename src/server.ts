/**
 * @fileoverview Server Entry Point
 * 
 * Main entry point for the application.
 * Creates the app and starts the server.
 */

import { createApp, startServer } from './app';

/**
 * Main function that initializes and starts the server.
 */
async function main(): Promise<void> {
  const app = await createApp();
  await startServer(app);
}

// Start the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

