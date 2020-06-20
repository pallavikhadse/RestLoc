import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RestlocDataService } from '../restloc-data.service';
import { Location } from '../location';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  constructor(
    private restlocDataService: RestlocDataService,
    private route: ActivatedRoute
  ) { }

  public newLocation: Location;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let id = params.get('locationId')
          return this.restlocDataService.getLocationById(id);
        })
      )
      .subscribe((newLocation: Location) => {
        this.newLocation = newLocation;
        this.pageContent.header.title = newLocation.name;
        this.pageContent.sidebar = `${newLocation.name} is on Restloc because it is one of the best rated review and best restaurants with different cuisines and reasonable prices.\n\nIf you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.`;
      });
  }

  public pageContent = {
    header: {
      title: '',
      strapline: ''
    },
    sidebar: ''
  };
}
