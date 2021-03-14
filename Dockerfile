FROM index.docker.io/keymetrics/pm2:12-alpine
RUN mkdir -p ~/look-web
ADD server/ ~/look-web
WORKDIR ~/look-web
RUN npm set registry https://registry.npm.taobao.org
RUN npm install
ENTRYPOINT npm run start;sleep 100000000
