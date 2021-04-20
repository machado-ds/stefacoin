export default class Transacao {
  constructor(enderecoRemetente, enderecoDestinatario, valor) {
    this.enderecoRemetente = enderecoRemetente;
    this.enderecoDestinatario = enderecoDestinatario;
    this.valor = valor;
  }
}
