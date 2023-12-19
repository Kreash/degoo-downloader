import { Injectable } from '@angular/core';

enum LocalStorageKeys {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
  errorDowlodingFiles = 'errorDowlodingFiles',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageManagerService {
  constructor() {}

  public setErrorDowlodingFiles(files: string[]): void {
    this.set(LocalStorageKeys.errorDowlodingFiles, files);
  }

  public getErrorDowlodingFiles(): string[] | null {
    return this.get(LocalStorageKeys.errorDowlodingFiles);
  }

  public setAccessToken(token: string): void {
    this.set(LocalStorageKeys.accessToken, token);
  }

  public getAccessToken(): string | null {
    return this.get(LocalStorageKeys.accessToken);
  }

  public setRefreshToken(token: string): void {
    this.set(LocalStorageKeys.refreshToken, token);
  }

  public getRefreshToken(): string | null {
    return this.get(LocalStorageKeys.refreshToken);
  }

  public get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  public set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
