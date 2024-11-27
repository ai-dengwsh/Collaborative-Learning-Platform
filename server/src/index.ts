import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { handleChat } from './socket/chatHandler';
import { verifyToken } from './utils/jwt';
import { AuthenticatedSocket } from './types/socket';

// 导入路由
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import discussionRoutes from './routes/discussionRoutes';
import chatRoutes from './routes/chatRoutes';
import uploadRoutes from './routes/uploadRoutes';

// 创建Express应用
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.IO认证中间件
io.use(async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO连接处理
io.on('connection', (socket: AuthenticatedSocket) => {
  console.log('User connected:', socket.user?._id);
  handleChat(io, socket);
});

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform')
  .then(() => {
    console.log('Connected to MongoDB');
    // 启动服务器
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 