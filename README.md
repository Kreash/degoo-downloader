# DegooDownloader

This project was made to make it easier to download files from the degoo cloud storage.

If you need more features for working with cloud degoo  storage or if you want answers to why this project was created, then the following repository explains it in some detail https://github.com/bernd-wechner/Degoo

## How to use

1. Download the project
2. Install the dependencies with `npm ci` (install node.js if you don't have it)
3. Run the project with `npm start-prod`
4. Open the browser without CORS and go to `localhost:4200`
5. Login to your degoo account on official website
6. Find **refreshToken** in the browser cookies and write it to the **refreshToken** field in the application

You can track the download process in the developer tools

## How open browser without CORS

There are many articles on the Internet on this topic. Here is one of them https://medium.com/@beligh.hamdi/run-chrome-browser-without-cors-872747142c61.

## Contributing

Pull requests are welcome.
