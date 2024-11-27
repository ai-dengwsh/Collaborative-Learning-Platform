import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// 加载环境变量
dotenv.config();

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常！正在关闭服务器...');
  console.error(err.name, err.message);
  process.exit(1);
});

// 连接数据库
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform');
    console.log(`MongoDB 已连接: ${conn.connection.host}`);
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

// 启动服务器
const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  await connectDB();
  console.log(`服务器正在运行，端口: ${port}`);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (err: Error) => {
  console.error('未处理的 Promise 拒绝！正在关闭服务器...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
}); 