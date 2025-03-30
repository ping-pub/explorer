# Use the official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies with legacy-peer-deps flag to bypass dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Set Node.js environment to production
ENV NODE_ENV=production

# Increase Node.js memory limit for larger datasets
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Change ownership of the working directory to the 'node' user
RUN chown -R node:node .

# Switch to the 'node' user for security
USER node

# Expose the port your app runs on
EXPOSE 3005

# Command to run the server
CMD ["node", "index.js"]
