# Use the official Node.js image as base
FROM node:latest


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

WORKDIR /usr/src/app/server
# Change ownership of the working directory to the 'node' user
RUN chown -R node:node .

# Switch to the 'node' user
USER node


# Expose the port your app runs on
EXPOSE 3005

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# Command to run the server
CMD ["node", "--env-file=.env", "index.js"]
