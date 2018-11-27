import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsComponent} from './subjects/subjects.component';
import { SubjectComponent} from './subject/subject.component';
import { HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'subjects', component: SubjectsComponent },
  { path: 'search/:searchTerm', component: SubjectsComponent },
  { path: 'subject/:id', component: SubjectComponent },
  { path: 'subject', component: SubjectComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
