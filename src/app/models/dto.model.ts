export enum Category {
  RootFolder = 1,
  Folder = 2,
  Photo = 3,
  Video = 4,
}

export interface FileModel {
  ID: string;
  MetadataID: string;
  UserID: string;
  MetadataKey: string;
  Name: string;
  FilePath: string;
  LocalPath: string;
  LastUploadTime: string;
  LastModificationTime: string;
  ParentID: string;
  Category: Category;
  Size: string;
  URL: string;
  ThumbnailURL: string;
  CreationTime: string;
  IsInRecycleBin: boolean;
  Description: string;
  OptimizedURL: string | null;
}

export interface GetFilesResponse {
  Items: FileModel[];
  NextToken: string;
}

export interface UpdateTokenResponse {
  AccessToken: string;
}
