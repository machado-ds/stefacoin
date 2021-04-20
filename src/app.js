import express from 'express';
import logger from 'morgan';
import BlockchainRoute from './routes/blockchain.route';

class App {
  constructor() {
    this.app = express();

    this.initMiddlewares();
    this.routes();
    this.endMiddlewares();
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(logger('dev'));
  }

  endMiddlewares() {
    this.app.use((err, req, res, next) => {
      if (!res.headersSent && err) {
        res.status(400).json({ message: err.message, status: 400 });
      }
      next();
    });
  }

  routes() {
    this.app.use('/stefanini', BlockchainRoute);
  }
}

export default new App().app;
