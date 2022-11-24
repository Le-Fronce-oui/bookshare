import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit-page.component.html',
  styleUrls: ['./user-edit-page.component.css']
})
export class UserEditPageComponent implements OnInit {

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
