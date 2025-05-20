import React, { useRef, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { getAgentTypeColor } from '../utils/colorUtils';

const SimulationVisualization: React.FC = () => {
  const { state } = useSimulation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Keep track of recent trades for animation
  const recentTradesRef = useRef<Array<{
    sellerId: string;
    buyerId: string;
    time: number;
    linePos: number;
  }>>([]);
  
  useEffect(() => {
    // Add new trade to recent trades list
    if (state.trades.length > 0) {
      const latestTrade = state.trades[state.trades.length - 1];
      recentTradesRef.current.push({
        sellerId: latestTrade.sellerId,
        buyerId: latestTrade.buyerId,
        time: Date.now(),
        linePos: 0
      });
      
      // Limit the number of recent trades we animate
      if (recentTradesRef.current.length > 10) {
        recentTradesRef.current.shift();
      }
    }
  }, [state.trades.length]);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to fit container
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === container) {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
        }
      }
    });
    
    resizeObserver.observe(container);
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      ctx.strokeStyle = 'rgba(66, 66, 77, 0.2)';
      ctx.lineWidth = 1;
      
      // Draw grid
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Map agent positions to canvas
      const agents = state.agents.filter(a => a.active);
      const positionMap = new Map();
      
      agents.forEach(agent => {
        const x = (agent.position.x / 100) * canvas.width;
        const y = (agent.position.y / 100) * canvas.height;
        positionMap.set(agent.id, { x, y });
      });
      
      // Draw trade links
      const currentTime = Date.now();
      recentTradesRef.current = recentTradesRef.current.filter(trade => {
        // Only show trades for 3 seconds
        if (currentTime - trade.time > 3000) return false;
        
        const sellerPos = positionMap.get(trade.sellerId);
        const buyerPos = positionMap.get(trade.buyerId);
        
        // Skip if either agent is not active or has been removed
        if (!sellerPos || !buyerPos) return false;
        
        // Calculate line position for animation (0 to 1)
        trade.linePos = Math.min(1, (currentTime - trade.time) / 1000);
        
        // Draw the animated line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.7)'; // Purple
        ctx.lineWidth = 2;
        
        // Animated line
        const startX = sellerPos.x;
        const startY = sellerPos.y;
        const endX = buyerPos.x;
        const endY = buyerPos.y;
        
        const currentX = startX + (endX - startX) * trade.linePos;
        const currentY = startY + (endY - startY) * trade.linePos;
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // Particle effect at the end of the line
        ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });
      
      // Draw agents
      agents.forEach(agent => {
        const pos = positionMap.get(agent.id);
        if (!pos) return;
        
        const typeColor = getAgentTypeColor(agent.type);
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        
        // Agent border
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 30, 36, 0.8)';
        ctx.fill();
        
        // Agent fill
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = typeColor;
        ctx.fill();
        
        // Agent inner circle (for arbitrageurs)
        if (agent.type === 'arbitrageur') {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(30, 30, 36, 0.8)';
          ctx.fill();
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [state.agents, state.isRunning]);
  
  return (
    <div 
      ref={containerRef}
      className="bg-gray-900 rounded-lg shadow-lg overflow-hidden"
      style={{ height: '400px' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default SimulationVisualization;