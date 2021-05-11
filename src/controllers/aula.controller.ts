import Aula from '../models/aula.model';
import CursoRepository from '../repositories/curso.repository';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import { AulaValidator } from '../utils/validators/aula.validator';
import { CursoValidator } from '../utils/validators/curso.validator';

export default class AulaController {
  async obterPorId(id: number, idCurso: number): Promise<Aula> {
    Validador.validarParametros([{ id }, { idCurso }]);

    const listaDeCursos = await CursoRepository.listar();
    AulaValidator.validarIdCurso(idCurso, listaDeCursos);

    const listaDeAulas = await this.listar(idCurso);
    AulaValidator.validarIdDaAula(id, listaDeAulas);

    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas.find((a) => a.id === id);
  }

  async listar(idCurso: number): Promise<Aula[]> {
    Validador.validarParametros([{ idCurso }]);
    const listaDeCursos = await CursoRepository.listar();
    AulaValidator.validarIdCurso(idCurso, listaDeCursos);
    const curso = await CursoRepository.obterPorId(idCurso);
    return curso.aulas;
  }

  async incluir(aula: Aula) {
    let { nome, duracao, topicos, idCurso } = aula;

    //Checar se o nome já existe, se os tópicos estão em forma de lista e se o id do curso existe.
    Validador.validarParametros([{ nome }, { duracao }, { topicos }, { idCurso }]);

    nome = nome.trim();
    topicos = topicos.map(topico => topico.trim());

    const curso = await CursoRepository.obterPorId(idCurso);

    if (curso.aulas.length) {
      AulaValidator.validarNome(nome, curso.aulas);
      const idAnterior = curso.aulas[curso.aulas.length - 1].id;
      aula.id = idAnterior + 1;
      curso.aulas.push(aula);
    } else {
      aula.id = 1;
      curso.aulas.push(aula);
    }

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula incluida com sucesso!', {
      id: aula.id,
      idCurso,
    });
  }

  async alterar(id: number, aula: Aula) {
    let { nome, duracao, topicos, idCurso } = aula;
    Validador.validarParametros([{ id }, { idCurso }, { nome }, { duracao }, { topicos }]);

    nome = nome.trim();

    const listaDeCursos = await CursoRepository.listar();
    CursoValidator.validarIdDoCurso(idCurso, listaDeCursos);

    const curso = await CursoRepository.obterPorId(idCurso);
    AulaValidator.validarIdDaAula(id, curso.aulas);

    curso.aulas.map((a) => {
      if (a.id === id) {
        Object.keys(aula).forEach((k) => {
          a[k] = aula[k];
        });
      }
    });

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula alterada com sucesso!', {
      id,
      idCurso,
    });
  }

  async excluir(id: number, idCurso: number) {
    Validador.validarParametros([{ id }, { idCurso }]);

    const listaDeCursos = await CursoRepository.listar();
    AulaValidator.validarIdCurso(idCurso, listaDeCursos);

    const listaDeAulas = await this.listar(idCurso);
    AulaValidator.validarIdDaAula(id, listaDeAulas);

    const curso = await CursoRepository.obterPorId(idCurso);

    curso.aulas = curso.aulas.filter((a) => a.id !== id);

    await CursoRepository.alterar({ id: idCurso }, curso);

    return new Mensagem('Aula excluida com sucesso!');
  }
}
