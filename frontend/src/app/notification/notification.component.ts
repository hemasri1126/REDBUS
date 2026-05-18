import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {

  constructor(
    private notificationService:NotificationService
  ){}

  notifications:any[] = [];

  allNotifications:any[] = [];

  emailEnabled = true;

  pushEnabled = true;

  promoEnabled = false;

  selectedLanguage = 'English';

  ngOnInit(){

    this.getAllNotifications();

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
}