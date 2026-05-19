import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

baseUrl = 'https://tedbus-backend.onrender.com/notifications';

  constructor(private http:HttpClient) { }

  /* GET NOTIFICATIONS */

  getNotifications(){

    return this.http.get(this.baseUrl);

  }

  /* CREATE NOTIFICATION */

  createNotification(notification:any){

    return this.http.post(this.baseUrl,notification);

  }
/* UPDATE NOTIFICATION */

updateNotification(id:any,notification:any){

  return this.http.put(
    `${this.baseUrl}/${id}`,
    notification
  );

}
/* DELETE NOTIFICATION */

deleteNotification(id:any){

  return this.http.delete(
    `${this.baseUrl}/${id}`
  );

}
}