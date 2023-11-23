FROM node:lts-slim

WORKDIR /app

COPY . .

RUN yarn --ignore-engines

EXPOSE 5173

CMD ["yarn", "serve", "--host"]
