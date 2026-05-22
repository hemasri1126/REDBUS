import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

@Injectable({
  providedIn:'root'
})

export class RoutePlannerService{

  api =
  'http://localhost:5000/routes';

  constructor(

    private http:HttpClient

  ){}

  saveRoute(route:any){

    return this.http.post(

      `${this.api}/save`,

      route

    );

  }

  getRoutes(){

    return this.http.get(this.api);

  }
deleteRoute(id:any){

  return this.http.delete(

    `${this.api}/${id}`

  );

}
}
