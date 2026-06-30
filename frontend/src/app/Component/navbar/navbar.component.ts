import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
declare var google:any;

import { CustomerService } from '../../service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(
  private router:Router,
  private customerservice:CustomerService,
  public languageService:LanguageService
){}
changeLanguage(event:any){

  this.languageService.changeLanguage(
    event.target.value
  );

}
  isloggedIn:boolean = false;

  isDarkMode = false;

  ngOnInit(): void {

    /* LOGIN CHECK */
    if(sessionStorage.getItem("Loggedinuser")){

      this.isloggedIn = true;

    }
    else{

      this.isloggedIn = false;

    }

    /* DARK MODE LOAD */
    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark'){

      this.isDarkMode = true;

      document.body.classList.add('dark-theme');

    }

    /* GOOGLE LOGIN */
    google.accounts.id.initialize({

      client_id:"127875725365-lh12knucaq0brnmi6q70rrtrjnb8vimh.apps.googleusercontent.com",

      callback:(response:any)=>{

        this.handlelogin(response);

      }

    });

  }

  ngAfterViewInit():void{

    this.rendergooglebutton();

  }

  private rendergooglebutton():void{

    const googlebtn =
    document.getElementById('google-btn');

    if(googlebtn){

      google.accounts.id.renderButton(
        googlebtn,
        {
          theme:'outline',
          size:'medium',
          shape:'pill',
          width:150
        }
      );

    }

  }

  private decodetoken(token:String){

    return JSON.parse(
      atob(token.split(".")[1])
    );

  }

  handlelogin(response:any){

    const payload =
    this.decodetoken(response.credential);

    this.customerservice
    .addcustomermongo(payload)
    .subscribe({

      next:(response)=>{

        sessionStorage.setItem(
          "Loggedinuser",
          JSON.stringify(response)
        );

      },

      error:(error)=>{

        console.error(error);

      }

    });

  }

  handlelogout(){

    google.accounts.id.disableAutoSelect();

    sessionStorage.removeItem(
      'Loggedinuser'
    );

    window.location.reload();

  }

  navigate(route:string){

    this.router.navigate([route]);

  }

  /* DARK MODE TOGGLE */

  toggleTheme(){

    this.isDarkMode = !this.isDarkMode;

    if(this.isDarkMode){

      document.body.classList.add(
        'dark-theme'
      );

      localStorage.setItem(
        'theme',
        'dark'
      );

    }
    else{

      document.body.classList.remove(
        'dark-theme'
      );

      localStorage.setItem(
        'theme',
        'light'
      );

    }

  }

}