import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { CalendarMode } from 'ionic2-calendar';
import { FirebaseService } from 'src/app/services/firebase.service';



@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent  implements OnInit {
  @Input() event: any;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {}

  @ViewChild(IonModal) modal: IonModal;

  showCalender = false;
  formattedDate: string;

  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date().toISOString().split('T')[0],
    formatWeekTitle: `MMM 'uge' w`,
  };

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  save() {
    this.modal.dismiss('', 'confirm');
    this.firebaseService.updateEvent(this.event.eventId, this.event);
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
