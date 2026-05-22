import {
  Component,
  AfterViewInit
} from '@angular/core';

import * as L from 'leaflet';

import { RoutePlannerService }
from '../services/route-planner.service';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.css']
})

export class RoutePlannerComponent
implements AfterViewInit{

  map:any;

  start = '';

  destination = '';

  distance = '';

  travelTime = '';

  trafficStatus = '';

  delayMessage = '';

  savedRoutes:any[] = [];

  waypoints:any[] = [''];

  alternativeRoutes:any[] = [];

  constructor(

    private routePlannerService:
    RoutePlannerService

  ){}

  ngOnInit(){

    this.getSavedRoutes();

  }

  ngAfterViewInit(){

    setTimeout(()=>{

      this.loadMap();

    },500);

  }

  loadMap(){

    setInterval(()=>{

      if(
        this.trafficStatus ===
        'Heavy Traffic'
      ){

        this.delayMessage =
        '15 Minutes Delay Due To Congestion';

      }

      else if(
        this.trafficStatus ===
        'Moderate Traffic'
      ){

        this.delayMessage =
        '5 Minutes Delay Expected';

      }

      else{

        this.delayMessage =
        'No Delays';

      }

      const traffic = [

        'Low Traffic',

        'Moderate Traffic',

        'Heavy Traffic'

      ];

      const randomTraffic =

      traffic[
        Math.floor(
          Math.random()*traffic.length
        )
      ];

      this.trafficStatus =
      randomTraffic;

    },5000);

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

    this.loadMap();

    this.map.invalidateSize();

    /* START MARKER */

    L.marker([17.3850,78.4867])

    .addTo(this.map)

    .bindPopup(this.start)

    .openPopup();

    /* DESTINATION MARKER */

    L.marker([12.9716,77.5946])

    .addTo(this.map)

    .bindPopup(this.destination);

    /* ROUTE */

    const route = [

      [17.3850,78.4867],

      [12.9716,77.5946]

    ];

    /* FASTEST ROUTE */

    L.polyline(route as any,{

      color:'blue',

      weight:5

    }).addTo(this.map);

    /* LOW TRAFFIC ROUTE */

    L.polyline(

      [

        [17.3850,78.4867],

        [15.2993,74.1240],

        [12.9716,77.5946]

      ] as any,

      {

        color:'green',

        weight:5

      }

    ).addTo(this.map);

    /* SHORTEST ROUTE */

    L.polyline(

      [

        [17.3850,78.4867],

        [19.0760,72.8777],

        [12.9716,77.5946]

      ] as any,

      {

        color:'red',

        weight:5

      }

    ).addTo(this.map);

    /* ROUTE DETAILS */

    const routeDetails:any = {

      'delhi-jaipur':{

        distance:'281 KM',

        time:'5 Hours',

        traffic:'Low Traffic'

      },

      'mumbai-goa':{

        distance:'587 KM',

        time:'12 Hours',

        traffic:'Low Traffic'

      },

      'banglore-mysore':{

        distance:'145 KM',

        time:'3 Hours',

        traffic:'Low Traffic'

      },

      'chennai-pondicherry':{

        distance:'170 KM',

        time:'3.5 Hours',

        traffic:'Low Traffic'

      }

    };

    const key =

    this.start.toLowerCase()

    + '-'

    + this.destination.toLowerCase();

    if(routeDetails[key]){

      this.distance =
      routeDetails[key].distance;

      this.travelTime =
      routeDetails[key].time;

      this.trafficStatus =
      routeDetails[key].traffic;

    }

    else{

      this.distance =
      'Distance Not Available';

      this.travelTime =
      'Time Not Available';

      this.trafficStatus =
      'Traffic Data Unavailable';

    }

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

  getSavedRoutes(){

    this.routePlannerService
    .getRoutes()
    .subscribe((data:any)=>{

      this.savedRoutes = data;

    });

  }

  clearRoute(){

    this.start = '';

    this.destination = '';

    this.distance = '';

    this.travelTime = '';

    this.trafficStatus = '';

    this.delayMessage = '';

    this.alternativeRoutes = [];

    this.loadMap();

  }
deleteRoute(id:any){

  this.routePlannerService
  .deleteRoute(id)
  .subscribe(()=>{

    this.getSavedRoutes();

  });

}
}