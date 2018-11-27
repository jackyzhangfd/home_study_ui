import { Injectable } from '@angular/core';
import {Subject} from './subject';
import {SubjectDto} from './dto/subjectdto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
//import {SUBJECTS} from './mock-subjects';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { post } from 'selenium-webdriver/http';

const httpOptions = {
	  headers: new HttpHeaders({ 
			'Content-Type': 'application/json', 
			'Access-Control-Allow-Origin' : '*' 
		})
};

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  
  //private subjectsUrl = 'api/subjects';  // URL to web api
	private subjectsUrl = 'http://localhost/study/api/v1/';
	
  constructor(
	private http: HttpClient,
	private messageService : MessageService) {
	
  };
	
	searchSubjects(searchTerm):Observable<SubjectDto[]>{
		return this.http.get<SubjectDto[]>(this.subjectsUrl + 'subject/search?searchTerm=' + searchTerm)
		.pipe(
			tap(subjects => this.log('searched subjects')),
			catchError(this.handleError('searchSubjects', []))
		);
	}

  getSubjects() : Observable<SubjectDto[]>{
	  
	  return this.http.get<SubjectDto[]>(this.subjectsUrl + 'subject/all')
		.pipe(
		  tap(subjects => this.log('fetched subjects')),
			catchError(this.handleError('getSubjects', []))
		);
  } ;
  
  getSubject(id: number) : Observable<SubjectDto>{
	  
		const url = `${this.subjectsUrl + 'subject/'}${id}`;
		return this.http.get<SubjectDto>(url).pipe(
			tap(_ => this.log(`fetched subject id=${id}`)),
			catchError(this.handleError<SubjectDto>(`getSubject id=${id}`))
		)
  };
  
  updateSubject(sub:Subject):Observable<SubjectDto>{
		let formData = new FormData();
		formData.append('imageFile', this.base64ToBlob(sub.pictureBase64,'image/png'), 'image');
		formData.append('title',sub.name);
		formData.append('category',sub.category);
		formData.append('detail',sub.content);

		return this.http.post<SubjectDto>(
			this.subjectsUrl + 'subject/' + sub.id, 
			formData, 
			{
				headers: new HttpHeaders({
					//'Content-Type': 'multipart/form-data'
				})
			}
		).pipe(
			tap(_ => this.log(`updated subject id=${sub.id}`)),
			catchError(this.handleError<SubjectDto>('updateSubject'))
		);
  };
  
  addSubject(sub:Subject):Observable<SubjectDto>{

		let formData = new FormData();
		formData.append('imageFile', this.base64ToBlob(sub.pictureBase64,'image/png'), 'image');
		formData.append('title',sub.name);
		if(sub.category){
			formData.append('category',sub.category);
		}
		formData.append('detail',sub.content);

		return this.http.post<SubjectDto>(
			this.subjectsUrl + 'subject/', 
			formData, 
			{
				headers: new HttpHeaders({
					//'Content-Type': 'multipart/form-data'
				})
			}
		).pipe(
			tap((sub : SubjectDto) => this.log(`added subject id=${sub.id}`)),
			catchError(this.handleError<SubjectDto>('addSubject'))
		);
  };
	
	extractTextFromPicture(fileName: string, pictureBase64:any): Observable<Object>{
		
		let formData = new FormData();
    formData.append('imageFile', pictureBase64, fileName);
		
		return this.http.post(
			this.subjectsUrl + "subject/extractTextFromImage", 
			formData,
			{
				headers: new HttpHeaders({ 
					//'Content-Type': 'multipart/form-data'
				}),
				responseType: 'text'
			}
		).pipe(
			tap( (resultText:string) => this.log(`read text from image: ${fileName}: ` + resultText)),
			catchError(this.handleError<Subject>('extract text from image'))
		);

	}

	public base64ToBlob(base64:any, type:string){
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for ( let i = 0; i < bytes.length ; i++){
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab], {type:mime});
	}
	
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

	  // TODO: send the error to remote logging infrastructure
	  console.error(error); // log to console instead

	  // TODO: better job of transforming error for user consumption
	  this.log(`${operation} failed: ${error.message}`);

	  // Let the app keep running by returning an empty result.
	  return of(result as T);
    };
  };

  private log(message: string) {
	  this.messageService.add(`SubjectService: ${message}`);
  }  
}
