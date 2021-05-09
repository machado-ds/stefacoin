import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  /**
   * Esse método está retornando dados sensíveis do usuário e está retornando Alunos e Professores. Resolvi
   * o primeiro problema no método get da rota, criando e devolvendo uma nova lista de Professores, mas sem
   * o campo senha. Resolvi o segundo problema alterando a Table do ProfessorRepository para 'PROFESSOR'
  */
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    return await ProfessorRepository.listar(filtro);
  }

  // #pegabandeira
  // Ainda não consegui identificar esse #pegabandeira --- ATT: Talvez o peguinha seja o fato do tipo estar sendo setado no ProfessorRepository e por isso não há necessidade de setar aqui. Porém, não tenho certeza se é isso. Ainda preciso fazer as validações dos campos, então talvez seja isso também.
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    //O método incluir do ProfessorRepository já está setando o tipo do usuário.
    //professor.tipo = 1;

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ id }, { nome }, { email }, { senha }]);

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
