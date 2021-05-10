import Curso from '../entities/curso.entity';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { CursoValidator } from '../utils/validators/curso.validator';
import AulaController from '../controllers/aula.controller';
import ProfessorRepository from '../repositories/professor.repository';

export default class CursoController {
  async obterPorId(id: number): Promise<Curso> {
    Validador.validarParametros([{ id }]);
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

    const listaDeProfessores = await ProfessorRepository.listar();
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
      
      const mensagem = await new AulaController().incluir(aula);

    }

    return new Mensagem('Curso incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, curso: Curso) {
    const { nome, descricao, aulas, idProfessor } = curso;
    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);

    await CursoRepository.alterar({ id }, curso);

    return new Mensagem('Aula alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await CursoRepository.excluir({ id });

    return new Mensagem('Aula excluido com sucesso!', {
      id,
    });
  }
}
