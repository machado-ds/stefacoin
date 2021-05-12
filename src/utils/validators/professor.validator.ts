import Professor from '../../entities/professor.entity';
import Usuario from '../../entities/usuario.entity';
import BusinessException from '../exceptions/business.exception';
import { UsuarioValidator } from './usuario.validator';

export const ProfessorValidator = {
    validarNome: (nome: string) => {
        UsuarioValidator.validarNome(nome);
    },

    validarEmail: (emailInformado: string, usuarios: Usuario[]) => {
       UsuarioValidator.validarEmail(emailInformado, usuarios);
    },

    validarIdProfessor: (idProfessor: number, professores: Professor[]) => {
        let professorEncontrado: Professor = undefined;
        professores.forEach(professor => {
            if (professor.id === idProfessor) {
                professorEncontrado = professor;
            }
        })
        if (!professorEncontrado) {
            throw new BusinessException('O professor informado não existe.');
        } else {
            return true;
        }
    }
};