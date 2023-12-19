import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Category, FileModel } from '../models/dto.model';
import { DownloaderService } from '../services/downloader.service';

@Component({
  selector: 'app-opened-folder',
  templateUrl: './opened-folder.component.html',
  styleUrl: './opened-folder.component.scss',
})
export class OpenedFolderComponent {
  protected pFolder!: FileModel;

  @Input() set folder(value: FileModel) {
    this.pFolder = value;
    this.getFilesInFolder(this.folder.ID);
  }

  get folder(): FileModel {
    return this.pFolder;
  }

  @Output() goBackOut = new EventEmitter<string>();

  @Output() openFolder = new EventEmitter<FileModel>();

  files: FileModel[] = [];

  downloadFromFile: string = '';

  constructor(
    private downloaderService: DownloaderService,
    private cdr: ChangeDetectorRef
  ) {}

  protected back() {
    this.goBackOut.emit(this.folder.ParentID);
  }

  protected openFolderEmit(folder: FileModel) {
    this.openFolder.emit(folder);
  }

  protected downloadAllFiles() {
    this.downloaderService.downloadFilesOneByOne(
      this.files,
      this.downloadFromFile
    );
  }

  protected fileIsFolder(file: FileModel) {
    return file.Category === Category.Folder;
  }

  private async getFilesInFolder(folderId: string) {
    this.files = [];
    this.downloaderService.getFilesInFolder(this.folder.ID).then((files) => {
      this.files = files;
      this.cdr.markForCheck();
    });
  }
}
