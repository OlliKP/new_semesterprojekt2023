import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  message = '';
  samtaleId = this.activatedRoute.snapshot.paramMap.get('id');
  messages = [];
  userId = localStorage.getItem('token');
  event: any = '';
  chat: any = '';

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute
  ) {}
  private chatSubscription: Subscription;

  ngOnInit() {
    // Køres af sig selv lige efter constructor
    this.fetchChatMessages();
    this.fetchChat();
  }

  ngOnDestroy() {
    // Unsubscribe fra chat subscription når komponentet er destroyed
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  // Send besked
  sendMessage() {
    if (this.message === '') {
      return;
    }
    const record = {
      message: this.message,
      samtalerId: this.samtaleId,
      sender: localStorage.getItem('token'),
      time: new Date(),
    };

    this.firebaseService.createMessage(record).then((res) => {
      this.message = '';
    });
  }

  // Henter chat beskeder, som vi kan subscribe på
  fetchChatMessages() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    this.chatSubscription = this.firebaseService
      .readChatMessages(this.samtaleId)
      .subscribe((res) => {
        this.messages = res.map((doc) => ({
          message: doc.message,
          time: doc.time.seconds * 1000,
          sender: doc.sender,
        }));
      });
  }

  // Definerer hvilken klasse der skal sættes i html
  getMessageOuterDisplay(message) {
    if (message.sender !== this.userId) {
      return 'yours messages';
    } else {
      return 'mine messages';
    }
  }

  // Definerer hvilken klasse der skal sættes i html
  getMessageInnerDisplay(message) {
    if (message.sender !== this.userId) {
      return 'message last sender';
    } else {
      return 'message last reciever';
    }
  }

  // Funktion til at hente chatdata
  fetchChat() {
    this.firebaseService.readChat(this.samtaleId).subscribe((res) => {
      // Opdaterer chatvariabel med de hentede data fra Firestore
      this.chat = JSON.parse(JSON.stringify(res.payload.data()));

      // Henter event-ID fra den hentede chat og abonnerer på resultatet af event fra Firestore
      const eventId = this.chat.Opslag_ID;
      this.firebaseService.readEvent(eventId).subscribe((eventRes) => {
        // Opdaterer den lokale eventvariabel med de hentede data fra Firestore.
        this.event = JSON.parse(JSON.stringify(eventRes.payload.data()));
      });
    });
  }

  // Henter den anden person navn
  getOtherChatPersonName() {
    if (this.event.profilId !== localStorage.getItem('token')) {
      return this.event.displayName;
    } else {
      return this.chat.displayName;
    }
  }

  // Henter den anden person billede
  getOtherChatPersonPhotoURL() {
    if (this.event.profilId !== localStorage.getItem('token')) {
      return this.event.photoURL;
    } else {
      return this.chat.photoURL;
    }
  }
}
