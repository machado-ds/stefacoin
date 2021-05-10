import Aula from '../../models/aula.model';
import BusinessException from '../exceptions/business.exception';

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

    validarIdCurso: () => {

    },

    validarTopicos: () => {
        
    }
};