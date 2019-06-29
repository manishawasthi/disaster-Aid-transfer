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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { AidComponent } from './Aid/Aid.component';

import { NgoComponent } from './Ngo/Ngo.component';

import { addNgoComponent } from './addNgo/addNgo.component';
import { addAidComponent } from './addAid/addAid.component';
import { SampleTransactionComponent } from './SampleTransaction/SampleTransaction.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Aid', component: AidComponent },
  { path: 'Ngo', component: NgoComponent },
  { path: 'addNgo', component: addNgoComponent },
  { path: 'addAid', component: addAidComponent },
  { path: 'SampleTransaction', component: SampleTransactionComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
