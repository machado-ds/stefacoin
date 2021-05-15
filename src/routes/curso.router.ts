import express, { NextFunction, Request, Response } from 'express';
import CursoController from '../controllers/curso.controller';
import Curso from '../entities/curso.entity';
import Avaliacao from '../models/avaliacao.model';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.post('/cursos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mensagem: Mensagem = await new CursoController().incluir(req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.post('/cursos/nome-disponivel', async (req: Request, res: Response, next: NextFunction) => {
  try {
     const nomeCursoDisponivel: boolean = await new CursoController().checarNomeCursoDisponivel(req.body.nomeCurso);
     res.json(nomeCursoDisponivel);
  } catch (erro) {
      next(erro);
  }
})

router.put('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().alterar(Number(id), req.body);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.delete('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const mensagem: Mensagem = await new CursoController().excluir(Number(id));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
});

router.get('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const curso: Curso = await new CursoController().obterPorId(Number(id));
    res.json(curso);
  } catch (e) {
    next(e);
  }
});

router.get('/cursos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursos: Curso[] = await new CursoController().listar();
    res.json(cursos);
  } catch (e) {
    next(e);
  }
});

router.put('/cursos/:cursoId/matricula', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cursoId } = req.params;
    const { alunoId } = req.query;
    const mensagem: Mensagem = await new CursoController().matricular(Number(cursoId), Number(alunoId));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

router.put('/cursos/:cursoId/cancelarMatricula', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cursoId } = req.params;
    const { alunoId } = req.query;
    const mensagem: Mensagem = await new CursoController().cancelarMatricula(Number(cursoId), Number(alunoId));
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

router.put('/cursos/:cursoId/avaliar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cursoId } = req.params;
    const avaliacao: Avaliacao = req.body;
    const mensagem: Mensagem = await new CursoController().avaliar(Number(cursoId), avaliacao);
    res.json(mensagem);
  } catch (e) {
    next(e);
  }
})

export default router;
