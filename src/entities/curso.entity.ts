import Aula from '../models/aula.model';
import Aluno from '../entities/aluno.entity';
import Entity from './entity';

export default class Curso extends Entity {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];
  alunosMatriculados?: Aluno[];
  avaliacao: number;

  constructor() {
    super();
  }
}
