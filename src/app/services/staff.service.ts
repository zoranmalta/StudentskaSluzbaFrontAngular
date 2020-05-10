import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Staff } from '../model/staff';
import { Observable } from 'rxjs';
import { threadId } from 'worker_threads';


@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private readonly findStaffAllReverseUrl=`${environment.apiBaseUri}/staff/allreverse`
  private readonly findAllStaffUrl=`${environment.apiBaseUri}/staff/all`
  private readonly findStaffByUserUrl=`${environment.apiBaseUri}/staff/user`
  private readonly insertStaffUrl=`${environment.apiBaseUri}/staff/insert`
  private readonly updateStaffUrl=`${environment.apiBaseUri}/staff/update`
  private readonly deleteStaffUrl= `${environment.apiBaseUri}/staff/delete`

  constructor(private http:HttpClient) { }

  getAllStaff():Observable<Staff[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Staff[]>(this.findAllStaffUrl,{headers})
  }

  getStaffByUser(userId:number):Observable<Staff>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Staff>(`${this.findStaffByUserUrl}/${userId}`,{headers})
  }

  getStaffNotEngagedByCourseId(courseId:number):Observable<Staff[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Broj poslat na server sa adresom"+courseId);
    const staffByCourseUrl=`${this.findStaffAllReverseUrl}/${courseId}`
    return this.http.get<Staff[]>(staffByCourseUrl,{headers});
  }

  insertStaffAndUser(row:any):Observable<Staff>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("StaffForm objekat poslat na server : "+row);
    return this.http.post<Staff>(this.insertStaffUrl,row,{headers})
  }

  updateStaff(row:any):Observable<Staff>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("StaffForm objekat poslat na server za update : "+row);
    return this.http.put<Staff>(this.updateStaffUrl,row,{headers})
  }

  deleteStaffAndUser(staff:Staff):Observable<Staff>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("StaffForm objekat poslat na server za delete : "+staff);
    return this.http.put<Staff>(this.deleteStaffUrl,staff,{headers})
  }

}
