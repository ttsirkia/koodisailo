# Koodisäilö

This app implements kind of a Pastebin service. The idea is students can save their codes for a short period
and continue working with the file, for example, at home. Students can also safely give a link to their code
to get help as only the staff members can open the link.

Currently, the only way to log in to the production environment is to use the LTI launch mechanism. Course
management systems such as [A+](https://github.com/Aalto-LeTech/a-plus) support this to launch external tools
and provide the user information.

## Version 3.0

What's new in this version?

### Updated technology stack

The tool is almost completely rewritten with newer and up-to-date technologies.

The main libraries and technologies used in version 3.0 are (in alphabetical order):

- [Bootstrap](https://getbootstrap.com/)
- [Highlight.js](https://highlightjs.org/)
- [Next.js](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://reactjs.org/)
- [React Hot Toast](https://react-hot-toast.com/)
- [tRPC](https://trpc.io/)
- [Typegoose](https://typegoose.github.io/typegoose/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)

### Uploading files

It is now possible to also directly drag files to upload them instead of manually copying and pasting the content.
The feature also supports binary files (although they cannot be shown in the browser but can be downloaded).

### Multiple LTI keys

It is now possible to define as many LTI keys for different learning management systems as needed instead of
sharing only one key with all of them.

### Storage quota

The previous version did not have any configurable storage quota. Now it can be defined how many kilobytes each
user can use to store their code snippets. The upper limit is two megabytes as all data is stored in the database.
Default quota is 500 kB.

## Installation

Install [Node.js](https://nodejs.org/en/download/) (tested with version 16.17.0) and
[MongoDB](https://www.mongodb.com/try/download/community) (tested with version 6.0.1).

Then, `git clone`, `npm install`, and `npm run build`. Check the configuration in `.env`. If you need to replace
these default values, it is suggested to create a new file `.env.local` which is already defined in `.gitignore`
and it will automatically override `.env`.

The application must be used with [proxy pass](http://nginx.org/en/docs/http/ngx_http_proxy_module.html). The
service is configured so that it will be available in port 3001 and with the prefix `/koodisailo` in the URL.
Use the following configuration with NGINX:

```
location /koodisailo {
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header Host $http_host;
  proxy_set_header X-NginX-Proxy true;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_pass http://localhost:3001/koodisailo;
  proxy_redirect off;
  proxy_http_version 1.1;
}
```

Please notice that this configuration is not the same as in [Neuvontajono](https://github.com/ttsirkia/neuvontajono).

## LTI Configuration

LTI version 1.1 is currently supported.

### Managing LTI keys

There is a specific script `ltitool.ts` to configure the keys. In order to use it, you need to install `ts-node`:

```
> sudo npm install -g typescript ts-node
```

The tool provides four commands: `delete`, `list`, `set`, and `show`.

#### Create a new key:

```
> ts-node ltitool --ltiver=11 --key=test set
```

The tool will output a new random secret for the key `test`. If you run the same command again, a new secret will
be assigned to the same key. You can also manually specify the secret by using the `--secret` parameter.

#### Delete a key:

```
> ts-node ltitool --ltiver=11 --key=test delete
```

#### List all keys:

```
> ts-node ltitool --ltiver=11 list
```

This will show the names of the existing keys but not the secrets.

#### Show the secret:

```
> ts-node ltitool --ltiver=11 --key=test show
```

Please notice that the keys are stored in the database without any encryption.

### Launch URL

Configure your LMS so that the LTI launch address will be `http://your.server.example/koodisailo/api/lti/v11/login`.

## Running the service

Use `upstart`, `systemd`, or such mechanism to launch the application (`npm run start`) when the computer and
operating system starts. The mechanism
must also restart the application if it crashes for some reason.

It cannot be started before `npm run build` is initially executed after cloning the repository or whenever the source
code has changed.

## Development

You can run the tool in development mode with the command `npm run dev`. Please notice that the hot module reload does
not work properly with databse models so if you make any changes to those, always restart the process manually.

In this mode, you can bypass the LTI login by launching the UI with an URL like this:
`http://localhost:3001/koodisailo/api/login/testLogin?firstName=First&lastName=Last&course=Course+1&role=teacher&language=fi`

This allow easily changing the user, course, roles (`student`, `staff` or `teacher`) and languages (`en` and `fi`).

The source code is formatted with [Prettier](https://prettier.io/) (used as a plugin inside [VS Code](https://code.visualstudio.com/))
using maximum line length of 120 characters and two spaces to indent code.

