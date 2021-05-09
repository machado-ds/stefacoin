import ProfessorController from '../../controllers/professor.controller';
import Professor from '../../entities/professor.entity';
import BusinessException from '../exceptions/business.exception';

export const ProfessorValidator = {
    validarNome: (nome: string) => {
        if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(nome)) {
            throw new BusinessException('O campo nome está inválido. Insira apenas letras.');
        };
        return true;
    },

    validarEmail: (emailInformado: string, professores: Professor[]) => {
        if (!emailInformado.includes('@')) {
            throw new BusinessException('Email inválido. Insira um endereço de email no seguinte padrão: meuemail@provedor.com');
        } else if(professores.find(({email}) => email === emailInformado)) {
            throw new BusinessException('Já existe um professor com esse endereço de email.');
        }
        return true;
    }
};