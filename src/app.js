import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import socket from 'socket.io';
import 'dotenv/config';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import passport from 'passport';
import webPush from 'web-push';
import joiErrors from './middlewares/joiErrors';
import logger from './helpers/logger';
import { connectDb } from './models';
import routes from './routes';
import registerEvents from './middlewares/registerEvents';

const isProd = process.env.NODE_ENV === 'production';
const app = express();
const swaggerYAMLDocs = YAML.load('./docs/swagger.yml');
const { PUSH_PUBLIC_VAPID_KEY, PUSH_PRIVATE_VAPID_KEY } = process.env;

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  PUSH_PUBLIC_VAPID_KEY,
  PUSH_PRIVATE_VAPID_KEY,
);

connectDb().then(async () => {
  logger.info('Mongodb connected');
  registerEvents();
});

app.use(cors());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(routes);
app.use(joiErrors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerYAMLDocs));

const server = http.Server(app);
const io = socket(server, { log: true });
app.io = io;

if (isProd) {
  app.use((req, res) => {
    const status = 404;
    res.status(status).json({
      message: 'Not found',
      status,
    });
  });

  app.use((err, req, res) => {
    const status = err.status || 500;
    res.status(status).json({
      errors: {
        message: err.message,
        status,
      },
    });
  });
}

export default app;
