import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header-footer-template',
  templateUrl: './header-footer-template.component.html',
  styleUrls: ['./header-footer-template.component.css']
})
export class HeaderFooterTemplateComponent implements OnInit {

  static readonly REPO_URL = 'https://github.com/Le-Fronce-oui/bookshare';

  constructor(public readonly userService: UserService) { }

  public ngOnInit(): void {
  }

  public getUrl(): string {
    return HeaderFooterTemplateComponent.REPO_URL;
  }

}
