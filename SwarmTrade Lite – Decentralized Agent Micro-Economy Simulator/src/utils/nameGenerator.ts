const adjectives = [
  'Swift', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Quantum', 'Crypto', 'Digital',
  'Neural', 'Quantum', 'Cyber', 'Virtual', 'Rapid', 'Smart', 'Hyper', 'Meta',
  'Omni', 'Ultra', 'Prime', 'Mega', 'Poly', 'Sync', 'Dyna', 'Flux', 'Nova'
];

const nouns = [
  'Trader', 'Bot', 'Agent', 'Broker', 'Dealer', 'Miner', 'Networker', 'Solver',
  'Runner', 'Market', 'Exchange', 'Protocol', 'Analyzer', 'Arbitrageur', 'Node',
  'Validator', 'Index', 'Oracle', 'Wallet', 'Ledger', 'Chain', 'Block', 'Hash'
];

export const generateRandomName = (): string => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
};