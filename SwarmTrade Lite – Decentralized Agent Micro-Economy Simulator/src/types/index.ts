export type AgentType = 'buyer' | 'seller' | 'arbitrageur';

export type AgentStrategy = 'aggressive' | 'conservative' | 'balanced' | 'random';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  strategy: AgentStrategy;
  capital: number;
  inventory: Record<string, number>;
  position: { x: number; y: number };
  color: string;
  tradeHistory: Trade[];
  profitLoss: number;
  riskTolerance: number;
  active: boolean;
}

export interface Trade {
  id: string;
  timestamp: number;
  sellerId: string;
  buyerId: string;
  asset: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  basePrice: number;
  volatility: number;
  supply: number;
  demand: number;
  currentPrice: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number;
  time: number;
  day: number;
  agents: Agent[];
  assets: Asset[];
  trades: Trade[];
  marketHealth: number;
  totalVolume: number;
}

export type SimulationSpeed = 1 | 2 | 5 | 10;