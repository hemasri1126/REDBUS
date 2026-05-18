import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CommunityService {
baseUrl = 'https://tedbus-backend.onrender.com/posts';

  constructor(private http:HttpClient) { }

  /* GET POSTS */

  getPosts(){

    return this.http.get(this.baseUrl);

  }

  /* CREATE POST */

  createPost(post:any){

    return this.http.post(this.baseUrl,post);

  }

  /* DELETE POST */

  deletePost(id:any){

    return this.http.delete(`${this.baseUrl}/${id}`);

  }

  /* UPDATE POST */

  updatePost(id:any,post:any){

    return this.http.put(`${this.baseUrl}/${id}`,post);

  }

}