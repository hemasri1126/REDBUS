import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { io } from 'socket.io-client';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {

  constructor(
    private notificationService:NotificationService,
    public languageService:LanguageService
  ){}

  notifications:any[] = [];

  allNotifications:any[] = [];

  emailEnabled = true;

  pushEnabled = true;

  promoEnabled = false;

  selectedLanguage = 'English';

  socket:any;

  translations:any = {};

  ngOnInit(){

    this.getAllNotifications();
this.loadPreferences();
    this.requestNotificationPermission();

    const savedLanguage =
    localStorage.getItem('language');

    if(savedLanguage){

      this.selectedLanguage =
      savedLanguage;

      this.setLanguage(savedLanguage);

    }

    else{

      this.setLanguage('English');

    }

    this.socket = io(
      'https://tedbus-backend.onrender.com'
    );

    this.socket.on(
      'newNotification',
      (data:any)=>{

        console.log(data);

        this.getAllNotifications();

      }
    );

  }

  /* LANGUAGE TRANSLATION */

  setLanguage(language:any){

    if(language === 'Hindi'){

      this.translations = {

        notifications:'सूचनाएं',

        create:'सूचना बनाएं',

        reminder:'यात्रा अनुस्मारक',

        offer:'प्रमोशनल ऑफर',

        cancel:'रद्द अलर्ट',

        mark:'पढ़ा हुआ चिन्हित करें',

        delete:'डिलीट',

        showall:'सभी दिखाएं',

        read:'पढ़ा हुआ',

        unread:'अपठित'

      };

    }

    else if(language === 'Telugu'){

      this.translations = {

        notifications:'నోటిఫికేషన్లు',

        create:'నోటిఫికేషన్ సృష్టించండి',

        reminder:'ప్రయాణ రిమైండర్',

        offer:'ప్రచార ఆఫర్',

        cancel:'రద్దు హెచ్చరిక',

        mark:'చదివినట్లు గుర్తించు',

        delete:'తొలగించు',

        showall:'అన్నీ చూపించు',

        read:'చదివినవి',

        unread:'చదవనివి'

      };

    }

    else{

      this.translations = {

        notifications:'Notifications',

        create:'Create Notification',

        reminder:'Journey Reminder',

        offer:'Promotional Offer',

        cancel:'Cancellation Alert',

        mark:'Mark as Read',

        delete:'Delete',

        showall:'Show All',

        read:'read',

        unread:'unread'

      };

    }

  }

  changeLanguage(event:any){

    const language = event.target.value;

    this.selectedLanguage = language;

    this.setLanguage(language);

    localStorage.setItem(
      'language',
      language
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

    let title = '';

    let message = '';

    if(this.selectedLanguage === 'Hindi'){

      title = 'बुकिंग कन्फर्म';

      message =
      'आपकी हैदराबाद से बैंगलोर बुकिंग कन्फर्म हो गई है।';

    }

    else if(this.selectedLanguage === 'Telugu'){

      title = 'బుకింగ్ నిర్ధారించబడింది';

      message =
      'మీ హైదరాబాద్ నుండి బెంగళూరు బుకింగ్ నిర్ధారించబడింది.';

    }

    else{

      title = 'Booking Confirmed';

      message =
      'Your Hyderabad to Bangalore booking is confirmed.';

    }

    const notification = {

      title:title,

      message:message,

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

    this.notifications =
    this.allNotifications;

  }

  /* DELETE NOTIFICATION */

  deleteNotification(id:any){

    this.notificationService
    .deleteNotification(id)
    .subscribe(()=>{

      this.getAllNotifications();

    });

  }

  /* PUSH NOTIFICATION */

  requestNotificationPermission(){

    if("Notification" in window){

      Notification.requestPermission();

    }

  }

  /* BOOKING CONFIRMATION */

createBookingNotification(){

  const notification = {

    title:'Booking Confirmed',

    message:
    'Your bus ticket has been successfully booked.',

    type:'booking',

    status:'unread',

    deliveryStatus:'Delivered',

    time:new Date()

  };

  this.notificationService
  .createNotification(notification)
  .subscribe(()=>{

    this.getAllNotifications();

  });

}
/* SCHEDULE CHANGE */

createScheduleNotification(){

  const notification = {

    title:'Schedule Changed',

    message:
    'Your departure time has been updated.',

    type:'schedule',

    status:'unread',

    deliveryStatus:'Delivered',

    time:new Date()

  };

  this.notificationService
  .createNotification(notification)
  .subscribe(()=>{

    this.getAllNotifications();

  });

}
savePreferences(){

localStorage.setItem(
'emailNotifications',
JSON.stringify(this.emailEnabled)
);

localStorage.setItem(
'pushNotifications',
JSON.stringify(this.pushEnabled)
);

localStorage.setItem(
'promoNotifications',
JSON.stringify(this.promoEnabled)
);

alert('Preferences Saved');

}

loadPreferences(){

const email =
localStorage.getItem('emailNotifications');

const push =
localStorage.getItem('pushNotifications');

const promo =
localStorage.getItem('promoNotifications');

if(email!==null)
this.emailEnabled=JSON.parse(email);

if(push!==null)
this.pushEnabled=JSON.parse(push);

if(promo!==null)
this.promoEnabled=JSON.parse(promo);

}
}