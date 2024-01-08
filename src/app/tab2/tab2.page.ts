import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  chats = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Køres af sig selv lige efter constructor
    this.fetchChatsStartedByMe();
    this.fetchChatsStartedWithMe();
  }

  // Henter chats der er startet med "jeg" - altså af en anden, men med mig
  fetchChatsStartedWithMe() {
    this.firebaseService.readChatsStartedWithMe().subscribe((res) => {
      res.forEach((docs) => {
        docs.forEach((doc) => {
          this.chats.push(doc);
        });
      });
    });
  }

// Henter chats der er startet af "jeg"
  fetchChatsStartedByMe() {
    this.firebaseService.readChatsStartedByMe().subscribe((res) => {
      res.forEach((doc) => {
        this.chats.push(doc);
      });
    });
  }

  // Funktion til at refreshe indholdet
  handleRefresh(event) {
    setTimeout(() => {
      this.chats = [];
      this.fetchChatsStartedByMe();
      this.fetchChatsStartedWithMe();
      event.target.complete();
    }, 1000);
  }
}
