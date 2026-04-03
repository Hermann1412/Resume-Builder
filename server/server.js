import "dotenv/config";
import express from "express";
import cors from "cors";
import dns from "dns";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRouter.js";
import aiRouter from "./routes/aiRoutes.js";

// Force Node to use public DNS resolvers to bypass router DNS issues with MongoDB SRV lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT  || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is Running...'));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error?.message || error);
  process.exit(1);
}