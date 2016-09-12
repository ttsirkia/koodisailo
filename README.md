# Koodisäilö

This app implements kind of Pastebin service. The idea is students can save their codes for a short period and continue working
with the file, for example, at home. Students can also safely give a link to their code to get help as only the
staff members can open the link.

Currently, only way to login is to use LTI. Course management systems such as [A+](https://github.com/Aalto-LeTech/a-plus)
support this mechanism to launch external tools. At the moment, the user interface is in Finnish only.

## Installation

Clone, type `npm install` and let npm fetch all the required modules.

The tool must be used with [proxy pass](http://nginx.org/en/docs/http/ngx_http_proxy_module.html) because of the URL mapping.
KeystoneJS requires that the application is in the root. As this is not always possible, configure Nginx so that
`/koodisailo/` points to `http://localhost:3001/`.

In order to use the Admin UI provided by KeystoneJS, configure the admin account information in `updates/0.0.1-admins.js`.
