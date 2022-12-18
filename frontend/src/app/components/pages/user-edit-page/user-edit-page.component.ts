import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import FullUserBookDTO from 'src/app/classes/dto/books/full_user';
import BookUpdatesDTO from 'src/app/classes/dto/books/updates';
import { Visibility } from 'src/app/classes/dto/enums';
import ShortUserOrganisationDTO from 'src/app/classes/dto/organisations/short_user';
import { ValidatedField } from 'src/app/classes/validated/validated-field';
import { ValidationGroup } from 'src/app/classes/validated/validation-group';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

interface ModifiableBook extends FullUserBookDTO {
  modified: boolean,
  deleted: boolean
}

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit-page.component.html',
  styleUrls: ['./user-edit-page.component.css']
})
export class UserEditPageComponent implements OnInit, OnDestroy {

  public user_id!: string;

  public username: string;
  public visibility: Visibility;
  public visible: boolean;
  public admin: boolean;
  public organisations: ShortUserOrganisationDTO[];
  public books: ModifiableBook[];

  public can_leave: boolean;
  public signout_dialog: boolean;

  public passwordGroup: ValidationGroup<string>;
  public old_password: ValidatedField<string>;
  public new_password: ValidatedField<string>;
  public confirm_password: ValidatedField<string>;

  public signout_password: ValidatedField<string>;

  public books_changed: boolean;

  private userSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private notif: NotificationService, private api: ApiService, private userService: UserService) {
    this.username = '';
    this.visibility = 'PUBLIC';
    this.visible = true;
    this.admin = false;
    this.organisations = [];
    this.books = [];
    this.can_leave = false;
    this.signout_dialog = false;
    this.passwordGroup = new ValidationGroup();
    this.old_password = new ValidatedField<string>('', v => v.length > 0);
    this.new_password = new ValidatedField<string>('', v => v.length >= 8);
    this.confirm_password = new ValidatedField<string>('', v => v.length > 0 && v == this.new_password.value);
    this.passwordGroup.addField(this.old_password);
    this.passwordGroup.addField(this.new_password);
    this.passwordGroup.addField(this.confirm_password);
    this.signout_password = new ValidatedField<string>('', v => v.length > 0);
    this.books_changed = false;
  }

  public ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');

    this.userSubscription = this.userService.whenInitialised(() => {
      console.log(this.userService.isConnected());
      if(!this.userService.isConnected()) {
        this.router.navigate(['/user/' + uuid]);
        return;
      }
      if(this.userService.getUuid() != uuid) {
        this.router.navigate(['/user/' + this.userService.getUuid()]);
        return;
      }
      this.user_id = uuid;
      this.updateFromApi();
    })
  }

  public updateFromApi() {
    this.api.users.getDetailedUser(this.user_id, user => {
      this.username = user.username;
      this.visibility = user.visibility;
      this.visible = this.visibility === 'PUBLIC';
      this.admin = user.role === 'ADMIN';
      this.organisations = user.organisations.sort((o1, o2) => o1.name.localeCompare(o2.name));
      this.books = user.books.sort((b1, b2) => b1.name.localeCompare(b2.name)).map(b => {
        let res = b as ModifiableBook;
        res.deleted = false;
        res.modified = false;
        return res;
      });
      this.can_leave = !user.active_loans && this.organisations.every(o => !o.owned);
      this.books_changed = false;
    });
  }


  // General profile settings

  public onChangePassword(): void {
    this.api.auth.changePassword(this.old_password.value, this.new_password.value, () => {
      this.notif.success("Password changed");
      this.passwordGroup.reset();
    }, () => {
      this.notif.error("Wrong password");
    });
  }

  public onSignout(): void {
    this.signout_dialog = true;
  }

  public onVisibilityChanged(event: Event & { checked: boolean }): void {
    const visibility: Visibility = event.checked ? 'PUBLIC' : 'RESTRICTED';
    this.api.users.setUserVisibility(this.user_id, visibility, () => {});
  }


  // Signout dialog

  public onSignoutConfirm(): void {
    this.api.auth.signout(this.signout_password.value, () => {
      this.notif.success("Account deleted");
      window.location.reload();
    }, () => {
      this.notif.error("Wrong password");
    })
  }


  // Organisations

  public onLeaveOrg(event: Event): void {
    if(!(event.target instanceof Element) || !event.target.hasAttribute('data-index')) {
      return;
    }
    const index = parseInt(event.target.getAttribute('data-index') as string);
    const org = this.organisations[index];
    this.api.organisations.leaveOrganisation(org.id, this.userService.getUuid(), ok => {
      this.organisations = this.organisations.filter((_, i) => i !== index);
      if(ok) {
        this.notif.success("Left organisation");
      } else {
        this.notif.warning("Already left organisation");
      }
      this.userService.refreshLogin();
    });
  }


  // Books

  public onDeleteBook(event: Event): void {
    if(!(event.target instanceof Element)) {
      return;
    }
    let target = event.target.parentElement?.parentElement;
    if(target?.nodeName === 'TD') {
      target = target.parentElement;
    }
    if(target === undefined || target == null || !target.hasAttribute('data-index')) {
      return;
    }
    const index = parseInt(target.getAttribute('data-index') as string);
    this.books[index].deleted = true;
    this.books_changed = true;
    target.remove();
  }

  public onBookOwnedChanged(event: { originalEvent: Event, value: number }): void {
    const index = this.getNumberInputIndex(event.originalEvent.target);
    if(index === null) {
      console.log(event.originalEvent.target)
      return;
    }
    let book = this.books[index];
    if(event.value <= 0) {
      event.value = 1;
      book.owned = 1;
    }
    if(book.shown > event.value || book.shown === book.owned) {
      book.shown = event.value;
    }
    this.books_changed = true;
    book.modified = true;
  }

  public onBookShownChanged(event: { originalEvent: Event, value: number }): void {
    const index = this.getNumberInputIndex(event.originalEvent.target);
    if(index === null) {
      return;
    }
    let book = this.books[index];
    if(event.value < 0) {
      event.value = 0;
      book.shown = 0;
    }
    if(event.value > book.owned) {
      book.shown = book.owned;
    }
    this.books_changed = true;
    book.modified = true;
  }

  private getNumberInputIndex(target: EventTarget | null): number | null {
    if(!(target instanceof Element)) {
      return null;
    }
    let row = target.closest('tr[data-index]');
    if(row === null) {
      return null;
    }
    return parseInt(row.getAttribute('data-index') as string);
  }

  public onSaveBooks(): void {
    const changes: BookUpdatesDTO = {
      delete: [],
      edit: []
    };
    for(let book of this.books) {
      if(book.deleted) {
        changes.delete.push(book.id);
      } else if(book.modified) {
        changes.edit.push({
          book_id: book.id,
          count: book.owned,
          shown: book.shown
        });
      }
    }
    this.api.users.updateCollection(this.user_id, changes, () => {
      this.userService.refreshLogin();
      this.updateFromApi();
    });
  }


  // OnDestroy

  public ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

}
