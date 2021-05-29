import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'stock-data',
  templateUrl: './stockData.component.html',
  styleUrls: ['./stockData.component.scss']
})
export class StockData implements OnInit {

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    
  }

  inputDate: String;
  responseData: any;
  noResultFound: Boolean = false;

  getData(){
    let url = 'https://jsonmock.hackerrank.com/api/stocks?date=' + this.inputDate;
    this.http.get(url).subscribe((response: any) => {
      if(response.data.length > 0){
        this.responseData = response.data[0];
        this.noResultFound = false;
      }else{
        this.responseData = null;
        this.noResultFound = true;
      }
    });
  }
}