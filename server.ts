import express from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import apiRouter from './routes/api';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    project: ENV.PROJECT_NAME,
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', project: ENV.PROJECT_NAME, version: '1.0.0' });
});

// Direct 1-Click ZIP Download Endpoint
app.get('/download', (req, res) => {
  const zipPath = path.resolve(__dirname, '../../smart-curriculum-attendance.zip');
  res.download(zipPath, 'smart-curriculum-attendance.zip');
});

app.get('/download/smart-curriculum-attendance.zip', (req, res) => {
  const zipPath = path.resolve(__dirname, '../../smart-curriculum-attendance.zip');
  res.download(zipPath, 'smart-curriculum-attendance.zip');
});

app.use('/api', apiRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const startServer = async () => {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ${ENV.PROJECT_NAME} API Server`);
    console.log(`🌐 Server running on http://localhost:${ENV.PORT}`);
    console.log(`📥 Download Endpoint: http://localhost:${ENV.PORT}/download`);
    console.log(`=======================================================`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
