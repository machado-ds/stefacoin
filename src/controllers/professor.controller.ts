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
  /*
   * Esse método está retornando dados sensíveis do usuário e está retornando Alunos e Professores. Resolvi
   * o primeiro problema no método get da rota, criando e devolvendo uma nova lista de Professores, mas sem
   * o campo senha. Resolvi o segundo problema alterando a Table do ProfessorRepository para 'PROFESSOR'
  */
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    return await ProfessorRepository.listar(filtro);
  }

  // #pegabandeira
  // Ainda não consegui identificar esse #pegabandeira --- ATT: Talvez o peguinha seja o fato do tipo estar sendo setado no ProfessorRepository e por isso não há necessidade de setar aqui. Porém, não tenho certeza se é isso. Ainda preciso fazer as validações dos campos, então talvez seja isso também. --- ATT2: Descobri que é possível inserir dados que não estão presentes na entidade Professor. Exemplo, na requisição eu posso passar um telefone apesar de o atributo telefone não existir na entidade Professor. Acredito que esse seja o verdadeiro #pegabandeira
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
    let { nome, email, senha } = professor;
    let campos = ["nome", "email", "senha"];
    Validador.validarParametros([{ id }, { nome }, { senha }]);
    nome = nome.trim();
    senha = senha.trim();

    const professorBuscado = await this.obterPorId(id);
    const listaDeProfessores = await this.listar();
    ProfessorValidator.validarNome(nome);
    ProfessorValidator.validarIdProfessor(id, listaDeProfessores);

    let professorAlterado: Professor = {
      nome,
      email,
      senha
    } as Professor 

    for (let i = 0; i < campos.length; i++) {
      const prop = campos[i];
      if (professor[prop] !== undefined) {
        if (prop == 'email') {
          throw new BusinessException('O email não pode ser alterado.');
        }
        professorAlterado[prop] = professor[prop];
      } else {
        professorAlterado[prop] = professorBuscado[prop];
      }
    }

    await ProfessorRepository.alterar({ id }, professorAlterado);

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
