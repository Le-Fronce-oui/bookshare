import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-footer-template',
  templateUrl: './header-footer-template.component.html',
  styleUrls: ['./header-footer-template.component.css']
})
export class HeaderFooterTemplateComponent implements OnInit {

  static readonly REPO_URL = 'https://github.com/Le-Fronce-oui/bookshare';

  constructor() { }

  public ngOnInit(): void {
  }

  public getUrl(): string {
    return HeaderFooterTemplateComponent.REPO_URL;
  }

}
