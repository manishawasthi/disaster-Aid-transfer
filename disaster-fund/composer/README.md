# Creation of Fabric Infrastructure
## The fabric infrastructure has one organisation having a peer,orderer and a certification authority

### Create all the certificates and keys using cryptogen which is present in bin folder and store it in crypto-config.
```
../bin/cryptogen generate --config crypto-config.yaml --output=crypto-config
```
### create the genesis block
```
../bin/configtxgen -profile ComposerOrdererGenesis -outputBlock composer-genesis.block
```
### create the channel for the organisation and create the anchor peer 
```
../bin/configtxgen -profile ComposerChannel -outputAnchorPeersUpdate composer- channel.tx -channelID ComposerChannel -asOrgs Org1MSP 
```
