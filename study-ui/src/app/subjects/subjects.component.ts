import { Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {Subject} from '../subject';
import {SubjectDto} from '../dto/subjectdto';
import {SubjectService} from '../subject.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  
  subjects : Subject[];

  displayedColumns: string[] = ['id', 'name', 'category', 'lastUpdateDate'];
  
  dataSource = new MatTableDataSource<Subject>(this.subjects);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private subjectService : SubjectService,
    private route: ActivatedRoute,
    private location: Location
  ) { 
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    let searchTerm  = this.route.snapshot.paramMap.get('searchTerm');
	  this.getSubjects(searchTerm);
  }
  
  getSubjects(searchTerm ):void{
    if(searchTerm){
      this.subjectService.searchSubjects(searchTerm).subscribe(returnedsubjects => this.prepareSubjects(returnedsubjects));
    }else{
      this.subjectService.getSubjects().subscribe(returnedsubjects => this.prepareSubjects(returnedsubjects));
    }
  } 
  
  prepareSubjects(allSubjects : SubjectDto[]){
    this.subjects = [];
    for(let i = 0; i < allSubjects.length; i++){
      let sub : SubjectDto = allSubjects[i];
      let subject : Subject = new Subject();
      subject.id = sub.id;
      subject.name = sub.name;
      subject.category = sub.category;
      subject.lastUpdateDate = sub.lastChangedDate;
      this.subjects.push(subject);
    }

    this.dataSource = new MatTableDataSource<Subject>(this.subjects);
    this.dataSource.paginator = this.paginator;
  }

  formatDate(date: number){
    if(date){
      if(date > 0){
        let d : Date = new Date(date);
        return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      }
    }
  }

  formatCategory(category: string){
    switch(category){
      case 'SHUXUE': 
        return '数学';
      case 'YUWEN':
        return '语文';
      case 'YINGYU':
        return '英语';
      case 'ZONGHE':
        return '综合';
      default :
        return '未知';
    }
  }
}
