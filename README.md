<div align="center">

![MANTRA](./public/logo.svg)

<h1>MANTRA Explorer</h1>

[![version](https://img.shields.io/github/tag/ping-pub/explorer.svg)](https://github.com/MANTRA-Chain/explorer/releases/latest)
[![GitHub](https://img.shields.io/github/license/ping-pub/explorer.svg)](https://github.com/MANTRA-Chain/explorer/blob/master/LICENSE)
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40ping_pub)](https://twitter.com/MANTRA_Chain)
[![https://discord.gg/CmjYVSr6GW](https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat)](https://discord.gg/gfks4TwAJV)

</div>

Welcome to the MANTRA Chain Explorer repository! This project is a customized version of the [Ping.pub Cosmos blockchain explorer](https://github.com/ping-pub/explorer), tailored specifically for the [MANTRA Chain](https://mantrachain.io). The explorer provides a user-friendly interface to navigate and analyze the MANTRA blockchain data.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Explorer](#running-the-explorer)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Features

- **Block Explorer**: View detailed information about blocks on MANTRA Chain.
- **Transaction Explorer**: Search and analyze transactions with ease.
- **Validator Dashboard**: Monitor validator performance and statistics.
- **Account Management**: Check balances and transaction history of addresses.
- **Custom Integrations**: Features and tools specific to MANTRA Chain.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 12.x or higher
- **Yarn**: Version 1.22.x or higher
- **Git**: To clone the repository
- **Access to MANTRA Chain Node**: Ensure you have access to a MANTRA Chain RPC endpoint.

## Installation

### 1. Clone the Repository

<code>
git clone https://github.com/yourusername/mantra-chain-explorer.git  
cd mantra-chain-explorer
</code>

### 2. Install Dependencies

<code>
yarn install
</code>

## Configuration

### 1. Logo and Branding

Place your custom logo in the `public` directory and ensure the `VUE_APP_LOGO_URL` in your `.env` file points to it.

## Running the Explorer

### 1. Start the Development Server

<code>
yarn serve
</code>

The explorer should now be running at `http://localhost:5173`.

### 2. Accessing the Explorer

Open your web browser and navigate to `http://localhost:5173` to start exploring MANTRA Chain.

## Building for Production

To create a production-ready build of the explorer, run:

<code>
yarn build
</code>

The build artifacts will be stored in the `dist/` directory. You can deploy these static files to any web hosting service.

## Contributing

We welcome contributions to enhance the MANTRA Chain Explorer. To contribute:

1. **Fork** the repository.
2. **Create a new branch**:

   <code>
   git checkout -b feature/your-feature-name
   </code>

3. **Commit your changes**:

   <code>
   git commit -m "Add your message here"
   </code>

4. **Push to the branch**:

   <code>
   git push origin feature/your-feature-name
   </code>

5. **Open a Pull Request** on GitHub.

## License

This project is licensed under the **GNU Public License**. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ping.pub](https://ping.pub) for the original Cosmos blockchain explorer framework.
- The MANTRA community for their continuous support.

## Contact

For support or inquiries:

- **Website**: [mantrachain.io](https://mantrachain.io)

---

_Happy exploring the MANTRA Chain!_

## Contributors

Developers: @liangping @dingyiming @mantramatt
