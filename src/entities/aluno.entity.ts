import Usuario from './usuario.entity';

export default class Aluno extends Usuario {
  idade: number;
  formacao: string;

  constructor() {
    super();
  }
}
