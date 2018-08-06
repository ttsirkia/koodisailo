# Koodisäilö

This app implements kind of a Pastebin service. The idea is students can save their codes for a short period
and continue working with the file, for example, at home. Students can also safely give a link to their code
to get help as only the staff members can open the link.

Currently, the only way to login is to use the LTI launch mechanism. Course management systems such as [A+](https://github.com/Aalto-LeTech/a-plus)
support this to launch external tools and provide the user information.

## Version 2.0

The technology stack was updated in version 2.0 to run the application with up-to-date versions of the required
libraries. The most important factor was to update [the KeystoneJS framework](https://github.com/keystonejs/keystone)
to version 4.0 after it was finally published.

### Support for multiple user interface languages

The user interface can now be translated into multiple languages. Currently, there are translations for Finnish
and English. The parameter `launch_presentation_locale` in the LTI launch request defines the language, or a default
language will be used if the parameter is missing. The user interface is created with [React](https://reactjs.org/)
and the localization is made with the [`react-intl`](https://github.com/yahoo/react-intl) library.

### Public code snippets

It is now possible for course staff members to create public code snippets that anyone having the link can see.

## Installation

Install [Node.js](https://nodejs.org/en/download/) (tested with version 8.10) and [MongoDB](https://www.mongodb.com/download-center)
(tested with version 3.6).

Then, `git clone`, `npm install`, and `npm run build`. Check the configuration in `server.js` and change the keys.

The application must be used with [proxy pass](http://nginx.org/en/docs/http/ngx_http_proxy_module.html) because of
the URL mapping. KeystoneJS requires that the application is in the root. As this is not always possible, configure
Nginx so that `/koodisailo/` points to `http://localhost:3001/`. The URL must be rewritten so that the `/koodisailo`
part is removed. The proxy pass can be configured with the following setup:

```
location /koodisailo/ {
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header Host $http_host;
  proxy_set_header X-NginX-Proxy true;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_pass http://localhost:3001/;
  proxy_redirect off;
  proxy_http_version 1.1;
}
```

In order to use the Admin UI provided by KeystoneJS, configure the admin account information in `updates/0.0.1-admins.js`.
Although the Admin UI is not normally needed, remember to change the credentials to prevent unpriviledged access.
Admin UI can be accessed in `http://localhost:3001/keystone`.

Configure the LMS so that the LTI launch address will be `http://your.server.example/koodisailo/login/lti`.
Check the keys once more in `server.js`.

Use `upstart`, `systemd`, or such mechanism to launch the application (`node server.js`) when the computer and
operating system starts. Make sure that the environment variable `NODE_ENV` is set to `production`. The mechanism
must also restart the application if it crashes for some reason.
