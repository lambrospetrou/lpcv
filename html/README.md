## Build the CV site and the PDF

```
npm run release
```

The above command will create a `build/` directory which will contain the files ready to be deployed on our website host. 

* It compiles the CSS using SASS and outputs a style.css
* It copies any static files we might have into the `build/` directory
* It generates a PDF version of the CV website using Chrome Headless and [puppeteer](https://github.com/GoogleChrome/puppeteer)
