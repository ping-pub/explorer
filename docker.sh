# chmod 755 docker.sh

yarn --ignore-engines add
yarn --ignore-engines build
docker build -t "ping.pub/dashboard" .

# then you can run "docker run -d -p 8080:80 ping.pub/dashboard"