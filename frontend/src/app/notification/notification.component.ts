import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { io } from 'socket.io-client';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {

 constructor(

  private notificationService:NotificationService,

  private translate:TranslateService

){

  translate.setTranslation('en',{

    NOTIFICATIONS:'Notifications',
    CREATE_NOTIFICATION:'Create Notification',
    JOURNEY_REMINDER:'Journey Reminder',
    PROMOTIONAL_OFFER:'Promotional Offer',
    CANCELLATION_ALERT:'Cancellation Alert',
    EMAIL_NOTIFICATIONS:'Email Notifications',
    PUSH_NOTIFICATIONS:'Push Notifications',
    PROMOTIONAL_NOTIFICATIONS:'Promotional Notifications',
    LANGUAGE:'Language'

  });

  translate.setTranslation('hi',{

    NOTIFICATIONS:'सूचनाएं',
    CREATE_NOTIFICATION:'सूचना बनाएं',
    JOURNEY_REMINDER:'यात्रा अनुस्मारक',
    PROMOTIONAL_OFFER:'प्रमोशनल ऑफर',
    CANCELLATION_ALERT:'रद्द अलर्ट',
    EMAIL_NOTIFICATIONS:'ईमेल सूचनाएं',
    PUSH_NOTIFICATIONS:'पुश सूचनाएं',
    PROMOTIONAL_NOTIFICATIONS:'प्रमोशनल सूचनाएं',
    LANGUAGE:'भाषा'

  });

  translate.setTranslation('te',{

    NOTIFICATIONS:'నోటిఫికేషన్లు',
    CREATE_NOTIFICATION:'నోటిఫికేషన్ సృష్టించండి',
    JOURNEY_REMINDER:'ప్రయాణ రిమైండర్',
    PROMOTIONAL_OFFER:'ప్రచార ఆఫర్',
    CANCELLATION_ALERT:'రద్దు హెచ్చరిక',
    EMAIL_NOTIFICATIONS:'ఇమెయిల్ నోటిఫికేషన్లు',
    PUSH_NOTIFICATIONS:'పుష్ నోటిఫికేషన్లు',
    PROMOTIONAL_NOTIFICATIONS:'ప్రచార నోటిఫికేషన్లు',
    LANGUAGE:'భాష'

  });

  translate.setDefaultLang('en');

  translate.use('en');

}

  notifications:any[] = [];

  allNotifications:any[] = [];

  emailEnabled = true;

  pushEnabled = true;

  promoEnabled = false;

  selectedLanguage = 'English';
socket:any;
  ngOnInit(){

    this.getAllNotifications();
    this.requestNotificationPermission();
this.socket = io('http://localhost:5000');

this.socket.on(
  'newNotification',
  (data:any)=>{

    console.log(data);

    this.getAllNotifications();

  }
);
  }

  /* GET NOTIFICATIONS */

  getAllNotifications(){

    this.notificationService.getNotifications()
    .subscribe((data:any)=>{

      this.allNotifications = data.reverse();

      this.notifications = this.allNotifications;

    });

  }

  /* MARK AS READ */

  markAsRead(notification:any){

    notification.status = 'read';

    this.notificationService
    .updateNotification(
      notification._id,
      notification
    )
    .subscribe(()=>{

      this.getAllNotifications();

    });

  }

  /* CREATE BOOKING NOTIFICATION */

  createSampleNotification(){

    const notification = {

      title:'Booking Confirmed',

      message:'Your Hyderabad to Bangalore booking is confirmed.',

      status:'unread',

      type:'booking',

      language:this.selectedLanguage

    };

    this.notificationService
    .createNotification(notification)
    .subscribe(()=>{

      this.getAllNotifications();

    });
    new Notification(

  notification.title,

  {

    body:notification.message

  }

);

  }

  /* SHOW JOURNEY REMINDERS */

  createJourneyReminder(){

    this.notifications =
    this.allNotifications.filter(
      (notification:any)=>

      notification.type === 'reminder'
    );

  }

  /* SHOW OFFERS */

  createOfferNotification(){

    this.notifications =
    this.allNotifications.filter(
      (notification:any)=>

      notification.type === 'offer'
    );

  }

  /* SHOW CANCELLATIONS */

  createCancellationNotification(){

    this.notifications =
    this.allNotifications.filter(
      (notification:any)=>

      notification.type === 'cancellation'
    );
    

  }
/* SHOW ALL */

showAllNotifications(){

  this.notifications = this.allNotifications;

}

/* DELETE NOTIFICATION */

deleteNotification(id:any){

  this.notificationService
  .deleteNotification(id)
  .subscribe(()=>{

    this.getAllNotifications();

  });

}
requestNotificationPermission(){

  if("Notification" in window){

    Notification.requestPermission();

  }

}
changeLanguage(event:any){

  const language = event.target.value;

  if(language === 'English'){

    this.translate.use('en');

  }

  else if(language === 'Hindi'){

    this.translate.use('hi');

  }

  else if(language === 'Telugu'){

    this.translate.use('te');

  }

}
}