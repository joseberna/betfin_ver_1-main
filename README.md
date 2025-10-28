# Bet_Poker MVP

## 😎 Indroduction
```
Betfin poker game is a online poker platform that uses cryptocurrencies like Bitcoin, Ethereum, or other digital assets for betting and transactions. 
These platforms often offer features such as:

    • Decentralized and transparent gameplay: Blockchain technology ensures fairness and transparency.
    • Fast deposits and withdrawals: Cryptocurrencies enable quick transactions.
    • Anonymity: Players can often play without revealing personal information.
    • Provably Fair: Many platforms use cryptographic methods to verify the fairness of each game.
```
## Project Analysis & Strategic Direction

### 1. Current State Assessment
```
    • Technical Foundation: Node.js v18 backend with RESTful API architecture and MongoDB integration
    • Frontend Implementation: Client-side application with modern JavaScript frameworks
    • Gaming Components: Poker game implementation with socket-based real-time functionality
    • Development Environment: Node.js v18 and Python v3.12 dependencies
    • Existing Team Composition: 4 frontend developers (React), 2 blockchain developers (Solidity, EVM), 2 backend developers (Node.js), one Technical Manager
```
### 2. Technology Stack Optimization

```
Based on our current implementation and requirements, you can propose: 
    • Blockchain Platform: Polygon (definitive choice) with migration path to Polygon zkEVM
    • Identity Layer: Soulbound Tokens (SBTs) for non-transferable player identity and reputation
    • Backend Core: Node.js v18 with Express, optimized for real-time gaming operations
    • Frontend Framework: React with Web3 integration libraries and responsive design
    • Smart Contracts: Solidity contracts optimized for Polygon's EVM compatibility
    • Database Strategy: MongoDB for off-chain data with IPFS for decentralized assets
    • DevOps Pipeline: Containerized deployment with CI/CD automation
    • Python Integration: v3.12 for data analysis, ML capabilities, and specialized tooling
```

### 3. System Architecture Design
```
The architecture implements a modular, service-oriented approach with:
    • Authentication Layer: Web3 wallet integration with SBT verification and traditional auth fallback
    • Game Engine Core: Modular design supporting multiple game types
    • Polygon Integration Layer: Optimized for high-throughput, low-cost transactions
    • Social Engagement Services: Real-time community features and tournaments
    • Asset Management System: NFT and token lifecycle management
    • Identity & Reputation System: SBT-based player profiles and achievements
    • Analytics Engine: Performance and behavior tracking for optimization
```

## How to Run

### Install server dependencies

```bash
npm install --force
```

### Install client dependencies

```bash
cd client
npm install --force
cd ..
```

### Run project

```bash
npm start
```


