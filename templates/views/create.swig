{% extends "../layouts/default.swig" %}
{% import "../mixins/tabs.swig" as Tabs %}

{% block js %}
<script>
  $(function() {
    $('#title').focus();
  });
</script>
{% endblock %}

{% block content %}

    <h2>{{ course.name }}</h2>
    {{ Tabs.renderTabs() }}

    <h3>Koodin tallennus</h3>

    {% if codeCount >= 50 %}
    <div class="alert alert-warning">
      Tallennettujen koodien enimmäismäärä on täynnä. Jotta voit tallentaa uusia koodeja, sinun täytyy
      poistaa nykyisiä koodeja palvelusta.
    </div>

    {% else %}

    <p>
      Anna koodillesi sen sisältöä kuvaava otsikko ja liitä koodi alempaan tekstikenttään.
      Tallentamasi koodi näkyy vain itsellesi palvelun etusivulla, mutta halutessasi voit
      antaa koodilinkin kurssihenkilökunnalle neuvojen saamiseksi. Muut kurssin opiskelijat
      eivät voi nähdä koodia.
    </p>

    <p>
      Tallentamasi koodi säilyy palvelussa {{ course.expireTime }} päivää.
    </p>

    <form class="form-horizontal" method="post" action="#">

        <input type="hidden" name="_csrf" value="{{ csrf_token_value }}">
        <div class="form-group">
            <label for="courseName" class="col-sm-2 control-label">Otsikko:</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="title" id="title" value="{{ codeTitle }}">
            </div>
        </div>

        <div class="form-group">
            <label for="courseName" class="col-sm-2 control-label">Sisältö:</label>
            <div class="col-sm-10">
                <textarea class="form-control" name="content" id="content" style="height: 400px;">{{ content }}</textarea>
            </div>
        </div>

        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button class="btn btn-success" value="save" name="action" type="submit">Tallenna</button>
                <a href="/koodisailo/my" class="btn btn-primary">Peruuta</a>
            </div>
        </div>

    </form>

    {% endif %}

{% endblock %}
