import Curso from '../../entities/curso.entity';
import Aula from '../../models/aula.model';
import BusinessException from '../exceptions/business.exception';
import { CursoValidator } from './curso.validator';

export const AulaValidator = {
    validarNome: (nome: string, aulas: Aula[]) => {
       aulas.forEach(aula => {
           if (aula.nome === nome) {
               throw new BusinessException('Já existe uma aula com esse nome no curso. Informe um nome único.');
           }
       })

       return true;
    },

    validarDuracao: () => {

    },

    validarIdCurso: (idDoCurso: number, listaDeCursos: Curso[]) => {
        return CursoValidator.validarIdDoCurso(idDoCurso, listaDeCursos);
    },

    validarTopicos: () => {
        
    },

    validarIdDaAula: (idDaAula: number, listaDeAulas: Aula[]) => {
        let aulaEncontrada = undefined;
        listaDeAulas.forEach(aula => {
            if (aula.id === idDaAula) {
                aulaEncontrada = aula;
                return;
            }
        })

        if (!aulaEncontrada) {
            throw new BusinessException(`Não existe uma aula com ID ${idDaAula} neste curso.`);
        } else {
            return true;
        }
    }
};