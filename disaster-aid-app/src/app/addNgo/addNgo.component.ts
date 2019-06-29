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
import { addNgoService } from './addNgo.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-addngo',
  templateUrl: './addNgo.component.html',
  styleUrls: ['./addNgo.component.css'],
  providers: [addNgoService]
})
export class addNgoComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  NgoName = new FormControl('', Validators.required);
  IdNumber = new FormControl('', Validators.required);
  IDtype = new FormControl('', Validators.required);
  city = new FormControl('', Validators.required);
  state = new FormControl('', Validators.required);
  zipCode = new FormControl('', Validators.required);
  country = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);
  emailAddress = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceaddNgo: addNgoService, fb: FormBuilder) {
    this.myForm = fb.group({
      NgoName: this.NgoName,
      IdNumber: this.IdNumber,
      IDtype: this.IDtype,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      phoneNumber: this.phoneNumber,
      emailAddress: this.emailAddress,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceaddNgo.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ibm.disaster.fund.addNgo',
      'NgoName': this.NgoName.value,
      'IdNumber': this.IdNumber.value,
      'IDtype': this.IDtype.value,
      'city': this.city.value,
      'state': this.state.value,
      'zipCode': this.zipCode.value,
      'country': this.country.value,
      'phoneNumber': this.phoneNumber.value,
      'emailAddress': this.emailAddress.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'NgoName': null,
      'IdNumber': null,
      'IDtype': null,
      'city': null,
      'state': null,
      'zipCode': null,
      'country': null,
      'phoneNumber': null,
      'emailAddress': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceaddNgo.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'NgoName': null,
        'IdNumber': null,
        'IDtype': null,
        'city': null,
        'state': null,
        'zipCode': null,
        'country': null,
        'phoneNumber': null,
        'emailAddress': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ibm.disaster.fund.addNgo',
      'NgoName': this.NgoName.value,
      'IdNumber': this.IdNumber.value,
      'IDtype': this.IDtype.value,
      'city': this.city.value,
      'state': this.state.value,
      'zipCode': this.zipCode.value,
      'country': this.country.value,
      'phoneNumber': this.phoneNumber.value,
      'emailAddress': this.emailAddress.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceaddNgo.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceaddNgo.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    return this.serviceaddNgo.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'NgoName': null,
        'IdNumber': null,
        'IDtype': null,
        'city': null,
        'state': null,
        'zipCode': null,
        'country': null,
        'phoneNumber': null,
        'emailAddress': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.NgoName) {
        formObject.NgoName = result.NgoName;
      } else {
        formObject.NgoName = null;
      }

      if (result.IdNumber) {
        formObject.IdNumber = result.IdNumber;
      } else {
        formObject.IdNumber = null;
      }

      if (result.IDtype) {
        formObject.IDtype = result.IDtype;
      } else {
        formObject.IDtype = null;
      }

      if (result.city) {
        formObject.city = result.city;
      } else {
        formObject.city = null;
      }

      if (result.state) {
        formObject.state = result.state;
      } else {
        formObject.state = null;
      }

      if (result.zipCode) {
        formObject.zipCode = result.zipCode;
      } else {
        formObject.zipCode = null;
      }

      if (result.country) {
        formObject.country = result.country;
      } else {
        formObject.country = null;
      }

      if (result.phoneNumber) {
        formObject.phoneNumber = result.phoneNumber;
      } else {
        formObject.phoneNumber = null;
      }

      if (result.emailAddress) {
        formObject.emailAddress = result.emailAddress;
      } else {
        formObject.emailAddress = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'NgoName': null,
      'IdNumber': null,
      'IDtype': null,
      'city': null,
      'state': null,
      'zipCode': null,
      'country': null,
      'phoneNumber': null,
      'emailAddress': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
