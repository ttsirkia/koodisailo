{% import "../mixins/tabs.swig" as Tabs %}
{% extends "../layouts/default.swig" %}

{% block content %}
<h2>{{ course.name }}</h2>

{{ Tabs.renderTabs() }}

<form class="form-horizontal" method="post" action="#">

  <h3>Yleiset asetukset</h3>

  <input type="hidden" name="_csrf" value="{{ csrf_token_value }}">
  <div class="form-group">
    <label for="courseName" class="col-sm-2 control-label">Kurssin nimi:</label>
    <div class="col-sm-6">
      <input type="text" class="form-control" name="name" id="courseName" value="{{ course.name }}">
    </div>
  </div>

  <div class="form-group">
    <label for="courseId" class="col-sm-2 control-label">Kurssin tunniste:</label>
    <div class="col-sm-6">
      <p id="courseId" class="form-control-static">{{ course.courseId }}</p>
    </div>
  </div>

  <div class="form-group">
    <label for="combined" class="col-sm-2 control-label">Yhdistä toiseen:</label>
    <div class="col-sm-6">
      <input type="text" class="form-control" name="combined" id="combined" value="{{ course.combined }}">
      <p class="help-block small">
        Jos haluat yhdistää useamman kurssin koodisäilön, kirjoita tähän sen kurssin tunniste, johon tämä
        kurssi liitetään. Tällöin kaikki muut paitsi kurssin opettaja ohjataan annetulle kurssille, kun koodisäilö
        avataan, eikä tämän kurssin koodisäilö ole käytössä.
      </p>
    </div>
  </div>

  <div class="form-group">
    <label for="expireTime" class="col-sm-2 control-label">Säilymisaika:</label>
    <div class="col-sm-6">
      <input type="number" class="form-control" name="expireTime" id="expireTime" value="{{ course.expireTime }}">
      <p class="help-block small">
        Määrittele tässä, kuinka monta vuorokautta palveluun lähetettyjä koodeja säilytetään.
      </p>
    </div>
  </div>

  <div class="form-group">
    <label for="language" class="col-sm-2 control-label">Ohjelmointikieli:</label>
    <div class="col-sm-6">
      <input type="text" class="form-control" name="language" id="language" value="{{ course.language }}">
      <p class="help-block small">
        Jos tämä on tyhjä, koodinvärityskirjasto yrittää tunnistaa käytetyn kielen automaattisesti.
      </p>
    </div>
  </div>

  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" name="action" value="saveSettings" class="btn btn-primary">Tallenna</button>
    </div>
  </div>

</form>

{% endblock %}
