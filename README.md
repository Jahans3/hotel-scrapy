# Hotel Scrapy

Simple Node.js web scraper for scraping hotel data from websites. Recursively finds all properties passed to the configuration, searching for each property a maximum of 10 times.

This README is intended for non-developers.

#### Prerequisites
* Install [Node.js @ >= v8.9.1](https://nodejs.org/en/)
* Install [Git](https://git-scm.com/downloads)

#### Setup
```
$ npm i
```

#### Usage
```
$ npm start
```

### Config
Configs are stored in the `configs/` folder and are organised by website.

Inside each website's configuration files, eg. `configs/trip-advisor.js`, you will see an object that looks something like the following:

```
module.exports = {
  filename: '...',
  base: '...',
  cities: {
    london: '...'
  }
}
```

The object contains a property called `base` that should contain the domain of the website you wish to scrape, and the cities property should contain URL paths to the list pages you wish to scrape.

The `filename` property will be the name of the output file. Before writing a new file, the scraper reads the previous file and merges the results, so each generated file will also contain the output of the previous runs.

Currently, only a config for Trip Advisor is set up.

### Output
The generated output is stored inside the root of the project and is stored in a JSON format (JavaScript Object Notation, key-value pairs). In future this will be output in a different format, for now though, if you wish to view in a table format just search Google for a JSON to table formatter and copy in the contents of the file.

## Step by Step
1. Install Node.js - see [prerequisites](#prerequisites)
2. Install git - see [prerequisites](#prerequisites)
3. From the Github page, copy the Git URL found by clicking the green "Clone or Download" button in the top right
    * Ensure you copy the HTTPS link, not the SSH link
    * Your link should look like this: `https://github.com/Jahans3/hotel-scrapy.git`
4. Open the command prompt (Windows) or terminal (macOS, Linux)
5. Within the command prompt/terminal, navigate to the folder where you wish to store the scraper
6. Type the following command (leave out the `$`): `$ git clone <copy-your-git-link-here>`
7. You should now see a folder named `hotel-scrapy/`
8. Still within command prompt/terminal, navigate to `hotel-scrapy/`
9. Once inside `hotel-scrapy/`, run the following commands:
    * `$ npm install`
    * `$ npm start`
