import express, { NextFunction, Request, Response } from 'express';
import UsuarioController from '../controllers/usuario.controller';
import Usuario from '../entities/usuario.entity';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/usuarios/disponivel', async (req: Request, res: Response, next: NextFunction) => {
    try {
       const usuarioDisponivel: boolean = await new UsuarioController().checarEmailDisponivel(req.body.email);
       res.json(usuarioDisponivel);
    } catch (erro) {
        next(erro);
    }
})

router.post('/usuarios', async (req: Request, res: Response, next: NextFunction) => {
    try {
       const mensagem: Mensagem = await new UsuarioController().incluir(req.body);
       res.json(mensagem);
    } catch (erro) {
        next(erro);
    }
})

export default router;