import Transacao from '../models/transacao.model';
import BlockchainService from '../services/blockchain.service';

export default class TransacaoController {
  async registrarTransacao(transacaoBody) {
    const { enderecoRemetente, enderecoDestinatario, valor } = transacaoBody;

    const transacao = new Transacao(
      enderecoRemetente,
      enderecoDestinatario,
      valor
    );

    BlockchainService.adicionarTransacao(transacao);
    return { mensagem: 'Transação registrada com sucesso!' };
  }
}
