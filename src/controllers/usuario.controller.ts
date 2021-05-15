import Aluno from '../entities/aluno.entity';
import Professor from '../entities/professor.entity';
import Usuario from '../entities/usuario.entity';
import UsuarioRepository from '../repositories/usuario.repository';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { UsuarioValidator } from '../utils/validators/usuario.validator';
import AlunoController from './aluno.controller';
import ProfessorController from './professor.controller';

export default class UsuarioController {

    async checarEmailDisponivel(email: string) {
        if (email) {
            const listaDeUsuarios = await UsuarioRepository.listar();
            try {
                UsuarioValidator.validarEmail(email, listaDeUsuarios);
                return true;
            } catch (erro) {
                return false;
            }
        }

        throw new BusinessException('É necessário informar um endereço de email para verificar a sua disponibilidade.');
    }

    async incluir(usuario: Usuario) {
        if (usuario.tipo == 1) {
            return await new ProfessorController().incluir(usuario as Professor);
        }

        if (usuario.tipo == 2) {
            return await new AlunoController().incluir(usuario as Aluno);
        }

        throw new BusinessException('O tipo do usuário é inválido.');
    }
}