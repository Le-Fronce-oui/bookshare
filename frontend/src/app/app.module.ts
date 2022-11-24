import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './components/pages/index-page/index-page.component';
import { BookSearchPageComponent } from './components/pages/book-search-page/book-search-page.component';
import { BookDetailsPageComponent } from './components/pages/book-details-page/book-details-page.component';
import { UserDetailsPageComponent } from './components/pages/user-details-page/user-details-page.component';
import { UserEditPageComponent } from './components/pages/user-edit-page/user-edit-page.component';
import { OrganisationSearchPageComponent } from './components/pages/organisation-search-page/organisation-search-page.component';
import { OrganisationDetailsPageComponent } from './components/pages/organisation-details-page/organisation-details-page.component';
import { OrganisationMembersPageComponent } from './components/pages/organisation-members-page/organisation-members-page.component';
import { HeaderFooterTemplateComponent } from './components/templates/header-footer-template/header-footer-template.component';
import { SigninPageComponent } from './components/pages/signin-page/signin-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    BookSearchPageComponent,
    BookDetailsPageComponent,
    UserDetailsPageComponent,
    UserEditPageComponent,
    OrganisationSearchPageComponent,
    OrganisationDetailsPageComponent,
    OrganisationMembersPageComponent,
    HeaderFooterTemplateComponent,
    SigninPageComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
