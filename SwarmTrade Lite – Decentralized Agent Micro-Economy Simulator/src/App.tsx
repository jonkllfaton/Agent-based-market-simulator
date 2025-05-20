import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import SimulationControls from './components/SimulationControls';
import SimulationVisualization from './components/SimulationVisualization';
import AgentList from './components/AgentList';
import AssetMarket from './components/AssetMarket';
import TradeHistory from './components/TradeHistory';
import MarketStatistics from './components/MarketStatistics';

function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
              SwarmTrade Lite
            </h1>
            <p className="text-gray-400 text-sm">
              A Decentralized Agent Micro-Economy Simulator
            </p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <SimulationControls />
              <SimulationVisualization />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MarketStatistics />
                <AssetMarket />
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              <AgentList />
              <TradeHistory />
            </div>
          </div>
        </main>
        
        <footer className="border-t border-gray-800 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>SwarmTrade Lite &copy; 2025</p>
            <p className="text-xs mt-1">
              A simulation of decentralized agent-based market dynamics
            </p>
          </div>
        </footer>
      </div>
    </SimulationProvider>
  );
}

export default App;