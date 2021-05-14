import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { AlunoValidator } from '../utils/validators/aluno.validator';
import UsuarioRepository from '../repositories/usuario.repository';
import BusinessException from '../utils/exceptions/business.exception';


export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  //Assim como no caso do professor, esse método tá devolvendo uma lista de usuários, com profs e alunos, além de devolver a senha de cada um deles.
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> {
    return await AlunoRepository.listar(filtro);
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    let { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);

    nome = nome.trim();
    formacao = formacao.trim();
    email = email.trim();
    senha = senha.trim();

    AlunoValidator.validarNome(nome);

    const listaDeUsuarios = await UsuarioRepository.listar();
    AlunoValidator.validarEmail(email, listaDeUsuarios);

    const novoAluno = {
      nome,
      senha,
      email,
      formacao,
      idade,
      cursos: []
    } as Aluno

    const id = await AlunoRepository.incluir(novoAluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, aluno: Aluno) {
    let { nome, email, senha, idade, formacao, cursos } = aluno;
    Validador.validarParametros([{ id }, { nome }, { senha }]);

    nome = nome.trim();
    senha = senha.trim();
    
    const listaDeAlunos = await AlunoRepository.listar();
    AlunoValidator.validarIdAluno(id, listaDeAlunos);
    AlunoValidator.validarNome(nome);

    const alunoBuscado = await this.obterPorId(id);
    
    alunoBuscado.nome = nome;
    alunoBuscado.senha = senha;

    if (email && email !== alunoBuscado.email) {
      throw new BusinessException('O email não pode ser alterado.');
    }

    if (idade) {
      alunoBuscado.idade = idade;
    }

    if (formacao) {
      alunoBuscado.formacao = formacao;
    }

    if (cursos) {
      alunoBuscado.cursos = cursos;
    }

    await AlunoRepository.alterar({ id }, alunoBuscado);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);
    const listaDeAlunos = await this.listar();
    AlunoValidator.validarIdAluno(id, listaDeAlunos);

    const alunoBuscado = await this.obterPorId(id);

    if (alunoBuscado.cursos.length) {
      throw new BusinessException('Não foi possível excluir pois o aluno se encontra matriculado em pelo menos um curso.');
    }

    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
