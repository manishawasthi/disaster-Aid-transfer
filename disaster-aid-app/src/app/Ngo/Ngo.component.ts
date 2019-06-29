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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgoService } from './Ngo.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-ngo',
  templateUrl: './Ngo.component.html',
  styleUrls: ['./Ngo.component.css'],
  providers: [NgoService]
})
export class NgoComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  ngoID = new FormControl('', Validators.required);
  ReceiverNgoName = new FormControl('', Validators.required);
  IDtype = new FormControl('', Validators.required);
  IdNumber = new FormControl('', Validators.required);
  contactAddress = new FormControl('', Validators.required);


  constructor(public serviceNgo: NgoService, fb: FormBuilder) {
    this.myForm = fb.group({
      ngoID: this.ngoID,
      ReceiverNgoName: this.ReceiverNgoName,
      IDtype: this.IDtype,
      IdNumber: this.IdNumber,
      contactAddress: this.contactAddress
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceNgo.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ibm.disaster.fund.Ngo',
      'ngoID': this.ngoID.value,
      'ReceiverNgoName': this.ReceiverNgoName.value,
      'IDtype': this.IDtype.value,
      'IdNumber': this.IdNumber.value,
      'contactAddress': this.contactAddress.value
    };

    this.myForm.setValue({
      'ngoID': null,
      'ReceiverNgoName': null,
      'IDtype': null,
      'IdNumber': null,
      'contactAddress': null
    });

    return this.serviceNgo.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'ngoID': null,
        'ReceiverNgoName': null,
        'IDtype': null,
        'IdNumber': null,
        'contactAddress': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ibm.disaster.fund.Ngo',
      'ReceiverNgoName': this.ReceiverNgoName.value,
      'IDtype': this.IDtype.value,
      'IdNumber': this.IdNumber.value,
      'contactAddress': this.contactAddress.value
    };

    return this.serviceNgo.updateParticipant(form.get('ngoID').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceNgo.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceNgo.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'ngoID': null,
        'ReceiverNgoName': null,
        'IDtype': null,
        'IdNumber': null,
        'contactAddress': null
      };

      if (result.ngoID) {
        formObject.ngoID = result.ngoID;
      } else {
        formObject.ngoID = null;
      }

      if (result.ReceiverNgoName) {
        formObject.ReceiverNgoName = result.ReceiverNgoName;
      } else {
        formObject.ReceiverNgoName = null;
      }

      if (result.IDtype) {
        formObject.IDtype = result.IDtype;
      } else {
        formObject.IDtype = null;
      }

      if (result.IdNumber) {
        formObject.IdNumber = result.IdNumber;
      } else {
        formObject.IdNumber = null;
      }

      if (result.contactAddress) {
        formObject.contactAddress = result.contactAddress;
      } else {
        formObject.contactAddress = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'ngoID': null,
      'ReceiverNgoName': null,
      'IDtype': null,
      'IdNumber': null,
      'contactAddress': null
    });
  }
}
