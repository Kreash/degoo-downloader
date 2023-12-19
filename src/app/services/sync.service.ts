import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor() {}

  syncDownloadErrorsStatus: Subject<boolean> = new Subject<boolean>();
}
