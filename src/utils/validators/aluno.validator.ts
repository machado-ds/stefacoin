import Aluno from '../../entities/professor.entity';
import Usuario from '../../entities/usuario.entity';
import BusinessException from '../exceptions/business.exception';
import { UsuarioValidator } from './usuario.validator';

export const AlunoValidator = {
    validarNome: (nome: string) => {
        UsuarioValidator.validarNome(nome);
    },

    validarEmail: (emailInformado: string, usuarios: Usuario[]) => {
       UsuarioValidator.validarEmail(emailInformado, usuarios);
    },

    validarIdAluno: (idAluno: number, alunos: Aluno[]) => {
        let alunoEncontrado: Aluno = undefined;
        alunos.forEach(aluno => {
            if (aluno.id === idAluno) {
                alunoEncontrado = aluno;
                return;
            }
        })
        if (!alunoEncontrado) {
            throw new BusinessException('O aluno informado não existe.');
        } else {
            return true;
        }
    }
};