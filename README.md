# AuditChain — Immutable Audit Log on Nero Chain

An on-chain audit logging system built on Nero Chain. Log actions, track access patterns, flag anomalies, and query the entire audit trail with cryptographic guarantees of immutability.

**Contract Address -** To be updated post-deployment on Nero Testnet

## Table of Contents

1. [Features](#features)
2. [UI Screenshots](#ui-screenshots)
3. [Project Structure](#project-structure)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Contract Methods](#contract-methods)
7. [Deployment](#deployment)
8. [Data Model](#data-model)
9. [Error Codes](#error-codes)
10. [License](#license)

## Features

- **Tamper-proof records**: Once written to the blockchain, no entry can be altered
- **Real-time flagging**: Mark suspicious entries instantly with audit reasons
- **Queryable state**: Read entry counts, flagged totals, and individual records
- **Auth-gated writes**: Every write operation requires cryptographic signatures from actors/auditors via MetaMask
- **Severity levels 0–5**: Classify events from informational through critical
- **Nero Chain native**: Built in Solidity on Nero Chain with fast finality and low fees
- **Auto-Network Switch**: Frontend automatically detects and prompts users to switch to Nero Testnet.

## UI Screenshots

*(Screenshots remain same as before, refer to `public/` folder)*

## Project Structure

```
my-nero-app/
├── index.html              # Landing page (features, how-it-works, contract info)
├── app.html                # Security console application
├── src/
│   ├── App.jsx             # React security console component
│   ├── App.css             # Console UI styles
│   ├── main.jsx            # ReactDOM entry point
│   ├── index.css           # Global styles
│   └── assets/             # Images and static assets
├── lib/
│   └── nero.js             # Ethers.js integration + contract methods + MetaMask connection
├── evm-contracts/          # Hardhat Project
│   ├── contracts/          
│   │   └── AuditLogTracking.sol # Solidity smart contract
│   ├── scripts/            
│   │   └── deploy.js       # Deployment script
│   └── hardhat.config.js   # Network configuration
├── public/                 # Static public files
├── vite.config.js          # Vite configuration with multi-page build
└── package.json            # Dependencies
```

## Tech Stack

- **Frontend**: React 19 + Vite
- **Blockchain**: Nero Chain (Testnet)
- **Smart Contract**: Solidity
- **Framework**: Hardhat
- **Wallet**: MetaMask
- **SDK**: ethers.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet extension

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

- Landing page: http://localhost:5173/
- Security console: http://localhost:5173/app.html

### Build

```bash
npm run build
```

### Contract Deployment

```bash
cd evm-contracts
npm install
npx hardhat run scripts/deploy.js --network nero
```

## Contract Methods

### Write Operations (Auth Required)

- **logAction** — Record a system action with actor, type, target, description, and severity
- **logAccess** — Log resource access with type (read/write/delete)
- **flagEntry** — Mark an entry as suspicious with an audit reason

### Read Operations (Free)

- **getEntry** — Retrieve a specific audit entry by ID
- **listEntries** — Get all entry IDs in the log
- **getEntryCount** — Total number of entries
- **getFlaggedCount** — Number of flagged entries

## Deployment

1. Landing page and console are deployed as static HTML/React pages via Vite
2. Smart contract is deployed to Nero Testnet via Hardhat
3. Update `CONTRACT_ADDRESS` in `lib/nero.js` after redeploying the contract

## Data Model

### AuditEntry

```solidity
struct AuditEntry {
    address actor;
    string actionType;
    string target;
    string description;
    uint32 severity;
    bool isFlagged;
    string flagReason;
    string accessType;
    uint64 loggedAt;
}
```

## Error Codes

- `InvalidDescription` — Empty description
- `InvalidTimestamp` — Timestamp is zero
- `InvalidSeverity` — Severity > 5
- `EntryAlreadyExists` — Entry with given ID already exists
- `EntryNotFound` — Entry ID not found
- `AlreadyFlagged` — Entry already flagged

## License

MIT
