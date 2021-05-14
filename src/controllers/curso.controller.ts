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
import AlunoController from './aluno.controller';
import alunoRepository from '../repositories/aluno.repository';
import usuarioRepository from '../repositories/usuario.repository';
import { AlunoValidator } from '../utils/validators/aluno.validator';
import Avaliacao from '../models/avaliacao.model';

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
      idProfessor,
      alunosMatriculados: [],
      avaliacao: [],
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
    let { nome, descricao, aulas, idProfessor, alunosMatriculados, avaliacao } = curso;

    Validador.validarParametros([{ id }, { nome }, { descricao }, { aulas }, { idProfessor }]);
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(id, listaDeCursos);

    nome = nome.trim();
    descricao = descricao.trim();

    const listaDeProfessores = await ProfessorRepository.listar({tipo: {$eq: 1}});
    CursoValidator.validarIdProfessor(idProfessor, listaDeProfessores);

    const cursoBuscado = await this.obterPorId(id);

    if (nome != cursoBuscado.nome) {
      CursoValidator.validarNome(nome, listaDeCursos);
    }
    
    cursoBuscado.nome = nome;
    cursoBuscado.descricao = descricao;
    cursoBuscado.aulas = aulas;
    cursoBuscado.idProfessor = idProfessor;

    if (alunosMatriculados) {
      cursoBuscado.alunosMatriculados = alunosMatriculados;
    }

    if (avaliacao) {
      cursoBuscado.avaliacao = avaliacao;
    }

    await CursoRepository.alterar({ id }, cursoBuscado);

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

  async matricular(cursoId: number, alunoId: number) {
    //Incluir o id do aluno no array de alunos matriculados no curso
    //Incluir o id do curso no array de cursos do aluno
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(cursoId, listaDeCursos);
    const listaDeAlunos = await new AlunoController().listar();
    AlunoValidator.validarIdAluno(alunoId, listaDeAlunos);

    let curso = await CursoRepository.obterPorId(cursoId);
    console.log(curso);
    
    let aluno = await alunoRepository.obterPorId(alunoId);
    console.log(aluno);
    

    curso.alunosMatriculados.push(alunoId);
    const mensagemCurso: Mensagem = await this.alterar(cursoId, curso);
    console.log(mensagemCurso);
    
    aluno.cursos.push(cursoId);
    const mensagemAluno: Mensagem = await new AlunoController().alterar(alunoId, aluno);
    console.log(mensagemAluno);

    return new Mensagem('Matrícula efetivada com sucesso.', {
      cursoId,
      alunoId
    });
  }

  async cancelarMatricula(cursoId: number, alunoId: number) {
    //Incluir o id do aluno no array de alunos matriculados no curso
    //Incluir o id do curso no array de cursos do aluno
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(cursoId, listaDeCursos);
    const listaDeAlunos = await new AlunoController().listar();
    AlunoValidator.validarIdAluno(alunoId, listaDeAlunos);

    let curso = await CursoRepository.obterPorId(cursoId);
    console.log(curso);
    
    let aluno = await alunoRepository.obterPorId(alunoId);
    console.log(aluno);
    

    curso.alunosMatriculados = curso.alunosMatriculados.filter(id => id !== alunoId);
    const mensagemCurso: Mensagem = await this.alterar(cursoId, curso);
    console.log(mensagemCurso);
    
    aluno.cursos = aluno.cursos.filter(id => id !== cursoId);
    const mensagemAluno: Mensagem = await new AlunoController().alterar(alunoId, aluno);
    console.log(mensagemAluno);

    return new Mensagem('Matrícula cancelada com sucesso.', {
      cursoId,
      alunoId
    });
  }

  async avaliar(cursoId: number, avaliacao: Avaliacao) {
    //Incluir o id do aluno no array de alunos matriculados no curso
    //Incluir o id do curso no array de cursos do aluno
    const listaDeCursos = await this.listar();
    CursoValidator.validarIdDoCurso(cursoId, listaDeCursos);
    const listaDeAlunos = await new AlunoController().listar();
    AlunoValidator.validarIdAluno(avaliacao.alunoId, listaDeAlunos);

    let curso = await CursoRepository.obterPorId(cursoId);
    console.log(curso);

    let cursoAvaliadoPorAluno: boolean = false;

    if (curso.avaliacao.length) {
      for (let i = 0; i < curso.avaliacao.length; i++) {
        if (curso.avaliacao[i].alunoId == avaliacao.alunoId) {
          curso.avaliacao[i].nota = avaliacao.nota;
          cursoAvaliadoPorAluno = true;
        }
      }
    }
  
    if (!cursoAvaliadoPorAluno) {
      curso.avaliacao.push(avaliacao);
    }
    
    const mensagemCurso: Mensagem = await this.alterar(cursoId, curso);
    console.log(mensagemCurso);
  

    return new Mensagem('Avaliação registrada com sucesso.', {
      cursoId,
      avaliacao
    });
  }

  
}
