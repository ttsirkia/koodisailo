import { Translations } from "./translations";

export const fi: Translations = {
  title: "Koodisäilö",

  "tabs-my": "Etusivu",
  "tabs-create": "Luo uusi",
  "tabs-settings": "Kurssin asetukset",

  "index-jumbotron-description":
    "Koodisäilön avulla voi tallettaa koodinpätkiä muutaman päivän ajaksi sekä jakaa niitä turvallisesti myös kurssihenkilökunnalle.",
  "index-lead": "Käytä koodisäilöä kirjautumalla sisään kurssin oppimisympäristön kautta.",

  "my-lead":
    "Voit tallentaa palveluun koodeja talteen itsellesi lyhyeksi aikaa, mutta myös tarvittaessa jakaa jonkin koodin kurssihenkilökunnan kanssa antamalla koodilinkin henkilökunnalle. Muut opiskelijat eivät voi nähdä tallentamiasi koodeja.",
  "my-expiration-time": "Tallennetut koodit säilyvät palvelussa {expirationTime, number} päivää.",
  "my-quota":
    "Koko yhteensä: {totalSize, number} kt. Tallennustilasta on käytössä tällä hetkellä {percentage, number} %.",

  "settings-title": "Yleiset asetukset",
  "settings-connect-help":
    "Jos haluat yhdistää useamman kurssin koodisäilön, kirjoita tähän sen kurssin tunniste, johon tämä kurssi liitetään. Tällöin kaikki muut paitsi kurssin opettaja ohjataan annetulle kurssille, kun koodisäilö avataan, eikä tämän kurssin koodisäilö ole käytössä.",
  "settings-expiration-help":
    "Määrittele tässä, kuinka monta vuorokautta palveluun lähetettyjä koodeja säilytetään. Asetus ei muuta jo tallennttujen koodien säilymisaikaa. Arvon tulee olla välillä 1 - 365.",
  "settings-programming-language-help":
    "Jos tämä on tyhjä, koodinvärityskirjasto yrittää tunnistaa käytetyn kielen automaattisesti.",
  "settings-default-language": "Oletuskieli",
  "settings-default-language-help":
    "Tätä kieltä käytetään käyttöliittymässä, mikäli LTI-kirjautuminen ei välitä tietoa käyttäjän kielestä.",
  "settings-quota-size-help":
    "Määrittele tähän kilotavuina, kuinka paljon jokaisella käyttäjällä on tallennustilaa palvelussa. Arvon tulee olla välillä 1 - 2048.",

  "create-title": "Koodin tallennus",
  "create-lead":
    "Anna koodillesi sen sisältöä kuvaava otsikko ja liitä koodi alempaan tekstikenttään. Tallentamasi koodi näkyy vain itsellesi palvelun etusivulla, mutta halutessasi voit antaa koodilinkin kurssihenkilökunnalle neuvojen saamiseksi. Muut kurssin opiskelijat eivät voi nähdä koodia. Voit myös ladata tiedostoja suoraan etusivulta.",
  "create-expiration-info": "Tallentamasi koodi säilyy palvelussa {expirationTime, number} päivää.",
  "create-public-help":
    "Kurssin henkilökunta voi tehdä koodeista julkisia, jolloin kuka hyvänsä voi avata koodilinkin.",

  "view-lead":
    "Mikäli haluat jakaa tämän koodin kurssihenkilökunnalle, voit antaa linkin tälle sivulle. Muut opiskelijat eivät voi nähdä koodia.",

  "alert-no-teacher": "Et ole opettaja.",
  "alert-code-not-found": "Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta katsoa sitä.",
  "alert-code-not-found-delete": "Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta poistaa sitä.",
  "alert-remove-failed": "Koodin poistaminen epäonnistui.",
  "alert-code-not-found-edit": "Pyydettyä koodia ei löytynyt tai sinulla ei ole oikeutta muokata sitä.",
  "alert-code-removed": "Koodi on poistettu.",
  "alert-code-saved": "Koodi on tallennettu.",
  "alert-save-failed": "Tallentaminen epäonnistui.",
  "alert-settings-saved": "Kurssin asetukset on tallennettu.",
  "alert-settings-save-failed": "Kurssin asetusten tallentaminen ei onnistunut.",
  "alert-loading-data-failed": "Tietojen lataaminen epäonnistui.",
  "alert-too-big-file": "Tiedosto on liian suuri.",
  "alert-quota-exceeded": "Tallennustilaa ei ole jäljellä riittävästi.",
  "alert-copied": "Koodi on kopioitu leikepöydälle.",
  "alert-copy-failed": "Kopioiminen leikepöydälle epäonnistui.",
  "confirm-delete": "Haluatko varmasti poistaa tämän koodin?",

  "expires-soon": "Poistuu pian",
  create: "Luo uusi",
  caption: "Otsikko",
  created: "Luotu",
  size: "Koko",
  kilobytes: "kt",
  "course-name": "Kurssin nimi",
  "course-id": "Kurssin tunniste",
  "combine-with": "Yhdistä toiseen",
  "expiration-time": "Säilymisaika",
  "programming-language": "Ohjelmointikieli",
  save: "Tallenna",
  "copy-clipboard": "Kopioi leikepöydälle",
  edit: "Muokkaa",
  remove: "Poista",
  content: "Sisältö",
  cancel: "Peruuta",
  public: "Julkinen",
  "upload-hint": "Tallenna tiedostoja nopeasti pudottamalla ne tähän tai valitse tiedostot napsauttamalla tästä.",
  "upload-will-replace": "Samannimisen tiedoston lataaminen korvaa automaattisesti aiemman tiedoston.",
  download: "Lataa",
  "download-text": "Binääritiedoston sisältöä ei voi esittää selaimessa, mutta voit ladata tiedoston.",
  "binary-warning": "Ole varovainen tiedostojen kanssa, sillä niiden sisältö saattaa olla haitallista.",
  "no-items":
    "Sinulla ei ole yhtään tallennettua koodia tällä hetkellä. Voit tallentaa uuden koodinpätkän joko valitsemalla välilehden Uusi ja liittämällä halutun sinne tekstin tai suoraan raahamalla tiedostoja sivun alareunan latauslaatikkoon.",
  "quota-size": "Tallennustila",
};
