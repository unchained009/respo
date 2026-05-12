import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*"
})); 

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'respo API is operational.',
    version: '1.0.0'
  });
});

app.use('/api/platform', platformRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/analytics', analyticsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientPath, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

export default app;
