import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod'
import { Observable } from 'rxjs';

let url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private httpClient: HttpClient) { }
  // Get User List
  getUsersList(){
    return this.http.get(url + "user");
  }

  // Add User
  addUser(data):Observable<any>{
    console.log('data',data);
    return this.http.post(url + "user", data);
}

 // Update User
updateUser(data):Observable<any> {
    console.log('data',data);
    return this.http.put(url + "user", data);
}
 
// Delete User
deleteUser(data):Observable<any> {
    return this.http.delete(url + "user/"+data);
}
}
