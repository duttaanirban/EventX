import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { configurePassport } from './config/passport.js';
import { securityMiddlewares } from './middlewares/security.js';
import { errorHandler, notFound } from './middlewares/error.js';
import routes from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';

configurePassport();

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  })
);
app.use(cookieParser(env.cookieSecret));
app.use(passport.initialize());
app.use(securityMiddlewares);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'eventx-api' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
