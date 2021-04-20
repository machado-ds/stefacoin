import SHA256 from 'crypto-js/sha256';

export default class Bloco {
  constructor(timestamp, transacoes, hashBlocoAnterior = '') {
    this.timestamp = timestamp;
    this.transacoes = transacoes;
    this.hashBlocoAnterior = hashBlocoAnterior;
    this.hash = this.calcularHash();
    this.contador = 0;
  }

  calcularHash() {
    return SHA256(
      this.index +
        this.hashBlocoAnterior +
        this.timestamp +
        JSON.stringify(this.transacoes) +
        this.contador
    ).toString();
  }

  minerarBloco(dificuldade) {
    while (
      this.hash.substring(0, dificuldade) !== Array(dificuldade + 1).join('0')
    ) {
      this.contador++;
      this.hash = this.calcularHash();
    }

    console.log('Bloco minerado: ', this.hash);
  }
}
