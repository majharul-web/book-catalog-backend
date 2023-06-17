import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Server } from 'http';

let server: Server;

process.on('uncaughtException', (error: Error) => {
  console.log(error);
  process.exit(1);
});

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connected to MongoDB');
    server = app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error);
  }

  process.on('unhandledRejection', (error: Error) => {
    if (server) {
      server.close(() => {
        console.log('Server is closed due to unhandledRejection', error);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Process terminated');
    });
  }
});
