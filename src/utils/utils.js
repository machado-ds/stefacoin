export const Validator = {
  validarParametros: (parametros) => {
    if (!parametros || !Array.isArray(parametros)) return null;

    const paramsInvalidos = parametros
      .filter((p) => {
        const attr = Object.keys(p)[0];
        return (
          p[attr] === null ||
          p[attr] === undefined ||
          (typeof p[attr] === 'number' && isNaN(p[attr])) ||
          (typeof p[attr] === 'string' && p[attr] === '') ||
          (Array.isArray(p[attr]) && !p[attr].length)
        );
      })
      .map((p) => Object.keys(p)[0]);

    if (paramsInvalidos.length) {
      throw new Error(`Parametros obrigatórios: ${paramsInvalidos.join(', ')}`);
    }
  },
};
