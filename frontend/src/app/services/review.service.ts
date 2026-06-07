import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReviewService {

  api = 'http://localhost:5000/reviews';

  constructor(
    private http: HttpClient
  ) {}

  addReview(review:any){

    return this.http.post(
      `${this.api}/add`,
      review
    );

  }

  getReviews(routeId:any){

    return this.http.get(
      `${this.api}/${routeId}`
    );

  }

  updateReview(id:any,data:any){

    return this.http.put(
      `${this.api}/${id}`,
      data
    );

  }
reportReview(id:any){

  return this.http.put(
    `${this.api}/report/${id}`,
    {}
  );

}
upvoteReview(id:any){

  return this.http.put(
    `${this.api}/upvote/${id}`,
    {}
  );

}
deleteReview(id:any){

  return this.http.delete(
    `${this.api}/${id}`
  );

}
}