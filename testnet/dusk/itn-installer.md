# ITN Installer

This repository contains an easy to use installer to run a Dusk Network node for our ITN program.

## Prerequisites

* Ubuntu 22.04 LTS x64
* OpenSSL 3

This installer is specifically built for Ubuntu 22.04 x64. It might work on older or newer versions.

## Packages

The installer comes with the following packages:

* Rusk service
* Rusk wallet CLI

## Folder layout

The configuration files, binaries, services and scripts can be found in `/opt/dusk/`.

The log files can be found in `/var/log/rusk.{err,log}`.

## Installation

:information\_source: To run the **latest release** of the ITN installer execute the following command:

```sh
curl --proto '=https' --tlsv1.2 -sSfL https://github.com/dusk-network/itn-installer/releases/download/v0.1.0/itn-installer.sh | sudo sh
```

:warning: **CAUTION** To run the **not release yet** unstable version of the ITN installer execute the following command:

```sh
curl --proto '=https' --tlsv1.2 -sSfL https://raw.githubusercontent.com/dusk-network/itn-installer/main/itn-installer.sh | sudo sh
```

## Configuration

The installer comes with sane defaults, only requiring minimal configuration. Before the Rusk service can be started, the `CONSENSUS_KEYS` and `DUSK_CONSENSUS_KEYS_PASS` need to be provided.

The `CONSENSUS_KEYS` can be either moved to `/opt/dusk/conf/` from another system or generated on the node itself and moved there.

### Set consensus keys

To generate the provisioner keys locally, run `rusk-wallet` and either create a new wallet or use a recovery phrase with `rusk-wallet restore`.

To generate and export the provisioner key-pair and put the `.keys` file in the right directory with the right name, copy the following command:

```sh
rusk-wallet export -d /opt/dusk/conf -n consensus.keys
```

### Set consensus password

Run the following command and it will prompt you to enter the password for the consensus keys file:

```sh
/opt/dusk/bin/setup_consensus_pwd.sh
```

### Start Rusk

Everything should be configured now and the node is ready to run. Use the following commands:

```sh
service rusk start
```

Check the status of the Rusk service by running:

```sh
service rusk status
```

## Diagnostics

Check if your node is syncing, processing and accepting new blocks:

```sh
tail -F /var/log/rusk.log | grep " block accepted"
```

Check if your node is participating in consensus and trying to create blocks:

```sh
tail -F /var/log/rusk.log | grep "execute_state_transition"
```

Or to check if it did so in the past:

```sh
 grep execute_state_transition /var/log/rusk.log
```

To check for errors in the Rusk service:

```sh
cat /var/log/rusk.err
```
