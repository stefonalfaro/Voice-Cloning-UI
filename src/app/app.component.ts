import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http'; // Include HttpClient
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatButtonModule, // For the button
    MatFormFieldModule, // For the form field
    MatInputModule, // For matInput directive
    FormsModule, // For ngModel binding
    HttpClientModule, // HttpClientModule is needed for HttpClient
    CommonModule,
    MatProgressSpinnerModule
  ],
  standalone: true 
})
export class AppComponent {
  file: File | null = null;
  text = '';
  speed = 1.5;
  audioSrc: string | null = null;
  isLoading = false; // Add this line

  // Define the API URL and HTTP options
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': environment.authToken
    }),
    responseType: 'blob' as 'json' // Necessary for receiving a blob response
  };

  constructor(private http: HttpClient) {} // Inject HttpClient directly

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  submit() {
    if (!this.file) return;

    this.isLoading = true; // Start loading

    const formData = new FormData();
    formData.append('voiceSampleToClone', this.file);
    formData.append('text', this.text);
    formData.append('speed', this.speed.toString());

    // Correctly setting responseType and casting the response to a Blob
    this.http.post<Blob>(this.apiUrl, formData, { headers: this.httpOptions.headers, responseType: 'blob' as 'json' })
        .subscribe(response => {
            // Now TypeScript knows `response` is a Blob
            if (this.audioSrc) {
                URL.revokeObjectURL(this.audioSrc);
            }
            this.audioSrc = URL.createObjectURL(response); // `response` is now correctly typed as Blob
            this.isLoading = false; // Also stop loading on error
        });
  }
}
