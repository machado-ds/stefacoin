import Professor from '../entities/professor.entity';
import Usuario from '../entities/usuario.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { ProfessorValidator } from '../utils/validators/professor.validator';
import UsuarioRepository from '../repositories/usuario.repository';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    return await ProfessorRepository.listar(filtro);
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    let { nome, email, senha } = professor;
    
    Validador.validarParametros([{ nome }, { email }, { senha }]);

    nome = nome.trim();
    email = email.trim();
    senha = senha.trim();

    ProfessorValidator.validarNome(nome);
    const usuarios: Usuario[] = await UsuarioRepository.listar();
    ProfessorValidator.validarEmail(email, usuarios);

    //O método incluir do ProfessorRepository já está setando o tipo do usuário.
    //professor.tipo = 1;

    let novoProfessor: Professor = {
      nome,
      email,
      senha,
      cursos: []
    } as Professor 

    const id = await ProfessorRepository.incluir(novoProfessor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) {
    let { nome, email, senha, cursos } = professor;
    Validador.validarParametros([{ id }, { nome }, { senha }]);
    nome = nome.trim();
    senha = senha.trim();

    const professorBuscado = await this.obterPorId(id);
    const listaDeProfessores = await this.listar();
    ProfessorValidator.validarNome(nome);
    ProfessorValidator.validarIdProfessor(id, listaDeProfessores);

    professorBuscado.nome = nome;

    if (professorBuscado.senha === senha) {
      professorBuscado.senha = undefined;
    } else {
      professorBuscado.senha = senha;
    }

    if (email && email !== professorBuscado.email) {
      throw new BusinessException('O email não pode ser alterado.');
    }

    if (cursos) {
      professorBuscado.cursos = cursos;
    }
    
    await ProfessorRepository.alterar({ id }, professorBuscado);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    const professorBuscado = await this.obterPorId(id);

    if (professorBuscado.cursos && professorBuscado.cursos.length) {
      throw new BusinessException('Não é possível excluir um professor que esteja vinculado a um curso.');
    }

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
