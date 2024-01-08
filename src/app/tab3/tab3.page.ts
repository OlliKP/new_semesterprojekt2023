import { Component, ViewChild, OnInit, OnChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  events: any;
  user: any;

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit() {
    this.fetchOwnEvents();
  }

  // Henter ens egne oprettede events
  fetchOwnEvents() {
    const userId = localStorage.getItem('token');
    this.firebaseService.readEventsByUserId(userId).subscribe((data) => {
      this.events = data.map((e) => {
        return e;
      });
    });
  }

  // Hvordan 'antal personer' vises
  displayNumberOfPerson(event) {
    if (event.minPersons === event.maxPersons) {
      return event.minPersons;
    }
    return event.minPersons + ' - ' + event.maxPersons;
  }

  // Asynkron funktion - await, venter på at create() er kørt færdig
  // Laver en alert før den skal præsenteres
  async deleteAlert(event: any) {
    const alert = await this.alertController.create({
      header: 'Vil du slette "' + event.title + '"?',
      buttons: [
        {
          text: 'Nej',
          handler: () => {
            console.log('nej');
          },
        },
        {
          text: 'Ja',
          cssClass: 'alert-button-cancel',
          handler: () => {
            this.deleteEvent(event);
          },
        },
      ],
    });
    await alert.present();
  }

  // Slette event, gør brug af CRUD 
  deleteEvent(event: any): void {
    this.firebaseService.deleteEvent(event.eventId);
  }
}
