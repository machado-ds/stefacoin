import Curso from '../../entities/curso.entity';
import Professor from '../../entities/professor.entity';
import Aula from '../../models/aula.model';
import BusinessException from '../exceptions/business.exception';
import { Validador } from '../utils';
import { ProfessorValidator } from './professor.validator';


export const CursoValidator = {
    validarAulas: (aulas: Aula[]) => {
        if (!(aulas instanceof Array)) {
            throw new BusinessException('Aulas inválidas. É necessário informar uma lista de aulas.');
        }

        if (!aulas.length) {
            throw new BusinessException('Aulas inválidas. É necessário incluir pelo menos uma aula no curso.');
        }
        
        aulas.forEach(aula => {
            Validador.validarParametros([{ nome: aula.nome }, { duracao: aula.duracao }, { topicos: aula.topicos }]);
        })

        return true;
    },

    validarIdProfessor: (idProfessor: number, listaDeProfessores: Professor[]) => {
        ProfessorValidator.validarIdProfessor(idProfessor, listaDeProfessores);
    },

    validarNome: (nomeDoCurso: string, cursos: Curso[]) => {
        cursos.forEach(curso => {
            if (curso.nome === nomeDoCurso) {
                throw new BusinessException('Já existe um curso com esse nome.');
            }
        })
        return true;
    }
};