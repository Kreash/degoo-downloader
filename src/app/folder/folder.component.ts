import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FileModel } from '../models/dto.model';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderComponent {
  @Input() folder!: FileModel;

  @Output() openFolder = new EventEmitter<FileModel>();

  constructor() {}

  protected openFolderEmit(folder: FileModel) {
    this.openFolder.emit(folder);
  }
}
