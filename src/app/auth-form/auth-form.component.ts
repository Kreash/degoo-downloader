import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  constructor(
    private stateService: AppStateService,
    private apiService: ApiService
  ) {}

  protected refreshToken: string = '';

  protected saveRefreshToken() {
    this.stateService.refreshToken = this.refreshToken;
    this.apiService.updateAccessToken();
  }
}
