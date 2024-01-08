import { Component, OnInit } from '@angular/core';
import { signInWithEmailAndPassword, Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    name: '',
    email: '',
    password: '',
  };

  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  // Funktion til login. Aktiverer indlæsningsstatus, forsøger at logge ind med den angivne email og adgangskode,
  // og håndterer resultatet ved at gemme brugeroplysninger i lokal lagring og navigere til introduktionssiden efter en kort forsinkelse.
  login() {
    // Aktiverer indlæsningsstatus under login-processen.
    this.isLoading = true;

    // Forsøger at logge ind med den angivne email og adgangskode.
    signInWithEmailAndPassword(this.auth, this.user.email, this.user.password)
      .then((response) => {
        // Gemmer brugeroplysninger i lokal lagring.
        localStorage.setItem('displayName', response.user.displayName);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('token', response.user.uid);

        // Navigerer til introduktionssiden efter en kort forsinkelse.
        setTimeout(() => {
          this.router.navigate(['/introduction']);
        }, 1000);
      })
      .catch((err) => {
        // Deaktiverer indlæsningsstatus ved fejl under login og viser en fejlmeddelelse.
        this.isLoading = false;
        alert('Der skete en fejl! - Prøv igen');
      });
  }

  signInGoogle() {
    this.firebaseService.googleSignIn();
  }
}
