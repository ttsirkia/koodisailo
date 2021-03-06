'use strict';

import React from 'react';

// ***********************************
//  Footer renders the footer
//  in the bottom of each page.
// ***********************************

export function Footer() {
  return <footer>
    <div className="container">
      <p className="small text-muted text-center">
        <span>Aalto-yliopisto, </span>
        <a href="http://research.cs.aalto.fi/LeTech/">Learning + Technology</a>
        <br/>
        <span className="author">v 2.2.0 | Teemu Sirkiä, 2019</span>
      </p>
    </div>
  </footer>;
}
