import Aula from '../models/aula.model';
import Avaliacao from '../models/avaliacao.model';
import Entity from './entity';


export default class Curso extends Entity {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];
  alunosMatriculados?: number[];
  avaliacao?: Avaliacao[];

  constructor() {
    super();
  }

  getMediaAvaliacao() {
    let somaDasNotas = 0;
    this.avaliacao.forEach(avaliacao => somaDasNotas += avaliacao.nota);
    return somaDasNotas / this.avaliacao.length;
  }
}
