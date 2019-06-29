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
import { AidService } from './Aid.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-aid',
  templateUrl: './Aid.component.html',
  styleUrls: ['./Aid.component.css'],
  providers: [AidService]
})
export class AidComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  AidID = new FormControl('', Validators.required);
  AidCategory = new FormControl('', Validators.required);
  balance = new FormControl('', Validators.required);
  accountReference = new FormControl('', Validators.required);
  aidTYPE = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceAid: AidService, fb: FormBuilder) {
    this.myForm = fb.group({
      AidID: this.AidID,
      AidCategory: this.AidCategory,
      balance: this.balance,
      accountReference: this.accountReference,
      aidTYPE: this.aidTYPE,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceAid.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.ibm.disaster.fund.Aid',
      'AidID': this.AidID.value,
      'AidCategory': this.AidCategory.value,
      'balance': this.balance.value,
      'accountReference': this.accountReference.value,
      'aidTYPE': this.aidTYPE.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'AidID': null,
      'AidCategory': null,
      'balance': null,
      'accountReference': null,
      'aidTYPE': null,
      'owner': null
    });

    return this.serviceAid.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'AidID': null,
        'AidCategory': null,
        'balance': null,
        'accountReference': null,
        'aidTYPE': null,
        'owner': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.ibm.disaster.fund.Aid',
      'AidCategory': this.AidCategory.value,
      'balance': this.balance.value,
      'accountReference': this.accountReference.value,
      'aidTYPE': this.aidTYPE.value,
      'owner': this.owner.value
    };

    return this.serviceAid.updateAsset(form.get('AidID').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceAid.deleteAsset(this.currentId)
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

    return this.serviceAid.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'AidID': null,
        'AidCategory': null,
        'balance': null,
        'accountReference': null,
        'aidTYPE': null,
        'owner': null
      };

      if (result.AidID) {
        formObject.AidID = result.AidID;
      } else {
        formObject.AidID = null;
      }

      if (result.AidCategory) {
        formObject.AidCategory = result.AidCategory;
      } else {
        formObject.AidCategory = null;
      }

      if (result.balance) {
        formObject.balance = result.balance;
      } else {
        formObject.balance = null;
      }

      if (result.accountReference) {
        formObject.accountReference = result.accountReference;
      } else {
        formObject.accountReference = null;
      }

      if (result.aidTYPE) {
        formObject.aidTYPE = result.aidTYPE;
      } else {
        formObject.aidTYPE = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'AidID': null,
      'AidCategory': null,
      'balance': null,
      'accountReference': null,
      'aidTYPE': null,
      'owner': null
      });
  }

}
