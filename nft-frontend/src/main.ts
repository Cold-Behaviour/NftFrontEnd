import Aurelia, { RouterConfiguration } from 'aurelia';

import { MyApp } from './my-app';

// Css files imported in this main file are NOT processed by style-loader
// They are for sharedStyles in shadowDOM.
// However, css files imported in other js/ts files are processed by style-loader.
// import shared from './shared.css';

Aurelia
  .register(RouterConfiguration)
  .app(MyApp)
  .start();
