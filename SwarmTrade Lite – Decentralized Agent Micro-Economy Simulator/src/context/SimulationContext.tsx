import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { 
  SimulationState, 
  Agent, 
  Asset, 
  Trade, 
  AgentType, 
  AgentStrategy,
  SimulationSpeed
} from '../types';
import { generateRandomName } from '../utils/nameGenerator';
import { getRandomColor } from '../utils/colorUtils';

// Initial asset data
const initialAssets: Asset[] = [
  { 
    id: 'asset-1', 
    name: 'Digital Token', 
    symbol: 'DTK', 
    basePrice: 100, 
    volatility: 0.05, 
    supply: 10000, 
    demand: 8000, 
    currentPrice: 100 
  },
  { 
    id: 'asset-2', 
    name: 'Virtual Coin', 
    symbol: 'VCN', 
    basePrice: 50, 
    volatility: 0.08, 
    supply: 20000, 
    demand: 15000, 
    currentPrice: 50 
  },
  { 
    id: 'asset-3', 
    name: 'Meta Share', 
    symbol: 'MSH', 
    basePrice: 200, 
    volatility: 0.03, 
    supply: 5000, 
    demand: 6000, 
    currentPrice: 200 
  }
];

// Create initial simulation state
const createInitialState = (): SimulationState => {
  return {
    isRunning: false,
    speed: 1,
    time: 0,
    day: 1,
    agents: [],
    assets: initialAssets,
    trades: [],
    marketHealth: 0.5,
    totalVolume: 0
  };
};

type SimulationAction =
  | { type: 'START_SIMULATION' }
  | { type: 'PAUSE_SIMULATION' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'SET_SPEED'; payload: SimulationSpeed }
  | { type: 'ADD_AGENT'; payload: Partial<Agent> }
  | { type: 'REMOVE_AGENT'; payload: string }
  | { type: 'TOGGLE_AGENT'; payload: string }
  | { type: 'UPDATE_AGENT'; payload: Partial<Agent> & { id: string } }
  | { type: 'UPDATE_ASSET'; payload: Partial<Asset> & { id: string } }
  | { type: 'ADD_TRADE'; payload: Omit<Trade, 'id' | 'timestamp'> }
  | { type: 'TICK' }
  | { type: 'UPDATE_MARKET' };

const simulationReducer = (state: SimulationState, action: SimulationAction): SimulationState => {
  switch (action.type) {
    case 'START_SIMULATION':
      return { ...state, isRunning: true };
    case 'PAUSE_SIMULATION':
      return { ...state, isRunning: false };
    case 'RESET_SIMULATION':
      return createInitialState();
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'ADD_AGENT': {
      const newAgent: Agent = {
        id: nanoid(),
        name: generateRandomName(),
        type: 'buyer',
        strategy: 'balanced',
        capital: 1000,
        inventory: {},
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        color: getRandomColor(),
        tradeHistory: [],
        profitLoss: 0,
        riskTolerance: Math.random(),
        active: true,
        ...action.payload
      };
      return { ...state, agents: [...state.agents, newAgent] };
    }
    case 'REMOVE_AGENT':
      return { ...state, agents: state.agents.filter(agent => agent.id !== action.payload) };
    case 'TOGGLE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent => 
          agent.id === action.payload ? { ...agent, active: !agent.active } : agent
        )
      };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent => 
          agent.id === action.payload.id ? { ...agent, ...action.payload } : agent
        )
      };
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map(asset => 
          asset.id === action.payload.id ? { ...asset, ...action.payload } : asset
        )
      };
    case 'ADD_TRADE': {
      const newTrade: Trade = {
        id: nanoid(),
        timestamp: Date.now(),
        ...action.payload
      };
      
      // Update agents' capitals, inventories and trade histories
      const updatedAgents = state.agents.map(agent => {
        if (agent.id === newTrade.sellerId) {
          const updatedInventory = { ...agent.inventory };
          updatedInventory[newTrade.asset] = (updatedInventory[newTrade.asset] || 0) - newTrade.quantity;
          
          return {
            ...agent,
            capital: agent.capital + newTrade.total,
            inventory: updatedInventory,
            tradeHistory: [...agent.tradeHistory, newTrade],
            profitLoss: agent.profitLoss + newTrade.total * 0.05 // Simple profit calculation
          };
        }
        
        if (agent.id === newTrade.buyerId) {
          const updatedInventory = { ...agent.inventory };
          updatedInventory[newTrade.asset] = (updatedInventory[newTrade.asset] || 0) + newTrade.quantity;
          
          return {
            ...agent,
            capital: agent.capital - newTrade.total,
            inventory: updatedInventory,
            tradeHistory: [...agent.tradeHistory, newTrade],
            profitLoss: agent.profitLoss - newTrade.total * 0.05 // Simple loss calculation
          };
        }
        
        return agent;
      });
      
      return {
        ...state,
        agents: updatedAgents,
        trades: [...state.trades, newTrade],
        totalVolume: state.totalVolume + newTrade.total
      };
    }
    case 'TICK': {
      // Update time and day
      const newTime = state.time + 1;
      const newDay = newTime % 24 === 0 ? state.day + 1 : state.day;
      
      // Update agent positions
      const updatedAgents = state.agents.map(agent => {
        if (!agent.active) return agent;
        
        // Simple random movement
        const newPosition = {
          x: Math.max(0, Math.min(100, agent.position.x + (Math.random() - 0.5) * 5)),
          y: Math.max(0, Math.min(100, agent.position.y + (Math.random() - 0.5) * 5))
        };
        
        return { ...agent, position: newPosition };
      });
      
      return {
        ...state,
        time: newTime,
        day: newDay,
        agents: updatedAgents
      };
    }
    case 'UPDATE_MARKET': {
      // Update asset prices based on market conditions
      const updatedAssets = state.assets.map(asset => {
        const priceChange = (Math.random() - 0.5) * asset.volatility * asset.basePrice;
        const newPrice = Math.max(asset.currentPrice + priceChange, 0.01);
        
        return {
          ...asset,
          currentPrice: Number(newPrice.toFixed(2)),
          demand: Math.max(0, asset.demand + Math.floor((Math.random() - 0.5) * 100)),
          supply: Math.max(0, asset.supply + Math.floor((Math.random() - 0.5) * 50))
        };
      });
      
      // Calculate new market health based on recent trades and price movements
      const newMarketHealth = Math.max(0, Math.min(1, state.marketHealth + (Math.random() - 0.5) * 0.1));
      
      return {
        ...state,
        assets: updatedAssets,
        marketHealth: newMarketHealth
      };
    }
    default:
      return state;
  }
};

interface SimulationContextType {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
  addRandomAgent: (type?: AgentType, strategy?: AgentStrategy) => void;
  generateRandomTrade: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, createInitialState());
  const [simulationInterval, setSimulationInterval] = useState<number | null>(null);

  // Add a random agent with specified type and strategy
  const addRandomAgent = (type?: AgentType, strategy?: AgentStrategy) => {
    const agentType = type || (['buyer', 'seller', 'arbitrageur'] as AgentType[])[Math.floor(Math.random() * 3)];
    const agentStrategy = strategy || (['aggressive', 'conservative', 'balanced', 'random'] as AgentStrategy[])[Math.floor(Math.random() * 4)];
    
    const newAgent: Partial<Agent> = {
      type: agentType,
      strategy: agentStrategy,
      capital: 1000 + Math.floor(Math.random() * 9000),
      position: { 
        x: Math.random() * 100, 
        y: Math.random() * 100 
      },
      riskTolerance: Math.random(),
      inventory: {}
    };
    
    // Initialize inventory for sellers
    if (agentType === 'seller' || agentType === 'arbitrageur') {
      const inventoryAsset = state.assets[Math.floor(Math.random() * state.assets.length)];
      newAgent.inventory = {
        [inventoryAsset.id]: Math.floor(Math.random() * 100) + 10
      };
    }
    
    dispatch({ type: 'ADD_AGENT', payload: newAgent });
  };

  // Generate a random trade between agents
  const generateRandomTrade = () => {
    const activeBuyers = state.agents.filter(agent => agent.active && (agent.type === 'buyer' || agent.type === 'arbitrageur') && agent.capital > 0);
    const activeSellers = state.agents.filter(agent => agent.active && (agent.type === 'seller' || agent.type === 'arbitrageur'));
    
    if (activeBuyers.length === 0 || activeSellers.length === 0) {
      return;
    }
    
    const buyer = activeBuyers[Math.floor(Math.random() * activeBuyers.length)];
    const seller = activeSellers[Math.floor(Math.random() * activeSellers.length)];
    
    // Don't allow self-trading
    if (buyer.id === seller.id) {
      return;
    }
    
    // Find an asset that the seller has in inventory
    const sellerAssets = Object.entries(seller.inventory)
      .filter(([_, quantity]) => quantity > 0)
      .map(([assetId]) => assetId);
    
    if (sellerAssets.length === 0) {
      return;
    }
    
    const assetId = sellerAssets[Math.floor(Math.random() * sellerAssets.length)];
    const asset = state.assets.find(a => a.id === assetId);
    
    if (!asset) {
      return;
    }
    
    // Calculate max quantity based on seller inventory and buyer capital
    const maxQuantityFromInventory = seller.inventory[assetId] || 0;
    const maxQuantityFromCapital = Math.floor(buyer.capital / asset.currentPrice);
    const maxQuantity = Math.min(maxQuantityFromInventory, maxQuantityFromCapital);
    
    if (maxQuantity <= 0) {
      return;
    }
    
    // Determine trade quantity and total
    const quantity = Math.max(1, Math.floor(Math.random() * maxQuantity));
    const price = asset.currentPrice * (0.95 + Math.random() * 0.1); // Random price around current price
    const total = Number((price * quantity).toFixed(2));
    
    dispatch({
      type: 'ADD_TRADE',
      payload: {
        sellerId: seller.id,
        buyerId: buyer.id,
        asset: assetId,
        quantity,
        price: Number(price.toFixed(2)),
        total
      }
    });
  };

  // Start/stop simulation based on isRunning state
  useEffect(() => {
    if (state.isRunning) {
      // Clear existing interval if any
      if (simulationInterval !== null) {
        clearInterval(simulationInterval);
      }
      
      // Set new interval based on simulation speed
      const intervalTime = 1000 / state.speed;
      const interval = window.setInterval(() => {
        dispatch({ type: 'TICK' });
        
        // Occasionally update market and generate trades
        if (Math.random() < 0.3) {
          dispatch({ type: 'UPDATE_MARKET' });
        }
        
        if (state.agents.length >= 2 && Math.random() < 0.5) {
          generateRandomTrade();
        }
      }, intervalTime);
      
      setSimulationInterval(interval);
    } else if (simulationInterval !== null) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    
    // Cleanup on unmount
    return () => {
      if (simulationInterval !== null) {
        clearInterval(simulationInterval);
      }
    };
  }, [state.isRunning, state.speed, state.agents.length]);

  // Initialize simulation with some agents
  useEffect(() => {
    // Add initial agents
    for (let i = 0; i < 5; i++) {
      addRandomAgent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SimulationContext.Provider value={{ state, dispatch, addRandomAgent, generateRandomTrade }}>
      {children}
    </SimulationContext.Provider>
  );
};