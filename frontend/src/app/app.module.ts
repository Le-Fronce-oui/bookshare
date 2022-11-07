import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { BookSearchPageComponent } from './components/pages/book-search-page/book-search-page.component';
import { BookDetailsPageComponent } from './components/pages/book-details-page/book-details-page.component';
import { BookEditPageComponent } from './components/pages/book-edit-page/book-edit-page.component';
import { UserDetailsPageComponent } from './components/pages/user-details-page/user-details-page.component';
import { UserEditPageComponent } from './components/pages/user-edit-page/user-edit-page.component';
import { OrganisationSearchPageComponent } from './components/pages/organisation-search-page/organisation-search-page.component';
import { OrganisationDetailsPageComponent } from './components/pages/organisation-details-page/organisation-details-page.component';
import { OrganisationMembersPageComponent } from './components/pages/organisation-members-page/organisation-members-page.component';
import { OrganisationEditPageComponent } from './components/pages/organisation-edit-page/organisation-edit-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    BookSearchPageComponent,
    BookDetailsPageComponent,
    BookEditPageComponent,
    UserDetailsPageComponent,
    UserEditPageComponent,
    OrganisationSearchPageComponent,
    OrganisationDetailsPageComponent,
    OrganisationMembersPageComponent,
    OrganisationEditPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
