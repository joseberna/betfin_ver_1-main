# 🃏 Poker Web3 - FullStack DApp

A complete full-stack Web3 Poker DApp that integrates:

- Smart contract for NFT identity (Sepolia)
- Socket-based multiplayer backend (Node.js + Express + Socket.IO)
- Frontend React app with Web3 wallet connection
- Persistent wallet session across reloads (wagmi v2 + viem)
- Professional unit testing (Jest + React Testing Library)

---

## 📦 Project Structure

```bash
poker-web3/
│
├── client/              # ReactJS frontend with wallet integration
├── server/              # Node.js backend with Socket.IO game engine
├── contracts/           # Solidity NFT contract for player identity
├── README.md            # This file
└── ...                  # Other config files
```

---

## 🚧 Backend Overview (`server/`)

### 🛠 Initial Setup & Fixes

- 🔧 **`type: "module"` issue** in `package.json` caused `require`/`import` incompatibilities. Resolved by removing `"type": "module"` and aligning with CommonJS for better compatibility with Socket.IO and Jest.
- 📂 Reorganized socket listeners and emitters into modular handlers, allowing clean management of game events.
- ⚙️ Configured CORS and JSON parsing for frontend-backend communication.
- 📡 Integrated **Socket.IO** to handle real-time communication between players (join room, broadcast moves, state sync).
- ✅ Added logging for socket events to debug game flow and detect state desyncs.

### 🔌 WebSocket Coordination

- Ensured **event names and payload structures** matched between client and server.
- Implemented connection lifecycle handling: `connect`, `disconnect`, `reconnect`.
- Created a basic **poker room** system where users can join and interact.

---

## 🎮 Frontend Overview (`client/`)

### 🌐 Wallet Integration

- Migrated from legacy `wagmi` v1 setup to **`wagmi v2` + `viem`**, to ensure:
  - Full compatibility with MetaMask
  - Improved DX and composability
  - Support for **session persistence via localStorage**
- Used `Web3Modal` to allow connection from different wallets (starting with MetaMask).
- Implemented custom hook `useUserNFTs` to fetch NFTs after connection.

### 🧠 Session Persistence

- Solved the issue of wallet disconnecting after page refresh.
- Persisted user connection state in localStorage and restored it on mount.

### 🧪 Unit Testing

- Added Jest + React Testing Library setup.
- Created a full test suite for the `Profile.jsx` view:
  - ✅ Renders correctly
  - ✅ Shows NFTs if available
  - ✅ Handles no-NFT state
- Mocked wagmi hooks (`useAccount`, `useDisconnect`) to simulate wallet behavior.
- Mocked `useUserNFTs` hook for NFT API calls.

---

## 🧾 Smart Contract (`contracts/NFTPlayer.sol`)

### 🎯 Purpose

- Write a simple ERC-721 smart contract for an NFT collection. 
The contract should include functionality for minting, transferring, and querying ownership. Ensure to implement basic security best practices.

### 🚀 Deployment

- 📍 Deployed to **Sepolia Testnet**.
- Used **Hardhat** for compilation and deployment.
- Contract address stored and used in frontend NFT queries.

### 🛑 Why not Rinkeby/Kovan?

- **Rinkeby and Kovan are deprecated** as of 2023. We opted for **Sepolia**, which is actively maintained and EVM-compatible.
- Sepolia ensures compatibility with latest tooling (wagmi v2, Alchemy, MetaMask).

---

## 🧪 Testing & QA

### Frontend

- ✅ Unit tests using **Jest** and **@testing-library/react**
- Mocks for Web3 hooks and wallet behavior
- Verified that wallet session persists
- Simulated NFT responses and empty state

### Backend

- Manual integration tests with Socket.IO via Postman and logs
- Verifications of message broadcasts and socket events
- Simulated multiplayer sessions (join, move, leave)

---

## ✅ Summary of Features Implemented

| Feature                                      | Status |
|---------------------------------------------|--------|
| Backend socket coordination (Node + IO)     | ✅     |
| Frontend connection to socket server         | ✅     |
| NFT contract deployment (Sepolia)            | ✅     |
| Wallet connect flow (wagmi + Web3Modal)      | ✅     |
| Session persistence (localStorage)           | ✅     |
| Profile page with NFT listing                | ✅     |
| Unit tests for `Profile.jsx`                 | ✅     |
| Error handling and compatibility fixes       | ✅     |
| README + Documentation                       | ✅     |

---

## 💻 How to Run Locally

1. **Clone the repo**
```bash
git clone https://github.com/yourname/poker-web3.git
cd poker-web3
```

2. **Install frontend**
```bash
cd client
npm install
npm run dev
```

3. **Install backend**
```bash
cd ../server
npm install
npm start
```

4. **Run tests**
```bash
cd client
npm test
```

---

## 🚀 Deployment (Smart Contract - Sepolia)

1. Compile the contract:
```bash
npx hardhat compile
```

2. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Configure `client/.env` or `client/config.js` with deployed address.

---

## ✨ Contributors

👨‍💻 Jose Fernando Berna — [LinkedIn](https://www.linkedin.com/in/josefbernam/)  
🚀 Master’s Blockchain Candidate | Full Stack + Blockchain Developer

---

## 📘 License

MIT