import { Component, signal } from '@angular/core';
import { Toast } from './toast/toast';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [Toast,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('login-app');
}
