import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from './config/db.js';
import routes from './routes/auditionRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import adminDashboardRoutes from './routes/adminDashboard_route.js';
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use('/api', routes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
  
app.get("/", (req, res) => {
  res.json({ message: "Hornbill Music Festival API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
