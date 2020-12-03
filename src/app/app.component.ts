import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigService } from './config.service';
import { Poi } from './poi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  displayedColumns = ['id', 'name', 'amenity'];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  elements: Poi[] = [];

  constructor(public service: ConfigService) { }

  ngAfterViewInit() {
    this.service.getPOIs().subscribe(e => {
      this.elements = e;
      this.isLoadingResults = false;
      this.resultsLength = e.length;
    });

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

}
