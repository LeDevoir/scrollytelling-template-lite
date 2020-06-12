# Scrollytelling Template (lite version)

This repository contains the base template to create a scrollytelling article. This template is a lite version of the
scrollytelling template used by _Le Devoir_. It is based on [webpack](https://webpack.js.org/).

## Prerequisites
Before using this template, you must install [Node.js](https://nodejs.org/en/).

## Server Startup
Once Node.js is installed on your computer, you must read the following instructions to be able to use the template
on your machine.

The first step is tho install the necessary dependencies for the template. Thus, you have the type the following
command in a terminal at the root of the project:

```
npm install
```

The second step is to start the server. Again, you need to type the following command in a terminal:

```
npm start
```

Once the server starts, the application can be reached at `http://localhost:8080/`. Please note that the application
reloads automatically when changes occur to files in the `src` folder.

## Template Structure
The necessary files for the proper functioning of the template are located in `src` folder. The `src` folder
is structured as follows:

* `app`: folder containing all the JavaScript files for the proper functioning of the template.
  * `app.js`: main file of the application importing all the necessary files.
  * `scroller.js`: file defining the scroller.
* `assets`: folder containing all the necessary resources for the web page.
  * `img`: folder containing the images used in the `index.html` file.
  * `styles`: folder containing the stylesheet files used by the template. The files are written in
  [SCSS](https://sass-lang.com/).
* `data`: folder containing the data used by the visualizations.
* `index.html`: HTML template of the application.

## Template Usage
The following subsections describe the required steps to create different sections in the HTML template
(`src/index.html`). Note that the following sections must be defined between the `<main>` tag in the `index.html` file.

### Text Section (`text-section`)
A text section allows you to integrate text in the application. The following HTML code defines an example for a text
section.

```html
<section class="text-section">
  <h1>Section Title</h1>
  <p>The text of the first paragraph...</p>
  <p>The text of the second paragraph...</p>
  <p>The text of the third paragraph...</p>
  <p>The text of the last paragraph...</p>
</section>
```

For an introduction section, you can used the `intro` class to have a larger heading.

### Visualization Section (`viz-section`)
A visualization section allows you to display a visualization updated based on the scroll position. Please note that many
visualization sections can be defined in an application.

To define a text part that will trigger an event once visible on the screen, you must add a `<section>` element
in the `<div class="steps">` element.

Regarding the necessary JavaScript code for a visualization section, you must specify a list of functions
(also called _callbacks_) to the `scroller` function called in the` app.js` file. This list must be the same size as
the number of sections defined in the `<div class =" steps ">` element. In other words, a function must be
associated with each `<section>` element defined in the element `<div class =" steps ">`. Thus, the correct function
will be called once a particular section becomes visible.

The HTML code below illustrates a possible example for a visualization section.
```html
<section class="viz-section">
  <div class="steps">
    <section>
      <h1>Title 1</h1>
      <p>Text of section 1...</p>
    </section>
    <section>
      <p>Title 2</p>
      </section>
    <section>
      <p>Title 3</p>
      </section>
    <section>
      <h1>Title 4</h1>
      <p>Text of section 4...</p>
    </section>
  </div>
  <div class="viz" id="viz"></div>
</section>
```

The JavaScript code corresponding to the previous HTML code is shown below. In this case, the function associated
to a specific text part is called when that same part becomes visible on the screen. The functions can therefore
be used to update the displayed visualization.
```js
// "app.js" file
import '../assets/styles/style.scss';
import { scroller } from "./scroller";

scroller([[
    () => console.log('Called when section 1 is visible.'),
    () => console.log('Called when section 2 is visible.'),
    () => console.log('Called when section 3 is visible.'),
    () => console.log('Called when section 4 is visible.')
  ]]).initialize();
```

In order to keep a clean, maintainable and scalable code, it is strongly recommended to **create a new JavaScript file
for each visualization section**. So the logic required for a visualization section could be contained in a file called
`viz.js`. This file could export the callbacks functions of this section.

For clarity, here is what the `viz.js` file might look like.
```js
// "viz.js" file

import * as d3 from "d3";

const width = 1000;
const height = 700;

const visContainer = d3.select('#viz');
const svg = visContainer.append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('preserveAspectRatio', 'xMidYMid');

export async function initialize() {
  const data = await d3.csv('./data/data.csv');

  // Logic to initialize the visualization...

  return [
    () => console.log('Called when section 1 is visible.'),
    () => console.log('Called when section 2 is visible.'),
    () => console.log('Called when section 3 is visible.'),
    () => console.log('Called when section 4 is visible.')
  ]
}
```

In this case, the `app.js` file could be simplified as follows.
```js
// "app.js" file
import '../assets/styles/style.scss';
import { scroller } from './scroller';
import { initialize as v1 } from './viz1';

Promise.all([v1()]).then(([callbacksV1]) =>  {
  scroller([callbacksV1])
    .initialize();
});
```

## API of the `scroller` Function
The `scroller` function initializes all the logic necessary for the proper functioning of a _scrollytelling_.
this function is defined in the file `src / app / scroller.js` and exports a very simple API (Application Programming
Interface) to configure its initialization.

Please note that the `?` Symbol indicates an optional parameter.

### Constructor

#### `scroller(:callbacks)`
Initializes the logic of the _scrollytelling_. This function takes as parameters
the functions to be called for each of the displayed text parts in the visualization sections as a
two-dimensional array (`: callbacks`).

### Methods
Once the `scroller` instance is defined, it is possible to use the following methods.

#### `scroller.offsetTop(:offsetTop?)`
Gets or sets the value associated with the top offset (_offset top_) in pixels. This offset allows you to manage
how far from the top of the screen a text part of a visualization section is considered invisible.
By default, this value is 0.

#### `scroller.offsetBottom(:offsetBottom?)`
Gets or sets the value associated with the bottom offset (_offset bottom_) in pixels. This offset allows you to
managehow far from the bottom of the screen a text part of a visualization section is considered invisible.
By default, this value is 0.

#### `scroller.initialize()`
Initializes the subscriptions to events allowing the proper functioning of the _scroller_. ** Be sure to call
this function last.**

## Generating a Build
Once you are ready to deploy a scrollytelling on a web server, you should create a _build_ to generate all the files
necessary for production. These files will be for the most minified to reduce page load time.

To do so, you must type the following command in a terminal at the root of the project:
```
npm run build
```

Once the command is executed, the files to deploy will be in the `dist` folder. You will then have
to copy these files on the web server where the files will be hosted.

## Contact
This template was developed by:
- Antoine Béland
- Jean-Philippe Corbeil
