import express, { NextFunction, Request, Response } from 'express';
import UsuarioController from '../controllers/usuario.controller';

const router = express.Router();

router.post('/usuarios/disponivel', async (req: Request, res: Response, next: NextFunction) => {
    try {
       const usuarioDisponivel: boolean = await new UsuarioController().checarEmailDisponivel(req.body.email);
       res.json(usuarioDisponivel);
    } catch (erro) {
        next(erro);
    }
})

export default router;