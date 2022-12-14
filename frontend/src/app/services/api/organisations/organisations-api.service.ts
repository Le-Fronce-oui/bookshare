import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BookInOrgDTO from 'src/app/classes/dto/books/in_org';
import ShortOrganisationDTO from 'src/app/classes/dto/organisations/short';
import OrganisationDTO from 'src/app/classes/dto/organisations/full';

@Injectable({
  providedIn: 'root'
})
export class OrganisationsApiService {

  constructor(private http: HttpClient) { }

  public getOrganisations(callback: (response: ShortOrganisationDTO[]) => void) {
    this.http.get<ShortOrganisationDTO[]>('/api/organisations/short')
      .subscribe(callback);
  }

  public getOrganisation(org_id: string, callback: (response: OrganisationDTO | null) => void) {
    this.http.get<OrganisationDTO>("/api/organisation/" + org_id)
      .subscribe(callback, error => {
        if(error.status === 404) {
          callback(null);
        } else { throw error; }
      });
  }


  public joinOrganisation(org_id: string, user_id: string, callback: (ok: boolean) => void) {
    this.http.post("/api/organisation/" + org_id + "/join/" + user_id, null, { responseType: 'text' })
      .subscribe(_ => callback(true), error => {
        if(error.status === 400) {
          callback(false);
        } else { throw error; }
      });
  }

  public leaveOrganisation(org_id: string, user_id: string, callback: (ok: boolean) => void) {
    this.http.post("/api/organisation/" + org_id + "/leave/" + user_id, null, { responseType: 'text' })
      .subscribe(_ => callback(true), error => {
        if(error.status === 400) {
          callback(false);
        } else { throw error; }
      });
  }


  public getBookInOrg(book_id: string, org_id: string, callback: (response: BookInOrgDTO[]) => void, onError: () => void) {
    this.http.get<BookInOrgDTO[]>("/api/organisation/" + org_id + "/book/" + book_id)
      .subscribe(callback, error => {
        if(error.status === 404) {
          onError();
        } else { throw error; }
      });
  }

}
