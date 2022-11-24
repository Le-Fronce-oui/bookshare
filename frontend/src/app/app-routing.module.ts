import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsPageComponent } from './components/pages/book-details-page/book-details-page.component';
import { BookSearchPageComponent } from './components/pages/book-search-page/book-search-page.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { OrganisationDetailsPageComponent } from './components/pages/organisation-details-page/organisation-details-page.component';
import { OrganisationMembersPageComponent } from './components/pages/organisation-members-page/organisation-members-page.component';
import { OrganisationSearchPageComponent } from './components/pages/organisation-search-page/organisation-search-page.component';
import { SigninPageComponent } from './components/pages/signin-page/signin-page.component';
import { UserDetailsPageComponent } from './components/pages/user-details-page/user-details-page.component';
import { UserEditPageComponent } from './components/pages/user-edit-page/user-edit-page.component';

const routes: Routes = [
  { path: 'signin', component: SigninPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'index', component: IndexPageComponent },
  { path: 'books', component: BookSearchPageComponent },
  { path: 'book/:uuid', component: BookDetailsPageComponent },
  { path: 'users', component: UserDetailsPageComponent },
  { path: 'user/:uuid', component: UserDetailsPageComponent },
  { path: 'user/:uuid/edit', component: UserEditPageComponent },
  { path: 'organisations', component: OrganisationSearchPageComponent },
  { path: 'organisation/:uuid', component: OrganisationDetailsPageComponent },
  { path: 'organisation/:uuid/members', component: OrganisationMembersPageComponent },
  { path: '**', redirectTo: '/index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
