import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchTerm : string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { 

  }

  ngOnInit() {
  }
 
  search():void{
    if(!this.searchTerm || this.searchTerm.length == 0){
      return;
    }
    this.router.navigate(["/search/" + this.searchTerm ]);
  }
}
