import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-simple-dialog-template',
  templateUrl: './simple-dialog-template.component.html',
  styleUrls: ['./simple-dialog-template.component.css']
})
export class SimpleDialogTemplateComponent implements OnInit, OnDestroy {

  @Input() public title!: string;

  // Two-way binding on next path value
  @Input('nextPath')        public nextPath: string | null;
  @Output('nextPathChange') public sizeChange = new EventEmitter<string | null>();

  private connectionSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private notificationService: NotificationService) {
    this.nextPath = null;
    this.sizeChange.emit(this.nextPath);
  }

  public ngOnInit(): void {
    this.connectionSubscription = this.userService.observeConnected(connected => {
      if(connected) {
        if(this.nextPath === null) {
          this.setNextPath("/user/" + this.userService.getUuid());
        }
        this.notificationService.success("Logged in as " + this.userService.getUsername());
        this.router.navigate([this.nextPath], {replaceUrl: true});
      }
    });
    this.route.queryParams.subscribe(p => {
      if('next' in p) {
        this.setNextPath(p.next);
      }
    });
  }

  private setNextPath(nextPath: string): void {
    this.nextPath = nextPath;
    this.sizeChange.emit(nextPath);
  }

  public ngOnDestroy(): void {
      this.connectionSubscription.unsubscribe();
  }

}
