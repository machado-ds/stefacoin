import Curso from '../entities/curso.entity';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { CursoValidator } from '../utils/validators/curso.validator';
import AulaController from '../controllers/aula.controller';
import ProfessorRepository from '../repositories/professor.repository';
import { AulaValidator } from '../utils/validators/aula.validator';
import BusinessException from '../utils/exceptions/business.exception';
import Aluno from '../entities/aluno.entity';

export default class CursoController {

  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(id, listaDeCursos);
    return await CursoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Curso> = {}): Promise<Curso> {
    return await CursoRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Curso> = {}): Promise<Curso[]> {
    return await CursoRepository.listar(filtro);
  }

  async incluir(curso: Curso) {
    let { nome, descricao, aulas, idProfessor } = curso;

    //Preciso validar se as aulas são um array e se o id do professor existe.
    Validador.validarParametros([{ nome }, { descricao }, { aulas }, { idProfessor }]);

    nome = nome.trim();
    descricao = descricao.trim();

    const listaDeProfessores = await ProfessorRepository.listar({tipo: {$eq: 1}});
    const listaDeCursos = await this.listar();

    CursoValidator.validarAulas(aulas);
    CursoValidator.validarIdProfessor(idProfessor, listaDeProfessores);
    CursoValidator.validarNome(nome, listaDeCursos);

    let novoCurso: Curso = {
      nome,
      descricao,
      aulas: [],
      idProfessor
    } as Curso 

    const id = await CursoRepository.incluir(novoCurso);

    for (let index = 0; index < aulas.length; index++) {
      const aula = aulas[index];
      aula.idCurso = id;
      await new AulaController().incluir(aula);
    }

    return new Mensagem('Curso incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, curso: Curso) {
    let { nome, descricao, aulas, idProfessor } = curso;
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(id, listaDeCursos);

    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    nome = nome.trim();
    descricao = descricao.trim();

    const listaDeProfessores = await ProfessorRepository.listar({tipo: {$eq: 1}});
    CursoValidator.validarIdProfessor(idProfessor, listaDeProfessores);

    const cursoBuscado = await this.obterPorId(id);

    if (nome != cursoBuscado.nome) {
      CursoValidator.validarNome(nome, listaDeCursos);
    }

    CursoValidator.validarAulas(aulas);

    

    let cursoAlterado: Curso = {
      nome,
      descricao,
      aulas,
      idProfessor
    } as Curso 

    await CursoRepository.alterar({ id }, cursoAlterado);

    return new Mensagem('Curso alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(id, listaDeCursos);

    const curso = await this.obterPorId(id);
 
    if (!curso.alunosMatriculados || !curso.alunosMatriculados.length) {
      await CursoRepository.excluir({ id });
    } else {
      throw new BusinessException('Não é possível excluir este curso. Há alunos matriculados.');
    }

    return new Mensagem('Curso excluido com sucesso!', {
      id,
    });
  }

  async matricular(id: number) {
    //Incluir o id do aluno no array de alunos matriculados no curso
    //Incluir o id do curso no array de cursos do aluno
    let curso = await this.obterPorId(id);
    curso.alunosMatriculados.push()

  }
}
