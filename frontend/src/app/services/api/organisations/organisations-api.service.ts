import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BookInOrgDTO from 'src/app/classes/dto/books/in_org';

@Injectable({
  providedIn: 'root'
})
export class OrganisationsApiService {

  constructor(private http: HttpClient) { }

  public getBookInOrg(book_id: string, org_id: string, callback: (response: BookInOrgDTO[]) => void, onError: () => void) {
    this.http.get<BookInOrgDTO[]>("/api/organisation/" + org_id + "/book/" + book_id)
      .subscribe(callback, (error) => {
        if(error.status === 404) {
          onError();
        } else { throw error; }
      });
  }

}
