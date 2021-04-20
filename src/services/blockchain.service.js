import Bloco from '../models/bloco.model';
import Transacao from '../models/transacao.model';

class Blockchain {
  constructor() {
    this.chain = [this.criarBlocoGenesis()];
    this.dificuldade = 5;
    this.transacoesPendentes = [];
    this.recompensaMinerador = 100;
  }

  criarBlocoGenesis() {
    return new Bloco('19/04/2021', 'Bloco Genesis', '0');
  }

  obterUltimoBloco() {
    return this.chain.pop();
  }

  adicionarTransacao(transacao) {
    this.transacoesPendentes.push(transacao);
  }

  minerarTransacoesPendentes(enderecoMinerador) {
    let novoBloco = new Bloco(Date.now(), this.transacoesPendentes);
    novoBloco.hashBlocoAnterior = this.obterUltimoBloco().hash;
    novoBloco.minerarBloco(this.dificuldade);
    console.log('Bloco minerado com sucesso!');
    this.chain.push(novoBloco);
    this.transacoesPendentes = [
      new Transacao(null, enderecoMinerador, this.recompensaMinerador),
    ];
  }

  obterRecompensaMinerador(endereco) {
    let recompensa = 0;

    for (const block of this.chain) {
      for (const transacao of block.transacoes) {
        if (transacao.enderecoRemetente === endereco) {
          recompensa -= transacao.valor;
        }

        if (transacao.enderecoDestinatario === endereco) {
          recompensa += transacao.valor;
        }
      }
    }

    return recompensa;
  }

  eBlockchainValido() {
    for (let i = 1; i < this.chain.length; i++) {
      const blocoAtual = this.chain[i];
      const blocoAnterior = this.chain[i - 1];

      if (
        blocoAtual.hash !== blocoAtual.calcularHash() ||
        blocoAtual.hashBlocoAnterior !== blocoAnterior.hash
      ) {
        return false;
      }
    }

    return true;
  }
}

export default new Blockchain();
