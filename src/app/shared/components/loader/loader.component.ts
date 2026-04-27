import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="loader.loading$ | async">
      <div class="loader-spinner"></div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(2px);
    }
    .loader-spinner {
      width: 48px;
      height: 48px;
      border: 5px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
