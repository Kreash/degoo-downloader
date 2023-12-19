import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FileModel } from '../models/dto.model';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LocalStorageManagerService } from './local-storage.service';
import { SyncService } from './sync.service';

@Injectable({
  providedIn: 'root',
})
export class DownloaderService {
  constructor(
    private apiService: ApiService,
    private localStorageManager: LocalStorageManagerService,
    private datePipe: DatePipe,
    private syncService: SyncService
  ) {}

  public downloadedAllFilesInFolder = new Subject<FileModel[]>();

  filesCache: FileModel[] | undefined;

  nextToken: string | undefined;

  downloadAllFilesInFolder() {}

  async getFilesInFolder(folderId: string) {
    const result = await this.getAllFilesInFolder(folderId);

    console.log('filesCache: ', result);
    return result;
  }

  private async getAllFilesInFolder(
    folderId: string,
    nextToken?: string,
    resulrArray: FileModel[] = []
  ) {
    const result = await this.apiService.getFilesShort(
      folderId,
      100,
      0,
      nextToken
    );

    resulrArray.push(...result.Items);

    if (result.NextToken) {
      await this.getAllFilesInFolder(folderId, result.NextToken, resulrArray);
    }

    return resulrArray;
  }

  async downloadFilesOneByOne(
    files: FileModel[],
    fromFileWithName: string = ''
  ) {
    if (fromFileWithName) {
      const fileIndex = files.findIndex(
        (file) => file.Name === fromFileWithName
      );
      files = files.slice(fileIndex);
    }

    this.downloadFilesOneByOneById(files.map((file) => file.ID));
  }

  async downloadFilesWithErrors() {
    const errors = this.localStorageManager.getErrorDowlodingFiles();
    if (errors) {
      await this.downloadFilesOneByOneById(errors);
    } else {
      this.syncService.syncDownloadErrorsStatus.next(false);
      console.log('Нет ошибок при загрузке');
    }
  }

  async downloadFilesOneByOneById(filesIds: string[]) {
    const successfullyDownloadedFiles: string[] = [];
    const filesDownloadedWithError: string[] = [];

    for (let i = 0; i < filesIds.length; i++) {
      const fileId = filesIds[i];
      await this.downloadSingleFileById(
        fileId,
        i,
        successfullyDownloadedFiles,
        filesDownloadedWithError
      );
    }

    if (filesDownloadedWithError.length) {
      this.localStorageManager.setErrorDowlodingFiles(filesDownloadedWithError);
      this.syncService.syncDownloadErrorsStatus.next(true);
    }

    console.log(
      `%cОшибки при загрузке`,
      'color: green',
      filesDownloadedWithError
    );
    console.log(
      `%cЗагруженные файлы`,
      'color: green',
      successfullyDownloadedFiles
    );
  }

  async downloadSingleFileById(
    id: string,
    index: number,
    successfullyDownloadedFiles: string[],
    filesDownloadedWithError: string[]
  ) {
    const fullFileModel = await this.apiService.getFile(id).catch((error) => {
      console.error(
        `При получении файла: ${id} произошла ошибка: ${error.message}`
      );
      filesDownloadedWithError.push(id);
      return undefined;
    });
    if (!fullFileModel) {
      return;
    }

    console.log(
      `%cНачалась загрузка файла ${index} ${fullFileModel.Name}`,
      'color: blue'
    );
    await this.downloadSingleFile(
      fullFileModel.URL,
      this.mapFileName(fullFileModel)
    )
      .then(() => {
        console.log(
          `%cФайл ${index} ${fullFileModel.Name} успешно загружен`,
          'color: green'
        );
        successfullyDownloadedFiles.push(fullFileModel.Name);
      })
      .catch((error) => {
        console.error(
          `При загрузке файла: ${fullFileModel.Name} произошла ошибка: ${error.message}`
        );
        filesDownloadedWithError.push(fullFileModel.ID);
      });
  }

  async downloadSingleFile(url: string, fileName: string) {
    return downloadFile(url, fileName).then((response) => {
      var blob = new Blob([response]);
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  }

  private mapFileName(file: FileModel) {
    const name = file.Name;
    const creationTime = new Date(file.CreationTime);
    /** name in format: YYYY-MM-DD_HH-mm-ss_name */
    const formattedName =
      this.datePipe.transform(creationTime, 'yyyy-MM-dd_HH-mm-ss') + '_' + name;
    return formattedName;
  }
}

function downloadFile(url: string, fileName: string) {
  return new Promise((resolve: (data: any) => void, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error('Ошибка загрузки файла'));
      }
    };

    xhr.onerror = function () {
      reject(new Error('Ошибка сети'));
    };

    xhr.send()
  });
}
