import express from 'express';
import TransacaoController from '../controllers/transacao.controller';

const router = express.Router();

router.post('/blockchain/transacao', async (req, res, next) => {
  try {
    const registro = await new TransacaoController().registrarTransacao(
      req.body
    );
    res.json(registro);
  } catch (e) {
    next(e);
  }
});

export default router;
