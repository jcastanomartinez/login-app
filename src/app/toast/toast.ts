import { Component } from '@angular/core';
import { Notification } from '../services/notification';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})



export class Toast {
  
 constructor (public notificationService:Notification){}
  


}
