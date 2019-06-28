#remove  all the previous  docker continers
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)

#get the location of docker compose
DOCKER_FILE=./composer/docker-compose.yml

docker-compose -f "${DOCKER_FILE}" down
docker-compose -f "${DOCKER_FILE}" up -d


export MSYS_NO_PATHCONV=1

sleep 15

# Create the channel for the organisation
docker exec peer0.ibm.platform-configuration.com peer channel create -o orderer.platform-configuration.com:7050 -c composerchannel -f /etc/hyperledger/configtx/composer-channel.tx


# Join peer.ibm.platform-configuration.com to the channel.
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ibm.platform-configuration.com/msp" peer0.ibm.platform-configuration.com peer channel join -b composerchannel.block


#create the peerAdmin card

cat << EOF > DevServer_connection.json
{
    "name": "platform-configuration",
    "x-type": "hlfv1",
    "x-commitTimeout": 300,
    "version": "1.0.0",
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.platform-configuration.com"
            ],
            "peers": {
                "peer0.ibm.platform-configuration.com": {}
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.ibm.platform-configuration.com"
            ],
            "certificateAuthorities": [
                "ca.ibm.platform-configuration.com"
            ]
        }
    },
    "orderers": {
        "orderer.platform-configuration.com": {
            "url": "grpc://localhost:7050"
        }
    },
    "peers": {
        "peer0.ibm.platform-configuration.com": {
            "url": "grpc://localhost:7051"
        }
    },
    "certificateAuthorities": {
        "ca.ibm.platform-configuration.com": {
            "url": "http://localhost:7054",
            "caName": "ca.ibm.platform-configuration.com"
        }
    }
}
EOF
#locate the PRIVATE_KEY and CERT
PRIVATE_KEY=./composer/crypto-config/peerOrganizations/ibm.platform-configuration.com/users/Admin@ibm.platform-configuration.com/msp/keystore/c09a2f2ff2a0d53e2bfed70a9ce2d2ef1916b862e326c51890c8c02a409da128_sk
CERT=./composer/crypto-config/peerOrganizations/ibm.platform-configuration.com/users/Admin@ibm.platform-configuration.com/msp/signcerts/Admin@ibm.platform-configuration.com-cert.pem




composer  card create -p DevServer_connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin -r ChannelAdmin --file PeerAdmin@platform-configuration.card

#remove the card if previously any of same name
composer  card delete -c PeerAdmin@platform-configuration


composer  card import --file PeerAdmin@platform-configuration.card




cd disaster

#create a bussness archive and install it in the network and access the network via admin card

composer archive create --sourceType dir --sourceName .

composer network install --archiveFile disaster@0.0.1.bna --card PeerAdmin@platform-configuration

composer network start --networkName disaster --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@platform-configuration --file disaster.card

composer card delete -c admin@disaster

composer card import --file disaster.card

cd ..


source ./rest-server.sh

sleep 50

firefox http://localhost:3000
