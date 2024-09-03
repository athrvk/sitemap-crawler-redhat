# Sitemap Crawler

Sitemap Crawler is a web service that fetches the sitemap of a given domain. It's built using Express.js, Cheerio, and React.

## Features

- Fetches and displays the sitemap of a specified domain
- Customizable crawl depth
- Option to include parent paths
- Web-based user interface

## Prerequisites

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- Docker (optional, for running the containerized version)

## Installation

### Local Installation

1. Clone the repository:

   ```
   git clone https://github.com/athrvk/sitemap-crawler-redhat.git
   cd sitemap-crawler
   ```

2. Install dependencies:

   ```
   npm install
   ```

### Docker

You can also run Sitemap Crawler using Docker. Pull the image from Docker Hub:

```
docker pull athrvk/sitemap-crawler:latest
```

## Usage

### Running Locally

1. Start the server:

   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Running with Docker

Run the Docker container:

```
docker run --pull=always -p 3000:3000 athrvk/sitemap-crawler:latest
```

Then access the application at `http://localhost:3000`

## Testing

You can test the application using the demo website: https://demo.cyotek.com/


## Known Issues

1. ~~The include parent path checkbox is not perfect implementation of its logic, it has issues when root path has redirections.~~

2. ~~The depth condition needs improvement. If it shows just 1 link in case of any level set include parent path checkbox.~~

3. Parallel processing is not yet implemented, which may lead to longer processing times for larger sitemaps.

4. Crawling depths greater than 3 on popular websites may take an extended amount of time (3+ minutes).


## Development Notes

- This project was developed on Linux and has not been tested on Windows.

- Contributions to address known issues or add new features are welcome.

## License

> TODO

## Contact

[atharvakusumbia@gmail.com](atharvakusumbia@gmail.com)
