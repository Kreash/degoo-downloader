import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AppStateService } from '../services/app-state.service';
import { ApiService } from '../services/api.service';
import { FileModel, GetFilesResponse } from '../models/dto.model';
import { SyncService } from '../services/sync.service';
import { DownloaderService } from '../services/downloader.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  protected rootFolders: FileModel[] = [];

  protected openedFolder: FileModel | undefined;

  protected openedFoldersStack: FileModel[] = [];

  protected isDownloadingErrors: boolean = true;

  constructor(
    private stateService: AppStateService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private syncService: SyncService,
    private downloaderService: DownloaderService
  ) {}

  ngOnInit() {
    this.isDownloadingErrors = this.stateService.isDownloadingErrors;
    this.syncService.syncDownloadErrorsStatus.subscribe((status) => {
      this.isDownloadingErrors = status;
      this.cdr.markForCheck();
    });

    this.apiService.getFilesShort().then((result: GetFilesResponse) => {
      console.log('rootFolders', result);
      this.rootFolders = result.Items;
      this.cdr.markForCheck();
    });
  }

  protected goBackOut(folderParentId: string) {
    if (this.openedFoldersStack.length > 0) {
      const folder = this.openedFoldersStack.pop();
      this.openedFolder = folder;
    } else {
      this.openedFolder = undefined;
    }

    this.cdr.markForCheck();
  }

  openFolder(folder: FileModel) {
    this.openedFoldersStack.push(folder);
    this.openedFolder = folder;
    this.cdr.markForCheck();
  }

  downloadErrors() {
    this.downloaderService.downloadFilesWithErrors();
  }
}
