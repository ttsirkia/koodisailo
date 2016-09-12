{% extends "../layouts/default.swig" %}
{% import "../mixins/tabs.swig" as Tabs %}

{% block js %}
<link rel="stylesheet" href="/koodisailo/scripts/highlight/styles/monokai-sublime.css">
<script src="/koodisailo/scripts/highlight/highlight.pack.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.12/clipboard.min.js"></script>

<script>
  $(function() {

    $.fn.highlightCode = function(options) {
      return this.each(function() {

        hljs.highlightBlock(this);

        // Add line numbers.
        var pre = $(this);
        var lines = pre.html().split(/\r\n|\r|\n/g);
        var list = $("<table/>").addClass("src");
        for (var i = 1; i <= lines.length; i++) {
            list.append('<tr><td class="highlight-num unselectable">' + i + '</td><td class="highlight-src">' + lines[i - 1] + '</td></tr>');
        }
        pre.html(list);
      });
    };

    $('#code').highlightCode();

    $('#remove').click(function(event) {

      if (!confirm('Haluatko varmasti poistaa tämän koodin?')) {
        event.preventDefault();
      }

    });

    $('#copy').click(function(event) {
      $('#codeContent').show();
    });

    var clipboard = new Clipboard('#copy');
    clipboard.on('error', function(e) {
        $('#codeContent').hide();
    });
    clipboard.on('success', function(e) {
        $('#codeContent').hide();
    });

  });

</script>
{% endblock %}

{% block content %}

    <h2>{{ course.name }}</h2>
    {{ Tabs.renderTabs() }}

    <h3>{{ codeTitle }}</h3>

    {% if userId != user.id %}
    <h4>{{ userName }}</h4>
    {% endif %}

    <p class="small">Luotu {{ created }}.</p>

    <textarea id="codeContent" style="display: none; width: 1px; height: 1px;">{{ content }}</textarea>
    <p>
      <button class="btn btn-primary btn-xs" id="copy" data-clipboard-target="#codeContent">Kopioi leikepöydälle</button>
    </p>

    <pre id="code"><code{% if course.language %} class="{{ course.language }}"{%- endif -%}>{{ content }}</code></pre>

    {% if showRemove %}
    <form class="form-horizontal" method="post" action="#">
      <input type="hidden" name="_csrf" value="{{ csrf_token_value }}">
      <input type="hidden" name="code" value="{{ codeId }}">
      <a href="/koodisailo/edit/{{ codeId }}" class="btn btn-primary btn-sm">Muokkaa</a>
      <button class="btn btn-danger btn-sm" value="remove" name="action" type="submit" id="remove">Poista</button>
    </form>
    {% endif %}

{% endblock %}
