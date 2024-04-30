# Aviaone Explorer Application

This document provides detailed instructions on how to set up, develop, and deploy changes to the Aviaone Explorer application. Follow these steps to manage your local development environment and update the live application.

## Getting Started Locally

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you start, make sure you have `git` and `npm` installed on your machine.

### Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yohann-dev/aviaone-explorer.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd aviaone-explorer
   ```

3. **Install dependencies**:
   ```bash
   npm i
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **View in browser**:
   Open your web browser and go to [http://localhost:5173/](http://localhost:5173/) to see the application running.

## Installing Node.js and npm on the Server

To run the project on a server, Node.js and npm must be installed. Here is how to install Node.js version 18 and npm on a Linux server:

### Installing Node.js v18

1. **Curl and Software Properties**:
   Ensure that `curl` and the software properties are installed, which will help in fetching and setting up the Node.js repository.
   ```bash
   sudo apt update
   sudo apt install curl software-properties-common
   ```

2. **NodeSource Node.js 18.x repo**:
   Add the Node.js 18.x repository from NodeSource. This repository contains the latest version of Node.js.
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   ```

3. **Install Node.js**:
   Once the repository is added, install Node.js and npm.
   ```bash
   sudo apt install nodejs
   ```

4. **Verify Installation**:
   Check the installed versions of Node.js and npm to ensure they are installed correctly.
   ```bash
   node -v
   npm -v
   ```

### Managing Chains

To add or remove blockchain chains for the mainnet environment, follow the steps below.

### Adding a Chain

To enable a new chain on the mainnet:

1. **Navigate to the chains directory**:
   ```bash
   cd src/chains
   ```

2. **Move the chain's JSON file from `mainnet-disabled` to `mainnet`**:
   ```bash
   mv mainnet-disabled/{chain-name}.json mainnet/
   ```

### Removing a Chain

To disable a chain from the mainnet:

1. **Move the chain's JSON file from `mainnet` to `mainnet-disabled`**:
   ```bash
   mv mainnet/{chain-name}.json mainnet-disabled/
   ```

## Deploying Changes

When you have made changes to the application that need to be reflected on the live server, follow these deployment steps.

### Local Changes

1. **Make and commit your changes locally**:
   - Perform your edits.
   - Commit the changes to Git:
     ```bash
     git commit -am "Describe your changes here"
     ```

2. **Push your changes to the repository**:
   ```bash
   git push
   ```

### Server Deployment

Once your changes are committed and pushed, you need to update the server.

1. **Connect to the server**:
   ```bash
   ssh username@server-address
   ```

2. **Navigate to the project directory on the server**:
   ```bash
   cd /var/www/aviaone-explorer
   ```

3. **Pull the latest changes**:
   ```bash
   git pull
   ```

4. **Install any new dependencies**:
   ```bash
   npm i
   ```

5. **Build the application**:
   ```bash
   npm run build
   ```

6. **Restart the Caddy server to apply the changes**:
   ```bash
   sudo systemctl restart caddy
   ```

## Conclusion

Following these instructions will help you manage the Aviaone Explorer application effectively, whether you're developing locally or deploying updates to a live environment. Ensure all commands are executed correctly and in the specified directories.
