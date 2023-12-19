import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AppStateService } from './app-state.service';
import { map } from 'rxjs';
import {
  FileModel,
  GetFilesResponse,
  UpdateTokenResponse,
} from '../models/dto.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly updateAccessTokenURL =
    'https://rest-api.degoo.com/access-token/v2';

  constructor(private apollo: Apollo, private stateService: AppStateService) {}

  getUserInfo() {
    return this.apollo
      .watchQuery({
        query: gql(`
      query GetUserInfo3($Token: String!) {
        getUserInfo3(Token: $Token) {
          ID
          FirstName
          LastName
          Email
          AvatarURL
          CountryCode
          LanguageCode
          Phone
          AccountType
          UsedQuota
          TotalQuota
          OAuth2Provider
          GPMigrationStatus
          FeatureNoAds
          FeatureTopSecret
          FeatureDownsampling
          FeatureAutomaticVideoUploads
          FileSizeLimit
        }
      }
    `),
        variables: {
          Token: this.stateService.accessToken,
        },
      })
      .valueChanges.pipe(map((data) => (data.data as any).getUserInfo3));
  }

  async getFiles(
    parentId: string = '-1',
    limit: number = 100,
    order: number = 0
  ): Promise<GetFilesResponse> {
    try {
      return (
        (
          await this.apollo.client.query({
            query: gql(
              `query GetFileChildren5(
            $Token: String!
            $ParentID: String
            $AllParentIDs: [String]
            $Limit: Int!
            $Order: Int!
            $NextToken: String
          ) {
            getFileChildren5(
              Token: $Token
              ParentID: $ParentID
              AllParentIDs: $AllParentIDs
              Limit: $Limit
              Order: $Order
              NextToken: $NextToken
            ) {
              Items {
                ID
                MetadataID
                UserID
                DeviceID
                MetadataKey
                Name
                FilePath
                LocalPath
                LastUploadTime
                LastModificationTime
                ParentID
                Category
                Size
                Platform
                URL
                ThumbnailURL
                CreationTime
                IsSelfLiked
                Likes
                IsHidden
                IsInRecycleBin
                Description
                Location2 {
                  Country
                  Province
                  Place
                  GeoLocation {
                    Latitude
                    Longitude
                  }
                }
                Data
                DataBlock
                CompressionParameters
                Shareinfo {
                  Status
                  ShareTime
                }
                ShareInfo {
                  Status
                  ShareTime
                }
                Distance
                OptimizedURL
                Country
                Province
                Place
                GeoLocation {
                  Latitude
                  Longitude
                }
                Location
                IsShared
                ShareTime
              }
              NextToken
            }
          }`
            ),
            variables: {
              Token: this.stateService.accessToken,
              ParentID: parentId,
              Limit: limit,
              Order: order,
            },
          })
        ).data as any
      ).getFileChildren5 as GetFilesResponse;
    } catch (error) {
      if (this.errorIsNotAuthorized(error)) {
        await this.updateAccessToken();
        return await this.getFiles(parentId, limit, order);
      }
      throw new Error((error as Error).message);
    }
  }

  async getFilesShort(
    parentId: string = '-1',
    limit: number = 100,
    order: number = 0,
    nextToken?: string
  ): Promise<GetFilesResponse> {
    try {
      return (
        (
          await this.apollo.client.query({
            query: gql(
              `query GetFileChildren5(
                $Token: String!
                $ParentID: String
                $AllParentIDs: [String]
                $Limit: Int!
                $Order: Int!
                $NextToken: String
              ) {
                getFileChildren5(
                  Token: $Token
                  ParentID: $ParentID
                  AllParentIDs: $AllParentIDs
                  Limit: $Limit
                  Order: $Order
                  NextToken: $NextToken
                ) {
                  Items {
                    ID
                    MetadataID
                    UserID
                    MetadataKey
                    Name
                    FilePath
                    LocalPath
                    LastUploadTime
                    LastModificationTime
                    ParentID
                    Category
                    Size
                    URL
                    ThumbnailURL
                    CreationTime
                    IsInRecycleBin
                    Description
                    OptimizedURL
                  }
                  NextToken
                }
              }`
            ),
            variables: {
              Token: this.stateService.accessToken,
              ParentID: parentId,
              Limit: limit,
              Order: order,
              NextToken: nextToken,
            },
          })
        ).data as any
      ).getFileChildren5 as GetFilesResponse;
    } catch (error) {
      if (this.errorIsNotAuthorized(error)) {
        await this.updateAccessToken();
        return await this.getFilesShort(parentId, limit, order, nextToken);
      }
      throw new Error((error as Error).message);
    }
  }

  async getFile(fileId: string): Promise<FileModel> {
    try {
      return (
        (
          await this.apollo.client.query({
            query: gql(
              `query GetOverlay4($Token: String!, $ID: IDType!) {
              getOverlay4(Token: $Token, ID: $ID) {
                ID
                MetadataID
                UserID
                DeviceID
                MetadataKey
                Name
                FilePath
                LocalPath
                LastUploadTime
                LastModificationTime
                ParentID
                Category
                Size
                Platform
                URL
                ThumbnailURL
                CreationTime
                IsSelfLiked
                Likes
                Comments
                IsHidden
                IsInRecycleBin
                Description
                Location {
                  Country
                  Province
                  Place
                  GeoLocation {
                    Latitude
                    Longitude
                  }
                }
                Location2 {
                  Country
                  Region
                  SubRegion
                  Municipality
                  Neighborhood
                  GeoLocation {
                    Latitude
                    Longitude
                  }
                }
                Data
                DataBlock
                CompressionParameters
                Shareinfo {
                  Status
                  ShareTime
                }
                ShareInfo {
                  Status
                  ShareTime
                }
                HasViewed
                QualityScore
              }
            }`
            ),
            variables: {
              Token: this.stateService.accessToken,
              ID: {
                FileID: fileId,
              },
            },
          })
        ).data as any
      ).getOverlay4 as FileModel;
    } catch (error) {
      if (this.errorIsNotAuthorized(error)) {
        await this.updateAccessToken();
        return await this.getFile(fileId);
      }
      throw new Error((error as Error).message);
    }
  }

  getFilesShortAsObservable(
    parentId: string = '-1',
    limit: number = 100,
    order: number = 0,
    nextToken?: string
  ) {
    return this.apollo
      .query({
        query: gql(
          `query GetFileChildren5(
            $Token: String!
            $ParentID: String
            $AllParentIDs: [String]
            $Limit: Int!
            $Order: Int!
            $NextToken: String
          ) {
            getFileChildren5(
              Token: $Token
              ParentID: $ParentID
              AllParentIDs: $AllParentIDs
              Limit: $Limit
              Order: $Order
              NextToken: $NextToken
            ) {
              Items {
                ID
                MetadataID
                UserID
                MetadataKey
                Name
                FilePath
                LocalPath
                LastUploadTime
                LastModificationTime
                ParentID
                Category
                Size
                URL
                ThumbnailURL
                CreationTime
                IsInRecycleBin
                Description
                OptimizedURL
              }
              NextToken
            }
          }`
        ),
        variables: {
          Token: this.stateService.accessToken,
          ParentID: parentId,
          Limit: limit,
          Order: order,
          nextToken: nextToken,
        },
      })
      .pipe(
        map((data) => (data.data as any).getFileChildren5 as GetFilesResponse)
      );
  }

  async updateAccessToken(): Promise<void> {
    const data = {
      RefreshToken: this.stateService.refreshToken,
    };

    const result = await fetch(this.updateAccessTokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      throw new Error(`updateAccessToken failed ${result.status}`);
    }

    const resultData: UpdateTokenResponse = await result.json();
    this.stateService.accessToken = resultData.AccessToken;
  }

  private errorIsNotAuthorized(error: any) {
    return ((error as Error).message as string).includes('Not Authorized');
  }
}
