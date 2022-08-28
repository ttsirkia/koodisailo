import { Translations } from "./translations";

export const en: Translations = {
  title: "Code Vault",

  "tabs-my": "Home",
  "tabs-create": "New",
  "tabs-settings": "Settings",

  "index-jumbotron-description":
    "Code Vault can be used to store code snippets for a few days and also share them safely with the course staff members.",
  "index-lead": "Use Code Vault by logging in via the learning management system.",

  "my-lead":
    "You can temporarily store code snippets here. You can also share a link to the snippet with the course staff members to get help. The other course participants cannot see your code.",
  "my-expiration-time": "The code snippets will be stored for {expirationTime, number} days.",
  "my-quota":
    "Total size: {totalSize, number} kB. You are using {percentage, number} % of the storage quota at the moment.",

  "settings-title": "General settings",
  "settings-connect-help":
    "If you want to combine multiple Code Vaults, write here the course id of the vault that will be used instead of this. All users except the course teacher will be redirected to that Code Vault.",
  "settings-expiration-help":
    "Define here how many days the code snippets will be stored. This does not change the expiration for already saved snippets. Valid range is between 1 and 365.",
  "settings-programming-language-help": "If this is empty, the highlighting library tries to recognize the language.",
  "settings-default-language": "Default UI language",
  "settings-default-language-help":
    "This UI language will be used if the LTI authentication does not provide the user language.",
  "settings-quota-size-help":
    "Define here in kilobytes how much data each user store in the service. Valid range is between 1 and 2048.",

  "create-title": "Save a snippet",
  "create-lead":
    "Give a title for your code snippet and paste the code to the second field. The snippet will be visible only for you in the home page of this service but you can give a link to the snippet to the course staff members to get help. The other course participants cannot see your code. You can also upload files directly in the home page.",
  "create-expiration-info": "The code snippet will be stored for {expirationTime, number} days.",
  "create-public-help":
    "As a course staff member you can make this snippet public. Anyone can open it by using a link.",

  "view-lead":
    "If you want to share this snippet with the course staff, give a link to the current page. Other course participants cannot see your code.",

  "alert-no-teacher": "You are not a teacher.",
  "alert-code-not-found": "The requested snippet could not be found or you are not allowed to view it.",
  "alert-code-not-found-delete": "The requested snippet could not be found or you are not allowed to remove it.",
  "alert-remove-failed": "Removing the code snippet failed.",
  "alert-code-not-found-edit": "The requested snippet could not be found or you are not allowed to edit it.",
  "alert-code-removed": "Code snippet is removed.",
  "alert-code-saved": "Code snippet is saved.",
  "alert-save-failed": "Saving failed.",
  "alert-settings-saved": "Course setting are saved.",
  "alert-settings-save-failed": "Saving the course settings failed.",
  "alert-loading-data-failed": "Loading data failed.",
  "alert-too-big-file": "The file exceeds the size limit.",
  "alert-quota-exceeded": "There is not enough space to store this item.",
  "confirm-delete": "Do you really want to remove this code snippet?",

  "expires-soon": "Expires soon",
  create: "New",
  caption: "Title",
  created: "Created",
  size: "Size",
  kilobytes: "kB",
  "course-name": "Course name",
  "course-id": "Course id",
  "combine-with": "Combine with",
  "expiration-time": "Expiration",
  "programming-language": "Programming language",
  save: "Save",
  "copy-clipboard": "Copy to clipboard",
  edit: "Edit",
  remove: "Remove",
  content: "Content",
  cancel: "Cancel",
  public: "Public",
  "upload-hint": "Drag files here to quickly upload them or click here to select files.",
  "upload-will-replace": "Uploading a file will automatically replace an existing file with the same file name.",
  download: "Download",
  "download-text": "The contents of a binary file cannot be shown in the browser but you can download the file.",
  "binary-warning": "Be careful with binary files as their content can be malicious.",
  "no-items":
    "You don't have any saved items at the moment. You can store new items by clicking New tab and pasting the code or directly dragging files to the upload area in the bottom of the page.",
  "quota-size": "Quota size",
};
