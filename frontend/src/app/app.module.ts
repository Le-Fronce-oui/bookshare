import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

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
import { UserListPageComponent } from './components/pages/user-list-page/user-list-page.component';
import { MessageService } from 'primeng/api';
import { SimpleDialogTemplateComponent } from './components/templates/simple-dialog-template/simple-dialog-template.component';

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
    LoginPageComponent,
    UserListPageComponent,
    SimpleDialogTemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    PanelModule,
    ToastModule,
    DialogModule,
    ButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
