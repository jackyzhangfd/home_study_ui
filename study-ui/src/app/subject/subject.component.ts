import { Component, OnInit, Input } from '@angular/core';
import {FormControl} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';

import {Subject} from '../subject';
import {SubjectDto} from '../dto/subjectdto';
import {SubjectService} from '../subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  
  @Input() subject: Subject;
  private isNew : boolean;
  
  private theDate : FormControl;

  private uploader:FileUploader = new FileUploader({    
    url: "subject/uploadFile",  
    method: "POST",    
    itemAlias: "uploadedfile",
    autoUpload: false,
    queueLimit:1,
    allowedFileType:["image"]
  });

  constructor(
    private subjectService : SubjectService,
	  private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.theDate = new FormControl();
    if(id > 0){
      this.isNew = false;
      this.getSubject();
    }else{
      this.isNew = true;
      this.subject = new Subject();
      //this.subject.lastUpdateDate = new Date();
      this.subject.category = "ZONGHE";
    }
  };
  
  getSubject(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id)
      .subscribe(returnnedsubject => this.handleReturnedSubject(returnnedsubject));
  }
  
  save(): void {
    if(this.isNew){
      this.subjectService.addSubject(this.subject)
        .subscribe(returnnedsubject => this.handleReturnedSubject(returnnedsubject));
    }else{
      this.subjectService.updateSubject(this.subject)
        .subscribe(returnnedsubject => this.handleReturnedSubject(returnnedsubject));
    }
    
  }
 
  goBack(): void {
    this.location.back();
  }

  selectedFileOnChanged() {
    var fileReader = new FileReader();
    var f = this.uploader.queue.pop();
    if(f){
      fileReader.readAsDataURL(f._file);
      var that = this;
      fileReader.onload = function (e) {
        that.subject.pictureBase64 = this.result;
        that.subjectService.extractTextFromPicture("picture", that.subjectService.base64ToBlob(that.subject.pictureBase64, 'image/png'))
          .subscribe((texts:string) => that.handleReturnedText(texts));
      };
    }
  }

  handleReturnedText(texts:string){
    if(texts){
      if(!this.subject.name || this.subject.name.length == 0){
        if(texts.length > 10){
          this.subject.name = texts.substr(0,10);
        }else if(texts.length > 0){
          this.subject.name = texts;
        }else{
          this.subject.name = '无题';
        }
      }
      this.subject.content = texts;
    }else{
      //no texts
    }
  }

  handleReturnedSubject(subjectDto:SubjectDto){
    this.subject = new Subject();
    if(subjectDto){
      this.subject.id = subjectDto.id;
      this.subject.name = subjectDto.name;
      this.subject.content = subjectDto.detail;
      this.subject.category = subjectDto.category;
      this.subject.lastUpdateDate = subjectDto.lastChangedDate;

      if(subjectDto.imageBytes){
        //alert(subjectDto.imageBytes.length);
        this.subject.pictureBase64 = "data:image/png;base64," + subjectDto.imageBytes;
      }
      
      if(this.subject.lastUpdateDate){
        this.theDate = new FormControl(new Date(this.subject.lastUpdateDate));
      }
      
    }
  }
}

