# Pluma

A web browser extension that allows you to spellcheck and edit text.

Available in Chrome, Edge, and Firefox.

## Navigation

* [Install](#install)
* [Development](#development)
* [Deploy](#deploy)
* [License](#license)

## Install

For Chrome, install via the `Pluma` page on the [Chrome Web Store](https://chrome.google.com/webstore/detail/pluma/amjbjafbfajolchpcbfjpdggaeheicmb).

For Edge, install via the `Pluma` page on the [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/pluma/balfmhikfnkoajpljgjgcmfhcbpjpomj) site.

For Firefox, install via the `Pluma` page on the [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pluma-nightmode/) site.

## Development

Optionally set the `log` setting inside `source/js/shared.js` to `true` to log information to the console.

Use [Feri](https://github.com/nightmode/feri) to continually publish from the `source` directory to the `deploy` directory.

### Development in Chrome

Navigate to `chrome://extensions` and enable developer mode.

Use `load unpacked` and select `deploy` as the extension folder.

### Development in Edge

Navigate to `edge://extensions/` and enable developer mode.

Use `load unpacked` and select `deploy` as the extension folder.

### Development in Firefox

Navigate to `about:debugging` and enable `add-on debugging`.

Use `load temporary add-on` and select the `manifest.json` file within the `deploy` folder.

## Deploy

Make sure the `log` setting inside `source/js/shared.js` is set to `false`.

Run Feri once to publish any changes from the `source` directory to the `deploy` directory.

### Deploy for Chrome

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory, except for the `_metadata` folder which may or may not exist.

Upload the zip file to the Chrome Web Store via the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).

### Deploy for Edge

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory, except for the `_metadata` folder which may or may not exist.

Upload the zip file to the Microsoft Edge Addons site via the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview).

### Deploy for Firefox

Make sure the Feri build tool is not running.

Edit `source/manifest.json` to make the following temporary changes.

Replace the `background` object with the following object.

```
"background": {
    "scripts": ["background.js"]
},
```

Add the following object after the `background` object.

```
"browser_specific_settings": {
    "gecko": {
        "id": "pluma@___.addons.mozilla.org",
        "strict_min_version": "109.0"
    }
},
```

Replace the underscores in the ID of the pasted object with your username or another unique string that you always publish your extensions with.

Run Feri once to publish from the `source` directory to the `deploy` directory.

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory and set the zip file aside for a moment.

Use GitHub Desktop to discard the changes to `source/manifest.json`.

Run the Feri build tool once to publish from the `source` directory to the `deploy` directory.

Upload the zip file to the Firefox Add-ons site via the [Developer Hub](https://addons.mozilla.org/en-US/developers/addons).

## License

[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

This work has been marked as dedicated to the public domain.