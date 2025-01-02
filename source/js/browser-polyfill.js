'use strict'

//-------
// Notes
//-------
/*
    This file will provide a "browser" object which will contain aliases to the "chrome" object. More importantly, it will also contain promise based versions of callback functions normally found in the "chrome" object.
*/

//-----------
// Variables
//-----------
const browser = { // will hold various functions
    'action': {
        // setIcon
        // setPopup
    },
    'permissions': {
        // contains
        // onAdded
        // onRemoved
        // request
    },
    'runtime': {
        // connect
        // getManifest
        // getURL
        // onConnect
    },
    'scripting': {
        // executeScript
    },
    'storage': {
        'local': {
            // get
            // remove
            // set
        }
    },
    'tabs': {
        // create
        // onRemoved
        // onUpdated
        // reload
        // update
    },
    'windows': {
        // getAll
        // getCurrent
        // update
    }
} // browser

//---------
// Aliases
//---------
browser.permissions.contains  = chrome.permissions.contains
browser.permissions.onAdded   = chrome.permissions.onAdded
browser.permissions.onRemoved = chrome.permissions.onRemoved
browser.permissions.request   = chrome.permissions.request

browser.runtime.connect     = chrome.runtime.connect
browser.runtime.getManifest = chrome.runtime.getManifest
browser.runtime.getURL      = chrome.runtime.getURL
browser.runtime.onConnect   = chrome.runtime.onConnect

browser.tabs.onRemoved = chrome.tabs.onRemoved
browser.tabs.onUpdated = chrome.tabs.onUpdated

//-----------
// Functions
//-----------
browser.action.setIcon = function browser_action_setIcon(details) {
    /*
    Set the browser action icon for one or all tabs.

    @param   {Object}   details  Details object. More info at https://developer.chrome.com/docs/extensions/reference/action/#method-setIcon
    @return  {*}                 Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.action.setIcon(details, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // action.setIcon

browser.action.setPopup = function browser_action_setPopup(details) {
    /*
    Set the browser action popup for one or more tabs.

    @param   {Object}   details  Details object. More info at https://developer.chrome.com/docs/extensions/reference/action/#method-setPopup
    @return  {*}                 Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.action.setPopup(details, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // action.setPopup

browser.scripting.executeScript = function browser_scripting_executeScript(injection) {
    /*
    Execute a client script in a tab.

    @param   {Object}  injection  Injection object. More info at https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript
    @return  {*}                  Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.scripting.executeScript(injection, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // scripting.executeScript

browser.storage.local.get = function browser_storage_local_get(keys) {
    /*
    Gets one or more items from local storage.

    @param   {*}  [keys]  Optional. Items to retrieve from local storage. String, array of strings, or NULL to retrieve all items. More info at https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
    @return  {*}          Promise that returns on object with any available items requested if successful, or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.get(keys, function(items) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(items)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.get

browser.storage.local.remove = function browser_storage_local_remove(keys) {
    /*
    Remove one or more items from local storage.

    @param   {*}  keys  A single string like "option_one" or an array of strings like ["option_one","option_two"]
    @return  {*}        Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.remove(keys, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.remove

browser.storage.local.set = function browser_storage_local_set(items) {
    /*
    Save one or more items to local storage.

    @param   {Object}  items  Object with one or more key value pairs to save to local storage. More info at https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
    @return  {*}              Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.set(items, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.set

browser.tabs.create = function browser_tabs_create(createProperties) {
    /*
    Create a tab and return a newly created tab object.

    @param   {Object}  createProperties  Create properties object. More info at https://developer.chrome.com/docs/extensions/reference/tabs/#method-create
    @return  {*}                         Promise that returns a newly created tab object if successful or an error if not.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.create(createProperties, function(tab) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(tab)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // tabs.create

browser.tabs.reload = function browser_tabs_reload(tabId, reloadProperties) {
    /*
    Reload a tab.

    @param   {Number}  tabId               ID number of the tab to reload.
    @param   {Object}  [reloadProperties]  Optional reload properties object. More info at https://developer.chrome.com/docs/extensions/reference/tabs/#method-reload
    @return  {*}                           Promise that returns nothing if successful or an error if unsuccessful.
    */

    reloadProperties = reloadProperties || {}

    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.reload(tabId, reloadProperties, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // tabs.reload

browser.tabs.update = function browser_tabs_update(tabId, updateProperties) {
    /*
    Update a tab.

    @param   {Number}  tabId             ID number of the tab to update.
    @param   {Object}  updateProperties  Update properties object. More info at https://developer.chrome.com/docs/extensions/reference/tabs/#method-update
    @return  {*}                         Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.tabs.update(tabId, updateProperties, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // tabs.update

browser.windows.getAll = function browser_windows_getAll(queryOptions) {
    /*
    Get all windows.

    @param   {Object}  [queryOptions]  Optional query options object. More info at https://developer.chrome.com/docs/extensions/reference/windows/#method-getAll
    @return  {Object}                  Windows array of objects. More info at https://developer.chrome.com/docs/extensions/reference/windows/#type-Window
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.windows.getAll(queryOptions, function(windows) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(windows)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // windows.getAll

browser.windows.getCurrent = function browser_windows_getCurrent(queryOptions) {
    /*
    Get the current window.

    @param   {Object}  [queryOptions]  Optional query options object. More info at https://developer.chrome.com/docs/extensions/reference/windows/#method-getCurrent
    @return  {Object}                  Window object. More info at https://developer.chrome.com/docs/extensions/reference/windows/#method-getCurrent
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.windows.getCurrent(queryOptions, function(obj) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(obj)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // windows.getCurrent

browser.windows.update = function browser_windows_update(windowId, updateInfo) {
    /*
    Update a window.

    @param   {Number}  windowId    ID of the window to update.
    @param   {Object}  updateInfo  Update object. More info at https://developer.chrome.com/docs/extensions/reference/windows/#method-update
    @return  {Object}              Window object. More info at https://developer.chrome.com/docs/extensions/reference/windows/#type-Window
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.windows.update(windowId, updateInfo, function(obj) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(obj)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // windows.update