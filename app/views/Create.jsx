'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';

// *************************************
//  Create is the main view for
//  creating or editing a code snippet.
// *************************************

const LimitWarning = function(props) {
  if (props.count >= 50) {
    return <div className="alert alert-warning">
      <FormattedMessage id="alert-too-many-codes"/>
    </div>;
  } else {
    return null;
  }
};

const PublicSnippet = function(props) {
  if (props.show) {
    return <div className="checkbox">
      <label>
        <input type="checkbox" name="public" id="public" value="public" defaultChecked={props.public}/>
        <FormattedMessage id="public"/>
      </label>
      <p className="help-block small">
        <FormattedMessage id="create-public-help"/>
      </p>
    </div>;
  } else {
    return null;
  }
};

export class Create extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  render() {
    return <div>

      <h3><FormattedMessage id="create-title"/></h3>

      <LimitWarning count={this.props.view.codeCount}/>

      <p>
        <FormattedMessage id="create-lead"/>
      </p>

      <p>
        <FormattedMessage id="create-expiration-info" values={{
            expirationTime: this.props.view.expirationTime
          }}/>
      </p>

      <form className="form-horizontal" method="post" action="#">

        <input type="hidden" name="_csrf" value={this.props.view.csrf}/>
        <div className="form-group">
          <label htmlFor="courseName" className="col-sm-2 control-label">
            <FormattedMessage id="caption"/>
          </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="title" id="title" ref={this.textInput} defaultValue={this.props.view.codeTitle}/>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="courseName" className="col-sm-2 control-label">
            <FormattedMessage id="content"/>
          </label>
          <div className="col-sm-10">
            <textarea className="form-control" name="content" id="content" style={{
                height: '400px'
              }} defaultValue={this.props.view.content}></textarea>
          </div>
        </div>

        <PublicSnippet show={this.props.view.staff} public={this.props.view.public}/>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-success" value="save" name="action" type="submit">
              <FormattedMessage id="save"/>
            </button>
            <a href="/koodisailo/my" className="btn btn-primary"><FormattedMessage id="cancel"/></a>
          </div>
        </div>

      </form>
    </div>;
  }
}
