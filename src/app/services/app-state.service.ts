import { Injectable } from '@angular/core';
import { LocalStorageManagerService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private pAccessToken: string | undefined;

  private pRefreshToken: string | undefined;

  constructor(private localStorageManager: LocalStorageManagerService) {}

  set accessToken(token: string) {
    this.pAccessToken = token;
    this.localStorageManager.setAccessToken(token);
  }

  get accessToken(): string {
    if (this.pAccessToken) {
      return this.pAccessToken;
    }

    const token = this.localStorageManager.getAccessToken();
    if (token) {
      this.pAccessToken = token;
      return token;
    }

    return '';
  }

  set refreshToken(token: string) {
    this.pRefreshToken = token;
    this.localStorageManager.setRefreshToken(token);
  }

  get refreshToken(): string {
    if (this.pRefreshToken) {
      return this.pRefreshToken;
    }

    const token = this.localStorageManager.getRefreshToken();
    if (token) {
      this.pRefreshToken = token;
      return token;
    }

    return '';
  }

  get isDownloadingErrors(): boolean {
    return this.localStorageManager.getErrorDowlodingFiles() !== null;
  }
}
