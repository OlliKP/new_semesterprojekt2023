import { Component, OnInit } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  Auth,
  updateProfile,
} from '@angular/fire/auth';
import { Router, RouterConfigOptions } from '@angular/router';

@Component({
  selector: 'app-opret',
  templateUrl: './opret.page.html',
  styleUrls: ['./opret.page.scss'],
})
export class OpretPage implements OnInit {
  user = {
    name: '',
    email: '',
    password: '',
  };

  isLoading = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {}

  // Funktion til oprettelse af en bruger. Aktiverer indlæsningsstatus, opretter en ny bruger med angivet email og adgangskode,
  // opdaterer brugerprofilen med det angivne navn og navigerer til introduktionssiden efter en kort forsinkelse ved vellykket oprettelse.
  signUp() {
    // Aktiverer indlæsningsstatus under oprettelsesprocessen.
    this.isLoading = true;

    // Opretter en ny bruger med den angivne email og adgangskode.
    createUserWithEmailAndPassword(
      this.auth,
      this.user.email,
      this.user.password
    )
      .then((response) => {
        // Opdaterer brugerprofilen med det angivne navn.
        updateProfile(this.auth.currentUser, {
          displayName: this.user.name,
        }).then((updateResponse) => {
          // Navigerer til introduktionssiden efter en kort forsinkelse ved vellykket oprettelse.
          setTimeout(() => {
            this.router.navigate(['/introduction']);
          }, 1000);
        });
      })
      .catch((err) => {
        // Viser en fejlmeddelelse ved fejl under oprettelse og deaktiverer indlæsningsstatus.
        alert('Der skete en fejl! Prøv igen');
        this.isLoading = false;
      });
  }

  // Status
  isFormValid: boolean = false;

  // Check if all inputs are filled
  checkFormValidity() {
    this.isFormValid =
      !!this.user.name && !!this.user.email && !!this.user.password;
  }
}
