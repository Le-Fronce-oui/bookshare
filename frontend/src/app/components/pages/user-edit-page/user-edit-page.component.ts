import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit-page.component.html',
  styleUrls: ['./user-edit-page.component.css']
})
export class UserEditPageComponent implements OnInit {

  public user_id!: string;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(!this.userService.isConnected()) {
      this.router.navigate(['/user/' + uuid]);
      return;
    }
    if(this.userService.getUuid() != uuid) {
      this.router.navigate(['/user/' + this.userService.getUuid()]);
      return;
    }
    this.user_id = uuid;
  }

}
