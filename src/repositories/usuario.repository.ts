import Usuario from '../entities/usuario.entity';
import { Tables } from '../utils/tables.enum';
import Repository from './repository';

class UsuarioRepository extends Repository<Usuario> {
  constructor() {
    super(Tables.USUARIO);
  }

  async obterIdPeloEmail(email: string) {
    const usuario: Usuario = await this.obter({email: {$eq: email}});
    return usuario.id;
  }
}

export default new UsuarioRepository();
