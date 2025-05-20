 README.md


# SwarmTrade Lite

A decentralized agent-based micro-economy simulator** that models economic activity through autonomous trading agents interacting in a peer-to-peer marketplace.

Features

- Agent-based modeling: Each agent acts independently with configurable behavior rules.
- Decentralized trading: No central authority; agents trade directly with each other.
- Resource and inventory management: Agents hold goods and currency, making trading decisions accordingly.
- Customizable scenarios: Define agent types, initial resources, market rules, and trading strategies.
- Data visualization: Track price dynamics, trade volumes, and wealth distribution over simulation time.
- Extensible architecture: Easily add new agent behaviors, goods, and trading protocols.

Installation

1. Clone the repository:

   bash
   git clone https://github.com/jonkllfaton/swarmtrade-lite.git
   cd swarmtrade-lite
   

2. Install dependencies (assuming Python 3.8+):

   bash
   pip install -r requirements.txt
   

Usage

Run the simulation with default parameters:

bash
python run_simulation.py


To customize the simulation, edit the `config.yaml` file:

- Define agent population and types
- Specify initial inventories and currency
- Set trading rules and simulation duration

Run with your config:

bash
python run_simulation.py --config config.yaml


Example Agents

- Producer: Generates goods and sells them.
- Consumer: Buys goods for consumption.
- Trader: Buys low, sells high, attempting to profit.

Output

- Logs detailing trades and agent states
- CSV files with market prices and agent wealth over time
- Graphs visualizing market trends (optional)

Contributing

Contributions are welcome! Please submit issues and pull requests.

Copyright (c) 2025 jonkllfaton

All rights reserved.

This project and its contents are the intellectual property of jonkllfaton.  
Unauthorized copying, distribution, modification, or use of any part of this project is strictly prohibited without prior written permission.

For permissions or inquiries, please contact: jonkllfaton@gmail.com
