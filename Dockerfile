# Use an official Node.js runtime as the base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the dependency files first (for efficient caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port (optional, depends on your app configuration)
EXPOSE 5173

# Run the development server
CMD ["yarn", "start"]
