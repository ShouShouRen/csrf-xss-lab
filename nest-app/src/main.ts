import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 使用 cookie-parser 中間件來解析 Cookie
  app.use(cookieParser());

  // 配置 CORS 以支援跨域請求攜帶 Cookie
  app.enableCors({
    origin: [
      'http://localhost:5173', // 原有的 react-app
      'http://localhost:5174', // 新的 secure-react-app
      'http://localhost:8080', // phishing-site
    ],
    credentials: true, // 允許攜帶 Cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
