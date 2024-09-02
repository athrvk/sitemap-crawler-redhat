# Sitemap Crawler

A web crawler service which fetches the site map of the current domain.
Its built using express, cheerio and react.

This project is created on linux, so it might not work on Windows(haven't tested it).

## Installation

Clone the repository and install the dependencies using `npm install`.
You don't have to change directory, its done using the install script.

## Usage

Start the server using `npm start`.

Open http://localhost:3000 in your browser.

You can test using https://demo.cyotek.com/ website


## Known Issues

The include parent path checkbox is not perfect implementation of its logic, it has issues when root path has redirections.

The depth condition needs improvement. If it shows just 1 link in case of any level set include parent path checkbox.

There is no parallel processing implemented yet. I can do it using promises but the implementation needs a bit more time.

For depths greater than 3 it takes almost forever (more than 3 minutes) on a famous website.

