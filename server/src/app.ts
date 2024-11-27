import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 安全中间件
app.use(helmet());

// CORS
app.use(cors());

// 请求日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 压缩响应
app.use(compression());

// 解析请求体
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API 路由
app.use(routes);

// 错误处理
app.use(errorHandler);

export default app; 