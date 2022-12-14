import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';

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
import { ErrorHandlingService } from './services/error-handling.service';
import { BookCardComponent } from './components/generic/cards/book-card/book-card.component';
import { BookFilterPipePipe } from './pipes/book-filter-pipe.pipe';
import { FieldFilterPipe } from './pipes/field-filter.pipe';
import { UserListPageRowComponent } from './components/pages/user-list-page/specific/user-list-page-row/user-list-page-row.component';
import { OrgListPageRowComponent } from './components/pages/organisation-search-page/specific/org-list-page-row/org-list-page-row.component';
import { FieldBooleanPipe } from './pipes/field-boolean.pipe';

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
    SimpleDialogTemplateComponent,
    BookCardComponent,
    BookFilterPipePipe,
    FieldFilterPipe,
    UserListPageRowComponent,
    OrgListPageRowComponent,
    FieldBooleanPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    FieldsetModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    ToggleButtonModule,
    TableModule,
    DividerModule
  ],
  providers: [
    MessageService,
    { provide: ErrorHandler, useClass: ErrorHandlingService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
