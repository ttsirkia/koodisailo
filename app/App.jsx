'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';
import {addLocaleData} from 'react-intl';

import {Alerts} from './components/Alerts';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {Tabs} from './components/Tabs';

import {Code} from './views/Code';
import {Create} from './views/Create';
import {Error404} from './views/Error404';
import {Error500} from './views/Error500';
import {Index} from './views/Index';
import {My} from './views/My';
import {Settings} from './views/Settings';

// *************************************
//  App is the root for producing the
//  required React view.
// *************************************

// ************************************************************************************************

const translations = {};

// Add these lines for new translations
// Available translations are also defined in server.js

import fi from 'react-intl/locale-data/fi';
import en from 'react-intl/locale-data/en';

import translations_fi from '../translations/fi';
import translations_en from '../translations/en';

addLocaleData(fi);
addLocaleData(en);

translations.fi = translations_fi;
translations.en = translations_en;

// ************************************************************************************************

// These views can be used in locals.reactData.app.view to
// select the view to be rendered

const views = {
  code: Code,
  create: Create,
  error404: Error404,
  error500: Error500,
  index: Index,
  my: My,
  settings: Settings
};

const App = (props) => {

  const language = props.state.app.language;

  const CourseName = function(props) {
    if (props.course) {
      return <h2>{props.course.name}</h2>;
    } else {
      return <div/>;
    }
  };

  const CourseBlock = function(props) {
    if (props.state.course.name) {
      return <div>
        <CourseName course={props.state.course}/>
        <Tabs course={props.state.course} user={props.state.user} view={props.state.app.view}/>
      </div>;
    } else {
      return null;
    }
  };

  const ReactView = views[props.state.app.view];

  return <IntlProvider locale={language} messages={translations[language]}>
    <div>
      <Header user={props.state.user}/>
      <Alerts messages={props.state.app.messages}/>
      <div className="container" id="content">
        <CourseBlock state={props.state}/>
        <ReactView view={props.state.view}/>
      </div>
      <Footer/>
    </div>
  </IntlProvider>;
};

// All the required data will be injected in the
// HTML and assigned to window.reactData
ReactDOM.render(<App state={window.reactData}/>, document.getElementById('react-content'));
