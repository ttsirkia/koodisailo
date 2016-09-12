{% extends "../layouts/default.swig" %}
{% import "../mixins/tabs.swig" as Tabs %}

{% block content %}

    <h2>{{ course.name }}</h2>
    {{ Tabs.renderTabs() }}

    <p class="lead">
      Voit tallentaa palveluun koodeja talteen itsellesi lyhyeksi aikaa, mutta myös tarvittaessa jakaa jonkin
      koodin kurssihenkilökunnan kanssa antamalla koodilinkin henkilökunnalle. Muut opiskelijat eivät voi
      nähdä tallentamiasi koodeja.
    </p>

    <p>
      Tallennetut koodit säilyvät palvelussa {{ course.expireTime }} päivää.
    </p>

    {% if codes.length >= 50 %}
    <div class="alert alert-warning">
      Tallennettujen koodien enimmäismäärä on täynnä. Jotta voit tallentaa uusia koodeja, sinun täytyy
      poistaa nykyisiä koodeja palvelusta.
    </div>
    {% endif %}

    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Otsikko</th>
          <th>Luotu</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {% for code in codes %}
        <tr>
          <td><a href="/koodisailo/view/{{ code.id }}">{{ code.title }}</a></td>
          <td>{{ code.time }}</td>
          <td>{% if code.expiresSoon %}<span class="label label-warning">Poistuu pian</span>{% endif %}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>

    {% if codes.length < 50 %}
    <a href="/koodisailo/create" class="btn btn-success" type="submit">Luo uusi</a>
    {% endif %}

{% endblock %}
