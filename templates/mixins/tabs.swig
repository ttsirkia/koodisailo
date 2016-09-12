{%- macro renderTabs() -%}
<ul class="nav nav-tabs">
  <li><a href="/koodisailo/my">Etusivu</a></li>
  <li><a href="/koodisailo/create">Luo uusi</a></li>

  {% if teacher %}
  <li><a href="/koodisailo/settings">Kurssin asetukset</a></li>
  {% endif %}
  
</ul>
{%- endmacro -%}
