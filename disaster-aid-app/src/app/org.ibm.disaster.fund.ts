import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.ibm.disaster.fund{
   export enum IDtype {
      TANnumber,
      PANnumber,
   }
   export enum Aidtype {
      Cash,
      food,
      Medical,
      cloth,
   }
   export class ContactAddress {
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phoneNumber: string;
      emailAddress: string;
   }
   export class Ngo extends Participant {
      ngoID: string;
      ReceiverNgoName: string;
      IDtype: IDtype;
      IdNumber: string;
      contactAddress: ContactAddress;
   }
   export class Aid extends Asset {
      AidID: string;
      AidCategory: string;
      balance: number;
      accountReference: string;
      aidTYPE: Aidtype;
      owner: Ngo;
   }
   export class addNgo extends Transaction {
      NgoName: string;
      IdNumber: string;
      IDtype: IDtype;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phoneNumber: string;
      emailAddress: string;
   }
   export class addAid extends Transaction {
      owner: Ngo;
      aidTYPE: Aidtype;
      AidCategory: string;
      accountReference: string;
      balance: number;
   }
   export class SampleTransaction extends Transaction {
      fromaccnt: Aid;
      toaccnt: Aid;
      amount: number;
   }
// }
