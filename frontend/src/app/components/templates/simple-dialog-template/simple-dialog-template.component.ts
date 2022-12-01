import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-dialog-template',
  templateUrl: './simple-dialog-template.component.html',
  styleUrls: ['./simple-dialog-template.component.css']
})
export class SimpleDialogTemplateComponent implements OnInit {

  @Input() public title!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
