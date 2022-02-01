import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-umfrage-list',
  templateUrl: './umfrage-list.component.html',
  styleUrls: ['../app.component.scss'],
})
export class UmfrageListComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit() {}
}
