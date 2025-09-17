import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import serviceRoutes from './routes/serviceRoutes'; 
import adminRoutes from './routes/adminRoutes';
import informationRoutes from './routes/informationRoutes'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Rotas
app.use('/services', serviceRoutes);
app.use('/auth', adminRoutes);
app.use('/information', informationRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
