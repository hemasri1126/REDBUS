import {
  Component,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { ReviewService }
from '../services/review.service';
import * as L from 'leaflet';
import { LanguageService } from '../services/language.service';
import { RoutePlannerService }
from '../services/route-planner.service';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.css']
})

export class RoutePlannerComponent
implements OnInit, AfterViewInit {

  map:any;

  start = '';
  destination = '';

  distance = '';
  travelTime = '';
  trafficStatus = '';
  delayMessage = '';
  estimatedFare = '';

  savedRoutes:any[] = [];
  waypoints:any[] = [''];
  alternativeRoutes:any[] = [];
rating = 0;

reviewText = '';

reviews:any[] = [];

averageRating = 0;
constructor(
  private routePlannerService: RoutePlannerService,
  private reviewService: ReviewService,
  public languageService: LanguageService
){}

  ngOnInit(): void {
    this.getSavedRoutes();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadMap();
    }, 500);
  }

  loadMap(){

    if(this.map){
      this.map.remove();
    }

    this.map = L.map('map').setView(
      [20.5937,78.9629],
      5
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:'OpenStreetMap',
        maxZoom:18
      }
    ).addTo(this.map);

    setTimeout(()=>{
      this.map.invalidateSize();
    },500);
  }

  showRoute(){

    if(
      this.start.toLowerCase() === 'mumbai' &&
      this.destination.toLowerCase() === 'goa'
    ){
      this.distance = '587 KM';
      this.travelTime = '12 Hours';
    }

    else if(
      this.start.toLowerCase() === 'hyderabad' &&
      this.destination.toLowerCase() === 'bangalore'
    ){
      this.distance = '570 KM';
      this.travelTime = '9 Hours';
    }

    else if(
      this.start.toLowerCase() === 'delhi' &&
      this.destination.toLowerCase() === 'jaipur'
    ){
      this.distance = '281 KM';
      this.travelTime = '5 Hours';
    }

    else{
      this.distance = '500 KM';
      this.travelTime = '10 Hours';
    }

    this.trafficStatus = 'Heavy Traffic';

    this.delayMessage =
    '15 Minutes Delay Due To Congestion';

    this.alternativeRoutes = [
      {
        route:'Fastest Route',
        distance:'540 KM',
        time:'9 Hours',
        traffic:'Moderate Traffic'
      },
      {
        route:'Shortest Route',
        distance:'500 KM',
        time:'11 Hours',
        traffic:'Heavy Traffic'
      },
      {
        route:'Low Traffic Route',
        distance:'620 KM',
        time:'10 Hours',
        traffic:'Low Traffic'
      }
    ];

    const numericDistance =
    parseInt(this.distance);

    if(!isNaN(numericDistance)){
      const fare =
      numericDistance * 1.5;

      this.estimatedFare =
      '₹' + fare;
    }

    this.loadMap();

    L.marker([17.3850,78.4867])
      .addTo(this.map)
      .bindPopup(this.start)
      .openPopup();

    L.marker([12.9716,77.5946])
      .addTo(this.map)
      .bindPopup(this.destination);

    this.waypoints.forEach(
      (point:any,index:number)=>{

      if(point && point.trim() !== ''){

        L.marker([
          16 + index,
          77 + index
        ])
        .addTo(this.map)
        .bindPopup(point);

      }

    });

    L.polyline(
      [
        [17.3850,78.4867],
        [12.9716,77.5946]
      ] as any,
      {
        color:'blue',
        weight:5
      }
    ).addTo(this.map);

  }

  saveRoute(){

    const route = {
      start:this.start,
      destination:this.destination,
      distance:this.distance,
      travelTime:this.travelTime,
      trafficStatus:this.trafficStatus,
      delayMessage:this.delayMessage
    };

    this.routePlannerService
      .saveRoute(route)
      .subscribe(()=>{
        this.getSavedRoutes();
      });

  }

  toggleFavorite(route:any){

    route.favorite = !route.favorite;

  }

  getSavedRoutes(){

    this.routePlannerService
      .getRoutes()
      .subscribe((data:any)=>{

        this.savedRoutes = data;

      });

  }

  deleteRoute(id:any){

    this.routePlannerService
      .deleteRoute(id)
      .subscribe(()=>{

        this.getSavedRoutes();

      });

  }

  clearRoute(){

    this.start = '';
    this.destination = '';
    this.distance = '';
    this.travelTime = '';
    this.trafficStatus = '';
    this.delayMessage = '';
    this.estimatedFare = '';
    this.alternativeRoutes = [];

    this.loadMap();

  }

  addWaypoint(){

    this.waypoints.push('');

  }

submitReview(){

  const existingReview = this.reviews.find(
    (item:any)=>
    item.journeyId ===
    this.start + '-' +
    this.destination + '-001'
  );

  if(existingReview){

    alert('You have already reviewed this journey.');

    return;

  }

  if(this.reviewText.trim().length < 20){

    alert('Review must contain at least 20 characters.');

    return;

  }

  const verifiedUser = true;

  if(!verifiedUser){

    alert('Only verified users can review.');

    return;

  }

  const review = {

    routeId:
    this.start + '-' +
    this.destination,

    userId:'USER001',

    journeyId:
    this.start + '-' +
    this.destination +
    '-001',

    userName:'User',

    rating:this.rating,

    review:this.reviewText,

    verified:verifiedUser

  };

  this.reviewService
  .addReview(review)
  .subscribe({

    next:()=>{

      this.getReviews();

      this.reviewText='';

      this.rating=0;

      alert('Review Added');

    },

    error:(err)=>{

      alert(
        err.error?.message ||
        'Error adding review'
      );

    }

  });

}

getReviews(){

  const routeId =
  this.start + '-' +
  this.destination;

  this.reviewService
  .getReviews(routeId)
  .subscribe((data:any)=>{

    this.reviews = data;

    this.reviews.forEach(

      (review:any)=>{

        review.trustedReviewer =
        (review.upvotes || 0) >= 5;

      }

    );

    const visibleReviews =
    this.reviews.filter(

      (item:any)=>!item.hidden

    );

    const total =
    visibleReviews.reduce(

      (sum:any,item:any)=>

      sum + item.rating,

      0

    );

    this.averageRating =
      visibleReviews.length > 0
      ? total / visibleReviews.length
      : 0;

  });

}

editReview(review:any){

  const created =
  new Date(review.createdAt).getTime();

  const now =
  new Date().getTime();

  const hours =
  (now-created)/(1000*60*60);

  if(hours>24){

    alert(
      'Editing time expired.'
    );

    return;

  }

  const updatedReview =
  prompt(
    'Edit your review',
    review.review
  );

  if(!updatedReview){

    return;

  }

  this.reviewService
  .updateReview(

    review._id,

    {

      review:updatedReview

    }

  )

  .subscribe(()=>{

    this.getReviews();

  });

}
reportReview(review:any){

  this.reviewService
  .reportReview(review._id)
  .subscribe(()=>{

    this.getReviews();

    alert(
      'Review reported'
    );

  });

}
upvoteReview(review:any){

  this.reviewService
  .upvoteReview(review._id)
  .subscribe(()=>{

    this.getReviews();

  });

}
deleteReview(review:any){

  const confirmDelete =
  confirm(
    'Delete this review?'
  );

  if(confirmDelete){

    this.reviewService
    .deleteReview(
      review._id
    )
    .subscribe(()=>{

      this.getReviews();

    });

  }

}
}