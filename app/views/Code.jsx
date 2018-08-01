'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {FormattedRelative} from 'react-intl';
import {injectIntl} from 'react-intl';

// ***********************************
//  Code is the main view for viewing
//  a code snippet.
// ***********************************

const UserName = function(props) {
  if (!props.myCode || true) {
    return <h4>{props.userName}</h4>;
  } else {
    return null;
  }
};

const ActionButtons = function(props) {
  if (props.myCode) {
    return <form className="form-horizontal" method="post" action="#">
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input type="hidden" name="code" value={props.codeId}/>
      <a href={'/koodisailo/edit/' + props.codeId} className="btn btn-primary btn-sm"><FormattedMessage id="edit"/></a>
      <button className="btn btn-danger btn-sm" value="remove" name="action" type="submit" id="remove"><FormattedMessage id="remove"/></button>
    </form>;
  } else {
    return null;
  }
};

class Code_ extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const self = this;

    $.fn.highlightCode = function() {
      return this.each(function() {

        hljs.highlightBlock(this);

        // Add line numbers.
        const pre = $(this);
        const lines = pre.html().split(/\r\n|\r|\n/g);
        const list = $('<table/>').addClass('src');
        for (let i = 1; i <= lines.length; i++) {
          list.append('<tr><td class="highlight-num unselectable">' + i + '</td><td class="highlight-src">' + lines[i - 1] + '</td></tr>');
        }
        pre.html(list);
      });
    };

    $('#code').highlightCode();

    $('#remove').click(function(event) {

      if (!confirm(self.props.intl.formatMessage({id: 'confirm-delete'}))) {
        event.preventDefault();
      }

    });

    $('#copy').click(function() {
      $('#codeContent').show();
    });

    const clipboard = new ClipboardJS('#copy');
    clipboard.on('error', function() {
      $('#codeContent').hide();
    });
    clipboard.on('success', function() {
      $('#codeContent').hide();
    });

  }

  render() {
    return <div>

      <h3>{this.props.view.codeTitle}</h3>
      <UserName myCode={this.props.view.myCode} userName={this.props.view.userName}/>

      <p className="small">
        <FormattedRelative value={new Date(this.props.view.created)}/>
      </p>

      <textarea id="codeContent" style={{
          display: 'none',
          width: '1px',
          height: '1px'
        }} defaultValue={this.props.view.content}></textarea>
      <p>
        <button className="btn btn-primary btn-xs" id="copy" data-clipboard-target="#codeContent">
          <FormattedMessage id="copy-clipboard"/>
        </button>
      </p>

      <div id="code-block"></div>
      <pre id="code" className={this.props.view.language}><code>{this.props.view.content}</code></pre>

      <ActionButtons myCode={this.props.view.myCode} csrf={this.props.view.csrf} codeId={this.props.view.codeId}/>

    </div>;
  }

}

const Code = injectIntl(Code_);

export {
  Code
};
