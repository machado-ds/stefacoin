import express from 'express';
import AuthController from '../controllers/auth.controller';
import Login from '../models/login.model';
import usuarioRepository from '../repositories/usuario.repository';

const router = express.Router();

/**
 * Login temporário até a conclusão do oidc
 */
router.post('/auth', async (req, res, next) => {
  try {
    let login: Login = await new AuthController().login(req.body);
    login.usuario.id = await usuarioRepository.obterIdPeloEmail(login.usuario.email);
    res.json(login);
  } catch (err) {
    next(err);
  }
});

export default router;
