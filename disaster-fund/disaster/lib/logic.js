/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const disNameSpace = 'org.ibm.disaster.fund';
/** 
 * New script file 
 */
/** 
 * Sample transaction function. 
 * @param {org.ibm.disaster.fund.SampleTransaction} sampletransfer 
 * @transaction 
 */
function sampletransfer(sampletransfer) {
    if (sampletransfer.fromaccnt.balance <= 0) {
        throw new Error("Insufficient Aid please add AID to account");
    }

    sampletransfer.fromaccnt.balance -= sampletransfer.amount;
    sampletransfer.toaccnt.balance += sampletransfer.amount;
    return getAssetRegistry(disNameSpace + '.Aid').then(function(accountRegistery) {
        return accountRegistery.updateAll([sampletransfer.fromaccnt, sampletransfer.toaccnt]);
    });
}

/**
 * @param {org.ibm.disaster.fund.addNgo} addNgoTrnx - the add customer transaction
 * @transaction
 */
async function addNgo(addNgoTrnx) {
    let customerRegistry = await getParticipantRegistry('org.ibm.disaster.fund.Ngo');
    var factory = getFactory();
    var ngoreceiver = factory.newResource(disNameSpace, 'Ngo', addNgoTrnx.transactionId);
    let address = factory.newConcept(disNameSpace, 'ContactAddress');
    ngoreceiver.ReceiverNgoName = addNgoTrnx.NgoName;
    ngoreceiver.IdNumber = addNgoTrnx.IdNumber;
    ngoreceiver.IDtype = addNgoTrnx.IDtype;
    //  ngoreceiver.owner = addNgoTrnx.owner
    address.city = addNgoTrnx.city;
    address.state = addNgoTrnx.state;
    address.zipCode = addNgoTrnx.zipCode;
    address.country = addNgoTrnx.country;
    address.phoneNumber = addNgoTrnx.phoneNumber;
    address.emailAddress = addNgoTrnx.emailAddress;
    ngoreceiver.contactAddress = address;
    await customerRegistry.add(ngoreceiver);
}

/**
 *
 * @param {org.ibm.disaster.fund.addAid} addAidTranx - Create a new Aid Good using transaction ID
 * @transaction
 */
async function addAid(addAidTranx) {
    let AidRegistry = await getAssetRegistry('org.ibm.disaster.fund.Aid');
    var factory = getFactory();
    var aID = factory.newResource(disNameSpace, 'Aid', addAidTranx.transactionId);
    aID.aidTYPE = addAidTranx.aidTYPE;
    aID.AidCategory = addAidTranx.AidCategory;
    aID.accountReference = "AID Purchase from Block chain";
    aID.balance = addAidTranx.balance;
    aID.owner = addAidTranx.owner
    await AidRegistry.add(aID);
}