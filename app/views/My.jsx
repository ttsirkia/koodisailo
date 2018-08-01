'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {FormattedRelative} from 'react-intl';

// **************************************
//  My is the home page showing the code
//  snippets of the current user.
// **************************************

export function My(props) {

  const ExpiryLabel = function(props) {
    if (props.expiresSoon) {
      return <span className="label label-warning"><FormattedMessage id="expires-soon"/></span>;
    } else {
      return null;
    }
  };

  const PublicLabel = function(props) {
    if (props.public) {
      return <span className="label label-primary"><FormattedMessage id="public"/></span>;
    } else {
      return null;
    }
  };

  const CodeRow = function(props) {
    return <tr>
      <td>
        <a href={'/koodisailo/view/' + props.code.id}>{props.code.title}</a>
      </td>
      <td>
        <FormattedRelative value={new Date(props.code.time)}/></td>
      <td>
        <PublicLabel public={props.code.public}/>
        <ExpiryLabel expiresSoon={props.code.expiresSoon}/>
      </td>
    </tr>;
  };

  const CodeTable = function(props) {
    return <table className="table table-condensed">
      <thead>
        <tr>
          <th><FormattedMessage id="caption"/></th>
          <th><FormattedMessage id="created"/></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.codes.map((code) => <CodeRow key={code.id} code={code}/>)}
      </tbody>
    </table>;
  };

  const AmountWarning = function(props) {
    if (props.amount >= 50) {
      return <div className="alert alert-warning">

      </div>;
    } else {
      return null;
    }
  };

  const CreateButton = function(props) {
    if (props.amount < 50) {
      return <a href="/koodisailo/create" className="btn btn-success" type="submit"><FormattedMessage id="create"/></a>;
    } else {
      return null;
    }
  };

  // **********************************************************************************************

  return <div>
    <p className="lead">
      <FormattedMessage id="my-lead"/>
    </p>
    <p>
      <FormattedMessage id="my-expiration-time" values={{
          expirationTime: props.view.expirationTime
        }}/>
    </p>
    <AmountWarning amount={props.view.codes.length}/>
    <CodeTable codes={props.view.codes}/>
    <CreateButton amount={props.view.codes.length}/>
  </div>;
}
