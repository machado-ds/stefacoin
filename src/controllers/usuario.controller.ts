import UsuarioRepository from '../repositories/usuario.repository';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { UsuarioValidator } from '../utils/validators/usuario.validator';

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
}