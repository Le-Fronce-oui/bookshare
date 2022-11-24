import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrls: ['./user-details-page.component.css']
})
export class UserDetailsPageComponent implements OnInit {

  public user_id!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid == null) {
      // TODO probably redirect or something ?
      return;
    }
    this.user_id = uuid;
  }

}
