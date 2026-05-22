import app from './app';
import { config } from './config/env';
import pool from './db';

const startServer = async () => {
  try {
    // Check DB connection (optional in development)
    try {
      const client = await pool.connect();
      console.log('Successfully connected to the PostgreSQL database (NeonDB compatible)');
      client.release();
    } catch (dbError) {
      if (config.env === 'development') {
        console.warn('⚠️  Database connection failed in development mode. Starting server anyway.');
        console.warn('   Make sure PostgreSQL is running on port 5432 or update DATABASE_URL in .env');
      } else {
        throw dbError; // In production, fail if DB can't connect
      }
    }

    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });


    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
          console.log('Database pool closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
