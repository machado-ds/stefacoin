import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import Mensagem from '../utils/mensagem';
import { TipoUsuario } from '../utils/tipo-usuario.enum';

const router = express.Router();

router.post('/professores', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new ProfessorController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.put('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new ProfessorController().alterar(Number(id), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new ProfessorController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const professor: Professor = await new ProfessorController().obterPorId(Number(id));
    res.json(professor);
  } catch (e) {
    next(e);
  }
});

router.get('/professores', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const professores: Professor[] = await new ProfessorController().listar({tipo: {$eq: TipoUsuario.PROFESSOR}});
    const professoresSemSenha: Professor[] = professores.map(professor => {
      let {senha, ...professorSemSenha} = professor;
      return professorSemSenha as Professor;
    })
    res.json(professoresSemSenha);
  } catch (e) {
    next(e);
  }
});

export default router;
