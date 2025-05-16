# Use an official Node.js runtime as the base image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --ignore-engines

# Copy the rest of the application files
COPY . ./

# Build the application
RUN yarn build

# Use a smaller image for production
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default port for nginx
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]