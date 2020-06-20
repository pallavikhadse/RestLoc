import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public pageContent = {
    header : {
      title : 'About Restloc',
      strapline : ''
    },
    content : 'Restloc was created to help people find good restaurants and enjoy the best food and refreshments.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.'
  };

}
