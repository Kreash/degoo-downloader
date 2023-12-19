import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MainComponent } from './main/main.component';
import { ApiService } from './services/api.service';
import { FolderComponent } from './folder/folder.component';
import { OpenedFolderComponent } from './opened-folder/opened-folder.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterOutlet,
    ApolloModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    VirtualScrollerModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthFormComponent,
    MainComponent,
    FolderComponent,
    OpenedFolderComponent,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const authLink = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: {
              'x-api-key': 'da2-vs6twz5vnjdavpqndtbzg3prra',
            },
          });
          return forward(operation);
        });

        const http = httpLink.create({
          uri: 'https://production-appsync.degoo.com/graphql',
        });

        return {
          cache: new InMemoryCache(),
          link: ApolloLink.from([authLink, http]),
        };
      },
      deps: [HttpLink],
    },
    ApiService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
