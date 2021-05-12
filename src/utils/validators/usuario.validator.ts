import Professor from '../../entities/professor.entity';
import Usuario from '../../entities/usuario.entity';
import BusinessException from '../exceptions/business.exception';

export const UsuarioValidator = {
    validarNome: (nome: string) => {
        if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(nome)) {
            throw new BusinessException('O campo nome está inválido. Insira apenas letras.');
        };
        return true;
    },

    validarEmail: (emailInformado: string, usuarios: Usuario[]) => {
        if (!emailInformado.includes('@')) {
            throw new BusinessException('Email inválido. Insira um endereço de email no seguinte padrão: meuemail@provedor.com');
        } else if(usuarios.find(({email}) => email === emailInformado)) {
            throw new BusinessException('Já existe um usuário com esse endereço de email.');
        }
        return true;
    },

    validarIdUsuario: (idUsuario: number, usuarios: Usuario[]) => {
        let usuarioEncontrado: Professor = undefined;
        usuarios.forEach(usuario => {
            if (usuario.id === idUsuario) {
                usuarioEncontrado = usuario;
            }
        })
        if (!usuarioEncontrado) {
            throw new BusinessException('O usuário informado não existe.');
        } else {
            return true;
        }
    }
};