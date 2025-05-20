import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatNumber, calculatePercentChange } from '../utils/formatUtils';
import { getPriceChangeColor } from '../utils/colorUtils';

const AssetMarket: React.FC = () => {
  const { state } = useSimulation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg text-white overflow-hidden">
      <div 
        className="p-3 bg-gray-800 flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="text-green-400" />
          <h3 className="font-medium">Asset Market</h3>
        </div>
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>
      
      {!isCollapsed && (
        <div className="p-3 overflow-hidden">
          <div className="grid grid-cols-1 gap-3">
            {state.assets.map((asset) => {
              const priceChange = calculatePercentChange(asset.currentPrice, asset.basePrice);
              const priceChangeColor = getPriceChangeColor(priceChange);
              const TrendIcon = priceChange >= 0 ? TrendingUp : TrendingDown;
              
              return (
                <div key={asset.id} className="border border-gray-700 rounded-md p-3 bg-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <div className="text-xs text-gray-400">{asset.symbol}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-bold">{formatCurrency(asset.currentPrice)}</div>
                      <div className={`text-xs flex items-center ${priceChangeColor}`}>
                        <TrendIcon size={12} className="mr-1" />
                        {(priceChange * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Supply:</span>
                      <span className="ml-1">{formatNumber(asset.supply)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Demand:</span>
                      <span className="ml-1">{formatNumber(asset.demand)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (asset.demand / asset.supply) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetMarket;