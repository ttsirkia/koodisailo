'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';

// ***********************************
//  Tabs render the main navigation
//  below the course name.
// ***********************************

export function Tabs(props) {

  if (!props.course) {
    return null;
  }

  // Role can be staff or teacher

  const tabs = [
    {
      href: '/koodisailo/my',
      name: 'tabs-my'
    }, {
      href: '/koodisailo/create',
      name: 'tabs-create'
    }, {
      href: '/koodisailo/settings',
      name: 'tabs-settings',
      role: 'teacher'
    }
  ];

  const Tab = function(props) {
    let cName = '';
    if ('tabs-' + props.view === props.name) {
      cName = 'active';
    }
    return <li className={cName}>
      <a href={props.href}>
        <FormattedMessage id={props.name}/>
      </a>
    </li>;
  };

  return <ul className="nav nav-tabs">
    {
      tabs.map((tab) => {
        if (tab.role && !props.user[tab.role]) {
          return null;
        } else {
          return <Tab key={tab.name} view={props.view} name={tab.name} href={tab.href}/>;
        }
      })
    }
  </ul>;
}
