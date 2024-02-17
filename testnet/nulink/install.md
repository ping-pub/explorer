# Install

1- Open Port

```
sudo ufw enable
```

```
sudo ufw allow 9151
```

2- Pre Install

```
sudo apt-get update
```

```
sudo apt install screen
```

```
sudo apt install docker.io
```

3- Download Geth on your server

```
wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.23-d901d853.tar.gz
```

```
tar -xvzf geth-linux-amd64-1.10.23-d901d853.tar.gz
```

4- Create Ethereum account

```
cd geth-linux-amd64-1.10.23-d901d853

```

```
./geth account new --keystore ./keystore
```

```
Create password
```

Save keystore

```
/geth-linux-amd64-1.10.23-d901d853/keystore/UTC--2024-02-09T13-33-06.226830019Z--bcb6caf8677408d56d54dba23e7c5879a592e005

```

5- Pull the latest NuLink image

```
docker pull nulink/nulink:latest
```

6- Create a directory in your host machine for later usage.

```
cd /root
mkdir nulink
```

7- Edit path

```
cp /root/geth-linux-amd64-1.10.23-d901d853/keystore/* /root/nulink
```

```
chmod -R 777 /root/nulink
```

8- Install Python & virtual environment

```
apt install python3-pip
```

```
pip install virtualenv
```

```
virtualenv /root/nulink-venv
```

9- Activate the newly created virtual environment

```
source /root/nulink-venv/bin/activate
```

10- Install the Nulink python package

```
wget https://download.nulink.org/release/core/nulink-0.5.0-py3-none-any.whl
```

```
pip install nulink-0.5.0-py3-none-any.whl
```

```
source /root/nulink-venv/bin/activate
```

```
python -c "import nulink"
```

11- Create Password.

```
export NULINK_KEYSTORE_PASSWORD=<YOUR NULINK STORAGE PASSWORD>
```

```
export NULINK_OPERATOR_ETH_PASSWORD=<YOUR WORKER ACCOUNT PASSWORD>
```

Example:

```
export NULINK_KEYSTORE_PASSWORD=12345678
```

```
export NULINK_OPERATOR_ETH_PASSWORD=12345678
```

12. Create screen

```
screen -S nulink
```

13- Initialize Node Configuration

```
docker run -it --rm \
-p 9151:9151 \
-v </path/to/host/machine/directory>:/code \
-v </path/to/host/machine/directory>:/home/circleci/.local/share/nulink \
-e NULINK_KEYSTORE_PASSWORD \
nulink/nulink nulink ursula init \
--signer <ETH KEYSTORE URI> \
--eth-provider <NULINK PROVIDER URI>  \
--network <NULINK NETWORK NAME> \
--payment-provider <PAYMENT PROVIDER URI> \
--payment-network <PAYMENT NETWORK NAME> \
--operator-address <WORKER ADDRESS> \
--max-gas-price <GWEI>
```

Example:

```
docker run -it --rm \
-p 9151:9151 \
-v /root/nulink:/code \
-v /root/nulink:/home/circleci/.local/share/nulink \
-e NULINK_KEYSTORE_PASSWORD \
nulink/nulink nulink ursula init \
--signer keystore:///code/UTC--2023-12-31T17-42-14.316243885Z--f3defb90c2f03e904bxxxxxxxxxxxxxxxxxxx \
--eth-provider https://data-seed-prebsc-2-s2.binance.org:8545 \
--network horus \
--payment-provider https://data-seed-prebsc-2-s2.binance.org:8545 \
--payment-network bsc_testnet \
--operator-address 0xf3defb90c2f03xxxxxxxxxxxxxxxxxxxxxxxx \
--max-gas-price 10000000000
```

14. Prepare :

* New Wallet for Staker with Fee tBNB
* Fee tBNB for wallet validator /Worker

15- Launch Node

```
docker run -it --restart on-failure -d \
--name ursula \
-p 9151:9151 \
-v /root/nulink:/code \
-v /root/nulink:/home/circleci/.local/share/nulink \
-e NULINK_KEYSTORE_PASSWORD=<your_password> \
-e NULINK_OPERATOR_ETH_PASSWORD=<your_password> \
nulink/nulink nulink ursula run --no-block-until-ready
```

16- Check Node Status

```
docker logs -f ursula
```

17. Detach

```
CTRL a d
```

18. Go to dahsbord : https://dashboard.testnet.nulink.org/

* Connect Address staker with Chain BSC\_testnet
* Request NLK from the faucet on the top right of the dashboard next to the Metamask logo
* Then select the STAKING tab
* Click the APPROVE button
* Click the Stake button (max 5)
* Scroll down and select the bond to Worker button
* Insert the worker wallet

19. fill form : https://docs.google.com/forms/d/e/1FAIpQLSdY2eXwQD-tKvJ\_Ug-6hgdcWK\_wUOZjXeJknw5XWSEO8gzJ2w/viewform
