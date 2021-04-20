import Transacao from './src/models/transacao.model';
import Blockchain from './src/services/blockchain.service';

let stefaCoin = Blockchain;
let enderecoDavide = 'endereco-davide';

stefaCoin.adicionarTransacao(
  new Transacao('endereco-joao', 'endereco-maria', 100)
);

stefaCoin.adicionarTransacao(
  new Transacao('endereco-maria', 'endereco-joao', 150)
);

stefaCoin.adicionarTransacao(
  new Transacao('endereco-joao', enderecoDavide, 150)
);

console.log('\nIniciando a mineração....');
stefaCoin.minerarTransacoesPendentes(enderecoDavide);
console.log(
  '\nRecompensa do Davide é: ',
  stefaCoin.obterRecompensaMinerador(enderecoDavide)
);

console.log('\nIniciando nova mineração....');
stefaCoin.minerarTransacoesPendentes(enderecoDavide);
console.log(
  '\nRecompensa do Davide é: ',
  stefaCoin.obterRecompensaMinerador(enderecoDavide)
);

console.log(stefaCoin.chain);
