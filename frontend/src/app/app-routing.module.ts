import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsPageComponent } from './components/pages/book-details-page/book-details-page.component';
import { BookEditPageComponent } from './components/pages/book-edit-page/book-edit-page.component';
import { BookSearchPageComponent } from './components/pages/book-search-page/book-search-page.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { OrganisationDetailsPageComponent } from './components/pages/organisation-details-page/organisation-details-page.component';
import { OrganisationEditPageComponent } from './components/pages/organisation-edit-page/organisation-edit-page.component';
import { OrganisationMembersPageComponent } from './components/pages/organisation-members-page/organisation-members-page.component';
import { OrganisationSearchPageComponent } from './components/pages/organisation-search-page/organisation-search-page.component';
import { UserDetailsPageComponent } from './components/pages/user-details-page/user-details-page.component';
import { UserEditPageComponent } from './components/pages/user-edit-page/user-edit-page.component';

const routes: Routes = [
  { path: 'index', component: IndexPageComponent },
  { path: 'books', component: BookSearchPageComponent },
  { path: 'book/:uuid', component: BookDetailsPageComponent },
  { path: 'book/:uuid/edit', component: BookEditPageComponent },
  { path: 'user/:uuid', component: UserDetailsPageComponent },
  { path: 'user/:uuid/edit', component: UserEditPageComponent },
  { path: 'organisations', component: OrganisationSearchPageComponent },
  { path: 'organisation/:uuid', component: OrganisationDetailsPageComponent },
  { path: 'organisation/:uuid/edit', component: OrganisationEditPageComponent },
  { path: 'organisation/:uuid/members', component: OrganisationMembersPageComponent },
  { path: '**', redirectTo: '/index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
