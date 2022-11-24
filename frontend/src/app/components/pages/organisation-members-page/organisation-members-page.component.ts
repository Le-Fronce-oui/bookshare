import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organisation-members-page',
  templateUrl: './organisation-members-page.component.html',
  styleUrls: ['./organisation-members-page.component.css']
})
export class OrganisationMembersPageComponent implements OnInit {

  public org_id!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid == null) {
      // TODO probably redirect or something ?
      return;
    }
    this.org_id = uuid;
  }

}
