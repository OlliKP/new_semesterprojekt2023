import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { CalendarMode } from 'ionic2-calendar';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent {
  constructor(private firebaseService: FirebaseService, private auth: Auth) {}

  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date().toISOString().split('T')[0],
    formatWeekTitle: `MMM 'uge' w`,
  };

  event = {
    eventId: '',
    title: '',
    profilId: localStorage.getItem('token'),
    date: this.calendar.currentDate,
    description: '',
    location: '',
    category: '',
    minPersons: null,
    maxPersons: null,
    displayName: this.auth.currentUser?.displayName,
    photoURL: this.auth.currentUser?.photoURL,
  };

  @ViewChild(IonModal) modal: IonModal;

  showCalender = false;
  formattedDate: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Gemme det ny oprettet event, ved brug af createEvent()
  save() {
    this.event.profilId = this.auth.currentUser.uid;
    this.firebaseService.createEvent(this.event).then((response) => {});
    this.modal.dismiss('', 'confirm');
  }

  // Metoden 'datePicked' bruges til at håndtere valg af dato fra en kalender.
  // Den modtager en parameter ('value')
  // Først opdateres datoegenskaben for begivenheden ('this.event.date') ved at trække tidsdelen fra værdien.
  // Derefter formateres den valgte dato og gemmes i 'formattedDate' ved hjælp af 'format' fra date-fns-biblioteket.
  // Tilsidst skjules kalenderkomponenten ved at sætte 'showCalendar' til 'false'.
  datePicked(value: any) {
    this.event.date = value.split('T')[0];
    this.formattedDate = format(parseISO(value), 'MMM d, yyyy');
    this.showCalender = false;
  }
}
