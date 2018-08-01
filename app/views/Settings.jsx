'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';

// *************************************
//  Settings is the main view for course
//  settings which only a teacher can
//  access.
// *************************************

export function Settings(props) {
  return <form className="form-horizontal" method="post" action="/koodisailo/settings">

    <h3><FormattedMessage id="settings-title"/></h3>

    <input type="hidden" name="_csrf" value={props.view.csrf}/>
    <div className="form-group">
      <label htmlFor="courseName" className="col-sm-2 control-label"><FormattedMessage id="course-name"/></label>
      <div className="col-sm-6">
        <input type="text" className="form-control" name="name" id="courseName" defaultValue={props.view.course.name}/>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="courseId" className="col-sm-2 control-label"><FormattedMessage id="course-id"/></label>
      <div className="col-sm-6">
        <p id="courseId" className="form-control-static">{props.view.course.courseId}</p>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="combined" className="col-sm-2 control-label"><FormattedMessage id="combine-with"/></label>
      <div className="col-sm-6">
        <input type="text" className="form-control" name="combined" id="combined" defaultValue={props.view.course.combined}/>
        <p className="help-block small">
          <FormattedMessage id="settings-connect-help"/>
        </p>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="expireTime" className="col-sm-2 control-label"><FormattedMessage id="expiration-time"/></label>
      <div className="col-sm-6">
        <input type="number" className="form-control" name="expireTime" id="expireTime" defaultValue={props.view.course.expireTime}/>
        <p className="help-block small">
          <FormattedMessage id="settings-expiration-help"/>
        </p>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="language" className="col-sm-2 control-label"><FormattedMessage id="programming-language"/></label>
      <div className="col-sm-6">
        <input type="text" className="form-control" name="language" id="language" defaultValue={props.view.course.language}/>
        <p className="help-block small">
          <FormattedMessage id="settings-programming-language-help"/>
        </p>
      </div>
    </div>

    <div className="form-group">
      <div className="col-sm-offset-2 col-sm-10">
        <button type="submit" name="action" value="saveSettings" className="btn btn-primary"><FormattedMessage id="save"/></button>
      </div>
    </div>

  </form>;
}
