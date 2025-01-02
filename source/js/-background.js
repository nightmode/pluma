'use strict' // not technically needed since this file will be included in another file that will specify 'use strict' first

//-------
// Notes
//-------
/*
    This background JavaScript file is only meant to be included in the root level service worker.

    This software uses snake case (underscores) for variables.
*/

//-----------
// Variables
//-----------
const local = {
    'function': { // will hold various functions
        // all_from_storage

        // extension_page

        // icon_set
        // icon_set_all_tabs
        // icon_set_one_tab

        // install_or_upgrade

        // listener_permissions
        // listener_port_connect
        // listener_port_disconnect
        // listener_port_message
        // listener_service_worker_install
        // listener_tab_removed
        // listener_tab_updated

        // option_cleanup
        // option_to_storage

        // permissions_check
        // permissions_check_and_icons

        // popup_set

        // port_message_all
        // port_message_all_except
        // port_message_all_status_tab

        // preference_icon_color
        // preference_theme
        // preference_theme_popup
        // preference_to_storage

        // show_extension_page_if_needed
        // show_message_relayed

        // start
        // start_done

        // storage_get
        // storage_remove
        // storage_set

        // tabs_allow_reload_inject_all
        // tabs_allow_reload_inject_one
        // tabs_inject_all
        // tabs_inject_one
        // tabs_inject_queue
        // tabs_status_init

        // url_setup

        // version_from_storage
        // version_less_than
        // version_to_storage
    },
    'option': { // defaults for user customizable values which may get replaced with values from storage
        'global': false, // allow edit mode globally
        'spellcheck': true, // allow spellcheck globally
        'tab': { // allow edit mode for one specific tab
            // 1: false
        }
    },
    'port': [], // array of port objects used to communicate with other scripts
    'preference': { // defaults for user customizable values which may get replaced with values from storage
        'browser_is_dark': false,       // true or false
        'icon_color'     : 'automatic', // "automatic", "blue", "dark", or "light"
        'theme'          : 'light',     // "automatic", "dark", or "light"
        'theme_popup'    : 'automatic'  // "automatic", "dark", or "light"
    },
    'setting': { // settings used internally, not customizable by the user
        'show_extension': false, // can be set true by install_or_upgrade()
        'show_message': { // properties which can be set true by install_or_upgrade()
            'chrome_extensions_toolbar': false,
            'edge_extensions_toolbar': false,
            'firefox_extensions_toolbar': false,
            'guide': false,
            'upgrade_complete': false
        }
    },
    'status': {
        'permissions': true, // false if origin permissions are needed in firefox
        'start_activated': false, // true if the start function has ever been called
        'start_done': false, // true once the start function is completely done
        'tab': { // last known status of a tab including if edit mode is enabled via the allow property
            /*
            1: {
                allow     : true, // boolean or undefined
                hostname  : 'www.microsoft.com',
                id        : 1,
                spellcheck: true, // boolean or undefined
                url       : 'https://www.microsoft.com'
            }
            */
        },
        'tab_stringify': '{}', // stringified version of status.tab for figuring out if tab.status has changed since this string was last saved
        'tab_inject_queue': { // keep track of which tab ids are currently queued for injecting
            /*
            1: 2 // for example, tab id one has two requests queued
            */
        }
    },
    'url': { // will be populated by url_setup()
        // the first level will contain theme properties "dark" and "light"
        // the second level will contain icon color properties "blue", "dark", and "light"
        // the third level will contain page file names like "options.html"
    },
    'version': browser.runtime.getManifest().version // getManifest is not a promise
} // local

//-----------
// Functions
//-----------
const all_from_storage = local.function.all_from_storage = async function all_from_storage() {
    /*
    Load options and preferences from storage.
    */

    let storage = {}

    try {
        storage = await browser.storage.local.get(null)
    } catch (error) {
        log('all_from_storage -> error ->', error.message)
    } // try

    // options
    for (const property in local.option) {
        const storage_option = storage['option_' + property]

        if (storage_option !== undefined) {
            local.option[property] = storage_option
        } // if
    } // for

    // preferences
    for (const property in local.preference) {
        const storage_preference = storage['preference_' + property]

        if (storage_preference !== undefined) {
            local.preference[property] = storage_preference
        } // if
    } // for
} // all_from_storage

const extension_page = local.function.extension_page = async function extension_page(page, hash) {
    /*
    Focus an already open extension page or open a new extension page.

    @param  {String}  [page]  Optional. Page like "about". Defaults to "options".
    @param  {String}  [hash]  Optional. Hash ID to scroll to like "change-log".
    */

    page = page || 'options'
    hash = hash || ''

    const theme = preference_theme()
    const icon_color = preference_icon_color()

    let url = local.url[theme][icon_color][page]

    if (hash !== '') {
        url += '#' + hash
    } // if

    let open_new_page = true // default

    if (local.port.filter(port => port.name !== 'popup').length > 0) {
        // focus an existing page that is not a popup
        const tab = local.port[0].sender.tab

        try {
            await browser.windows.update(tab.windowId, { focused: true })
            await browser.tabs.update(tab.id, { active: true, url: url })

            open_new_page = false
        } catch (error) {
            log('extension_page -> error ->', error.message)
        } // try
    } // if

    if (open_new_page) {
        // open a new page
        try {
            await browser.tabs.create({ url: url })
        } catch (error) {
            log('extension_page -> tab create error ->', error.message)
        } // try
    } // if
} // extension_page

const icon_set = local.function.icon_set = async function icon_set(color, tab_id) {
    /*
    Set the browser action icon for one or all tabs.

    @param  {String}  [color]   An available icon color like "blue". Defaults to "gray".
    @param  {Number}  [tab_id]  Optional tab ID to set. If not specified, all tabs will be set.
    */

    color = color || 'gray'
    tab_id = tab_id || 0

    const details = {
        'path': {
            '16':  'images/icon/status/status-' + color + '-16.png',
            '24':  'images/icon/status/status-' + color + '-24.png',
            '32':  'images/icon/status/status-' + color + '-32.png',
            '48':  'images/icon/status/status-' + color + '-48.png',
            '64':  'images/icon/status/status-' + color + '-64.png',
            '96':  'images/icon/status/status-' + color + '-96.png',
            '128': 'images/icon/status/status-' + color + '-128.png'
        },
        'tabId': (tab_id > 0) ? tab_id : null // null will set all tabs
    } // details

    try {
        await browser.action.setIcon(details)
    } catch (error) {
        log('icon_set -> error ->', error.message)
    } // try
} // icon_set

const icon_set_all_tabs = local.function.icon_set_all_tabs = async function icon_set_all_tabs() {
    /*
    Loop through local.status.tab and call icon_set_one_tab() for each tab ID.
    */

    const promises = []

    for (const property in local.status.tab) {
        const tab = local.status.tab[property]

        promises.push(
            icon_set_one_tab(tab.id)
        )
    } // for

    await Promise.allSettled(promises)
} // icon_set_all_tabs

const icon_set_one_tab = local.function.icon_set_one_tab = async function icon_set_one_tab (tab_id) {
    /*
    Set one tab icon to the correct color.

    @param  {Number}  tab_id  Number of the tab ID to set.
    */

    const tab = local.status.tab[tab_id]

    if (tab === undefined) {
        // the requested tab no longer exists
        return 'early'
    } // if

    let color = 'gray' // default

    if (local.status.permissions === false) {
        color = 'orange'
    } else if (tab.allow === true) {
        color = 'blue'
    } else if (local.preference.browser_is_dark) {
        color = 'white'
    } // if

    await icon_set(color, tab_id)
} // icon_set_one_tab

const install_or_upgrade = local.function.install_or_upgrade = async function install_or_upgrade() {
    /*
    If needed, run any install or upgrade tasks.
    */

    const version_storage = await version_from_storage()

    if (local.version !== version_storage) {
        // manifest version does not match the version in storage so this is a first install or upgrade

        if (version_storage === '') {
            // first install
            log('install_or_upgrade -> first install')

            // save default options to storage
            for (const property in local.option) {
                await option_to_storage(property)
            } // for

            // save default preferences to storage
            for (const property in local.preference) {
                await preference_to_storage(property)
            } // for

            // show extension page
            local.setting.show_extension = true

            if (shared.browser.chrome === true) {
                // show a one-time message about the chrome extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.chrome_extensions_toolbar = true
            } else if (shared.browser.edge === true) {
                // show a one-time message about the edge extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.edge_extensions_toolbar = true
            } else if (shared.browser.firefox === true) {
                // show a one-time message about the firefox extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.firefox_extensions_toolbar = true
            } // if

            // show a one-time message about viewing the guide or at least being aware of having to use modifier keys to click links when in edit mode
            local.setting.show_message.guide = true
        } else {
            // upgrade
            log('install_or_upgrade -> upgrade')

            let check_version = ''
            const message_upgrade = 'install_or_upgrade -> upgrade for version less than '

            check_version = '2025.1.1.0'
            if (version_less_than(version_storage, check_version)) {
                // version_storage is less than check_version
                log(message_upgrade + check_version)

                // upgrade logic
            } // if

            /*
            // show a one-time message
            local.setting.show_message.upgrade_complete = true

            // show extension page
            local.setting.show_extension = true
            */
        } // upgrade

        if (local.setting.show_extension === true) {
            log('install_or_upgrade -> show extension')
        } // if

        // save the current version to storage
        await version_to_storage()
    } // if
} // install_or_upgrade

const listener_permissions = local.function.listener_permissions = async function listener_permissions() {
    /*
    Listener for browser.permissions.onAdded and browser.permissions.onRemoved events.
    */

    await permissions_check_and_icons()

    // send a notification to all ports
    port_message_all({
        'subject': 'status-permissions',
        'value'  : local.status.permissions
    })
} // listener_permissions

const listener_port_connect = local.function.listener_port_connect = function listener_port_connect(port) {
    /*
    Listener for browser.runtime.onConnect events.

    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // log('listener_port_connect -> port connected')

    local.port.push(port)

    port.onDisconnect.addListener(listener_port_disconnect)

    port.onMessage.addListener(listener_port_message)
} // listener_port_connect

const listener_port_disconnect = local.function.listener_port_disconnect = function listener_port_disconnect(port) {
    /*
    Listener for port.onDisconnect events.

    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // log('listener_port_disconnect -> disconnected')

    local.port = local.port.filter(keep => keep !== port)
} // listener_port_disconnect

const listener_port_message = local.function.listener_port_message = async function listener_port_message(obj, port) {
    /*
    Listener for port.onMessage events.

    @param  {Object}  obj   Object like {subject:"option-set"}
    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // manifest version 3 service workers must register their listeners early, so early that start() may not have had a chance to finish yet
    try {
        await start_done()
    } catch (error) {
        log('listener_port_message -> error ->', error)

        return 'early'
    } // try

    switch (obj.subject) {
        case 'iframe-load':
            // message from a "pluma.js" file
            // new iframe loaded so inject "pluma.js" into all frames of the tab that sent this message

            const tab_id = port.sender.tab.id

            log('listener_port_message -> iframe-load -> tab ->', tab_id)

            await tabs_inject_queue(tab_id)

            break
        case 'init-about':
            // log('listener_port_message -> init-about')

            port.postMessage({
                'subject'   : 'init-about',
                'option'    : local.option,
                'preference': local.preference,
                'status'    : {
                    'permissions': local.status.permissions
                },
                'version'   : local.version
            })

            break
        case 'init-guide':
            // log('listener_port_message -> init-guide')

            port.postMessage({
                'subject'   : 'init-guide',
                'preference': local.preference,
                'status'    : {
                    'permissions': local.status.permissions
                }
            })

            break
        case 'init-options':
            // log('listener_port_message -> init-options')

            port.postMessage({
                'subject'   : 'init-options',
                'option'    : local.option,
                'preference': local.preference,
                'setting'   : {
                    'show_message': local.setting.show_message
                },
                'status'    : {
                    'permissions': local.status.permissions,
                    'tab'        : local.status.tab
                }
            })

            show_message_relayed()

            break
        case 'init-popup':
            // log('listener_port_message -> init-popup')

            port.postMessage({
                'subject'   : 'init-popup',
                'option'    : local.option,
                'preference': local.preference,
                'status'    : {
                    'permissions': local.status.permissions,
                    'tab'        : local.status.tab
                }
            })

            break
        case 'init-preferences':
            // log('listener_port_message -> init-preferences')

            port.postMessage({
                'subject'   : 'init-preferences',
                'preference': local.preference,
                'status'    : {
                    'permissions': local.status.permissions
                }
            })

            break
        case 'option-set': {
            log('listener_port_message -> option-set -> ' + obj.name, obj.value)

            if (local.option[obj.name] === undefined) {
                // option does not exist
                log('listener_port_message -> option-set -> option "' + obj.name + '" does not exist')

                break
            } // if

            // save option
            local.option[obj.name] = obj.value

            // save option to storage
            await option_to_storage(obj.name)

            // send updated option to all ports except the port that originally messaged us
            port_message_all_except(port, {
                'subject': 'option-set',
                'name'   : obj.name,
                'value'  : obj.value
            })

            switch (obj.name) {
                case 'global':
                case 'spellcheck':
                case 'tab':
                    await tabs_allow_reload_inject_all()

                    await icon_set_all_tabs()

                    break
            } // switch

            break
        } // case "option-set"
        case 'page-options':
            // log('listener_port_message -> page-options')

            // focus or open a new options page
            await extension_page('options')

            break
        case 'preference-set':
            log('listener_port_message -> preference-set -> ' + obj.name, obj.value)

            if (local.preference[obj.name] === undefined) {
                // preference does not exist
                log('listener_port_message -> preference-set -> preference "' + obj.name + '" does not exist')

                break
            } // if

            if (local.preference[obj.name] === obj.value) {
                // preference value has not changed
                break
            } // if

            // save preference
            local.preference[obj.name] = obj.value

            // save preference to storage
            await preference_to_storage(obj.name)

            // send updated preference to all ports except for the port that originally messaged us
            port_message_all_except(port, {
                'subject': 'preference-set',
                'name'   : obj.name,
                'value'  : obj.value
            })

            switch (obj.name) {
                case 'browser_is_dark':
                    await popup_set()

                    await icon_set_all_tabs()

                    break
                case 'icon_color':
                    await popup_set()

                    break
                case 'theme':
                    // do nothing

                    break
                case 'theme_popup':
                    await popup_set()

                    break
            } // switch

            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const listener_service_worker_install = local.function.listener_service_worker_install = function listener_service_worker_install(event) {
    /*
    Listener for service worker install events.

    @param  {Object}  event  Object with a type property that should be "install".
    */

    log('listener_service_worker_install -> event.type ->', event.type)

    self.skipWaiting() // a promise we do not need to wait for

    log('listener_service_worker_install -> skipped waiting')
} // listener_service_worker_install

const listener_tab_removed = local.function.listener_tab_removed = async function listener_tab_removed(tab_id, remove_info) {
    /*
    Listener function for browser.tabs.onRemoved events.

    @param  {Number}  tab_id       ID of the tab that was removed.
    @param  {Object}  remove_info  Not used.
    */

    log('listener_tab_removed ->', tab_id)

    // manifest version 3 service workers must register their listeners early, so early that start() may not have had a chance to finish yet
    try {
        await start_done()
    } catch (error) {
        log('listener_tab_removed -> error ->', error)

        return 'early'
    } // try

    delete local.status.tab[tab_id]

    port_message_all_status_tab() // this will only message all ports if status.tab has changed since it was last sent to all ports

    await option_cleanup()
} // listener_tab_removed

const listener_tab_updated = local.function.listener_tab_updated = async function listener_tab_updated(tab_id, change_info, tab) {
    /*
    Listener function for browser.tabs.onUpdated events.

    @param  {Number}  tab_id       ID of the tab that was updated.
    @param  {Object}  change_info  Various change information. More info at
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#changeInfo
    @param  {Object}  tab          Various tab information. More info at
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
    */

    // manifest version 3 service workers must register their listeners early, so early that start() may not have had a chance to finish yet
    try {
        await start_done()
    } catch (error) {
        log('listener_tab_updated -> error ->', error)

        return 'early'
    } // try

    if (change_info.status === 'loading' || change_info.status === 'complete') {
        const tab_url = tab.url.toLowerCase()

        if (tab_url.indexOf('http:') === 0 || tab_url.indexOf('https:') === 0) {
            log('listener_tab_updated ->', tab_id, change_info.status, tab_url)
        } // if

        await tabs_allow_reload_inject_one(tab_id, tab.url, false) // false meaning do not reload or inject "pluma.js" into this tab

        if (change_info.status === 'complete') {
            await tabs_inject_one(tab_id)
        } // if

        await icon_set_one_tab(tab_id)
    } // if
} // listener_tab_updated

const option_cleanup = local.function.option_cleanup = async function option_cleanup(init) {
    /*
    Cleanup as in remove options for tabs that no longer exist.

    @param  {Boolean}  [init]  Optional. If true, do not message other ports after cleaning up.
    */

    init = init || false // default

    let cleanup = false // default

    for (const tab_id in local.option.tab) {
        const tab = local.status.tab[tab_id]

        if (tab === undefined) {
            // remove this option
            delete local.option.tab[tab_id]

            cleanup = true
        } else {
            // tab option exists
            if (tab.allow === false) {
                // remove this option
                delete local.option.tab[tab_id]

                cleanup = true
            } // if
        } // if
    } // for

    if (cleanup === true) {
        await option_to_storage('tab')

        if (init === false) {
            // send updated option to all ports
            port_message_all({
                'subject': 'option-set',
                'name'   : 'tab',
                'value'  : local.option.tab
            })
        } // if
    } // if
} // option_cleanup

const option_to_storage = local.function.option_to_storage = async function option_to_storage(property) {
    /*
    Save a single local option to storage.

    @param  {String}  property  Property name like "global".
    */

    await storage_set({
        ['option_' + property]: local.option[property]
    })
} // option_to_storage

const permissions_check = local.function.permissions_check = async function permissions_check() {
    /*
    Check permissions to make sure the "host_permissions" array in our manifest file is being honored.

    @return  {Boolean}  result  True or false.
    */

    let result = true // default

    if (shared.browser.firefox === true) {
        result = await browser.permissions.contains(shared.permissions)
    } // if

    return result
} // permissions_check

const permissions_check_and_icons = local.function.permissions_check_and_icons = async function permissions_check_and_icons(update_icons) {
    /*
    Check permissions, update the local.status.permissions boolean, and optionally update all tab status icons, if needed.

    @param  {Boolean}  [update_icons]  Optional. If true, update all tab status icons, if needed. Defaults to true.
    */

    if (shared.browser.firefox === false) {
        return 'early'
    } // if

    update_icons = (update_icons === false) ? false : true

    const previous_permissions = local.status.permissions

    local.status.permissions = await permissions_check()

    if (update_icons === true) {
        if (local.status.permissions !== previous_permissions) {
            await icon_set_all_tabs()
        } // if
    } // if
} // permissions_check_and_icons

const popup_set = local.function.popup_set = async function popup_set() {
    /*
    Set the popup location using the current popup theme and icon color.
    */

    const theme = preference_theme_popup()
    const icon_color = preference_icon_color()
    const popup = '/page/' + theme + '/' + icon_color + '/popup.html'

    try {
        log('popup_set -> ' + popup)

        await browser.action.setPopup({
            popup: popup
        })
    } catch (error) {
        log('popup_set -> error ->', error.message)
    } // try
} // popup_set

const port_message_all = local.function.port_message_all = function port_message_all(obj) {
    /*
    Send an object to all connected ports.

    @param  {Object}  obj  An object.
    */

    for (const port of local.port) {
        port.postMessage(obj)
    } // for
} // port_message_all

const port_message_all_except = local.function.port_message_all_except = function port_message_all_except(port, obj) {
    /*
    Send an object to all connected ports except one.

    @param  {Object}  port  A port object that should not have anything sent to it.
    @param  {Object}  obj   An object to send.
    */

    for (let i = 0; i < local.port.length; i++) {
        if (local.port[i] !== port) {
            local.port[i].postMessage(obj)
        } // if
    } // for
} // port_message_all_except

const port_message_all_status_tab = local.function.port_message_all_status_tab = function port_message_all_status_tab() {
    /*
    Send a "status-tab" message to all ports but only if there have been changes to the local.status.tab object since it was last sent.
    */

    const current  = JSON.stringify(local.status.tab)
    const previous = local.status.tab_stringify

    if (current === previous) {
        return 'early'
    } // if

    local.status.tab_stringify = current

    // send updated tab status to all ports
    port_message_all({
        'subject': 'status-tab',
        'value'  : local.status.tab
    })
} // port_message_all_status_tab

const preference_icon_color = local.function.preference_icon_color = function preference_icon_color() {
    /*
    Return the current icon color preference, with a value like "automatic" translated to the correct "dark" or "light" variant.

    @return  {String}  Icon color like "blue", "dark", or "light".
    */

    let icon_color = local.preference.icon_color

    if (icon_color === 'automatic') {
        if (local.preference.browser_is_dark) {
            icon_color = 'light'
        } else {
            icon_color = 'dark'
        } // if
    } // if

    return icon_color
} // preference_icon_color

const preference_theme = local.function.preference_theme = function preference_theme() {
    /*
    Return the current theme preference, with a value like "automatic" translated to the correct "dark" or "light" variant.

    @return  {String}  Theme like "dark" or "light".
    */

    let theme = local.preference.theme

    if (theme === 'automatic') {
        if (local.preference.browser_is_dark) {
            theme = 'dark'
        } else {
            theme = 'light'
        } // if
    } // if

    return theme
} // preference_theme

const preference_theme_popup = local.function.preference_theme_popup = function preference_theme_popup() {
    /*
    Return the current popup theme preference, with a value like "automatic" translated to the correct "dark" or "light" variant.

    @return  {String}  Theme like "dark" or "light".
    */

    let theme = local.preference.theme_popup

    if (theme === 'automatic') {
        if (local.preference.browser_is_dark) {
            theme = 'dark'
        } else {
            theme = 'light'
        } // if
    } // if

    return theme
} // preference_theme_popup

const preference_to_storage = local.function.preference_to_storage = async function preference_to_storage(property) {
    /*
    Save a single local preference to storage.

    @param  {String}  property  Property name like "theme".
    */

    await storage_set({
        ['preference_' + property]: local.preference[property]
    })
} // preference_to_storage

const show_extension_page_if_needed = local.function.show_extension_page_if_needed = async function show_extension_page_if_needed() {
    /*
    Open an extension page, if needed.
    */

    if (local.setting.show_extension === true) {
        local.setting.show_extension = false

        await extension_page('options')
    } // if
} // show_extension_page_if_needed

const show_message_relayed = local.function.show_message_relayed = function show_message_relayed() {
    /*
    Set all local.setting.show_message properties to false, if needed.
    */

    for (const property in local.setting.show_message) {
        if (local.setting.show_message[property] === true) {
            // set property to false since a client page has already received this information from a port.postMessage call
            local.setting.show_message[property] = false
        } // if
    } // for
} // show_message_relayed

const start = local.function.start = async function start() {
    /*
    Start the background service worker.
    */

    if (local.status.start_activated === true) {
        // start should only be run once
        return 'early'
    } // if

    local.status.start_activated = true

    await shared_start() // from shared.js

    url_setup()

    await install_or_upgrade()

    await all_from_storage()

    await tabs_status_init()

    await option_cleanup(true) // true meaning we are initializing, do not message other ports after cleaning

    await tabs_inject_all()

    await popup_set()

    await permissions_check_and_icons(false) // false meaning do not update icon colors for individual tabs

    // set specific action icon colors for individual tabs
    await icon_set_all_tabs()

    await show_extension_page_if_needed()

    local.status.start_done = true

    log('start -> done')
} // start

const start_done = local.function.start_done = function start_done() {
    /*
    Wait until the "start" function is done before returning.

    @return  {Promise}
    */

    if (local.status.start_done === true) {
        return 'early'
    } // if

    let timer = '' // will become a setInterval timer that will be cleared after we no longer need it

    let count = 0 // keep track of how many times we have checked to see if the "start" function is done

    return new Promise(function(resolve, reject) {
        // check every every 5 milliseconds to see if the "start" function is done
        timer = setInterval(function() {
            count++

            if (local.status.start_done === true) {
                clearInterval(timer)

                resolve()
            } else if (count > 25000) { // 25 seconds
                // start should have finished a long time ago
                clearInterval(timer)

                reject('timeout waiting for start')
            } // if
        }, 5)
    }) // promise
} // start_done

const storage_get = local.function.storage_get = async function storage_get(key) {
    /*
    Get a value from storage by providing a named key.

    @param   {String}  key  String like "option_global".
    @return  {*}            Boolean, Object, Number, or String.
    */

    let obj = {} // default

    try {
        obj = await browser.storage.local.get(key)
    } catch (error) {
        log('storage_get -> error ->', error.message)
    } // try

    return obj[key] // may return undefined if the key does not exist for this object
} // storage_get

const storage_remove = local.function.storage_remove = async function storage_remove(key) {
    /*
    Remove an object from storage by providing a named key.

    @param  {String}  key  String like "option_defunct".
    */

    await browser.storage.local.remove(key)
} // storage_remove

const storage_set = local.function.storage_set = async function storage_set(obj) {
    /*
    Save an object to storage.

    @param  {Object}  obj  Object like {option_global:true}
    */

    try {
        await browser.storage.local.set(obj)
    } catch (error) {
        log('storage_set -> error ->', error.message)
    } // try
} // storage_set

const tabs_allow_reload_inject_all = local.function.tabs_allow_reload_inject_all = async function tabs_allow_reload_inject_all() {
    /*
    Loop through local.status.tab and call tabs_allow_reload_inject_one() for each tab ID.
    */

    const promises = []

    for (const property in local.status.tab) {
        const tab = local.status.tab[property]

        promises.push(
            tabs_allow_reload_inject_one(tab.id, tab.url, true) // true meaning reload or inject "pluma.js" into this tab, if needed
        )
    } // for

    await Promise.allSettled(promises)
} // tabs_allow_reload_inject_all

const tabs_allow_reload_inject_one = local.function.tabs_allow_reload_inject_one = async function tabs_allow_reload_inject_one(tab_id, tab_url, reload_inject) {
    /*
    Figure out if a tab should allow edit mode or not. Also notify all ports about tab status changes. Also reload if a tab previously allowed edit mode but currently does not. Also reload if a tab is in edit mode and its spellcheck option has changed. Also inject "pluma.js" into a tab, if needed.

    @param  {Number}   tab_id           Tab ID of a tab.
    @param  {String}   tab_url          URL of a tab.
    @param  {Boolean}  [reload_inject]  Optional. If true, reload or inject "pluma.js" into a tab, if needed. Defaults to false.
    */

    tab_url = tab_url.toLowerCase()

    reload_inject = reload_inject || false // default

    let previous_allow      = false // default
    let previous_spellcheck = false // default

    if (local.status.tab[tab_id] !== undefined) {
        previous_allow      = local.status.tab[tab_id].allow
        previous_spellcheck = local.status.tab[tab_id].spellcheck
    } // if

    const hostname = url_to_hostname(tab_url)

    const current_allow = allow_edit(hostname, tab_id)

    const current_spellcheck = local.option.spellcheck

    const title = url_to_title(tab_url)

    local.status.tab[tab_id] = {
        allow     : current_allow, // true or false
        hostname  : hostname,
        id        : tab_id,
        spellcheck: current_spellcheck, // true or false
        title     : title,
        url       : tab_url
    }

    port_message_all_status_tab() // this will only message all ports if status.tab has changed since it was last sent to all ports

    if (reload_inject === true) {
        let reload_tab = false // default

        if (current_allow === false && previous_allow === true) {
            // need to remove "pluma.js" injection by reloading this tab
            reload_tab = true
        } else if (current_allow === true && (current_spellcheck !== previous_spellcheck)) {
            // spellcheck option changed and editing is enabled, reload this tab
            reload_tab = true
        } // if

        if (reload_tab === true) {
            const reload_options = { bypassCache: true }

            try {
                await browser.tabs.reload(tab_id, reload_options)
                log('tabs_allow_reload_inject_one -> reloaded tab', tab_id)
            } catch (error) {
                log('tabs_allow_reload_inject_one -> reload error ->', error)
            } // try
        } else {
            // reload_tab is false

            if (current_allow === true && previous_allow === false) {
                await tabs_inject_one(tab_id)
            } // if
        } // if
    } // if
} // tabs_allow_reload_inject_one

const tabs_inject_all = local.function.tabs_inject_all = async function tabs_inject_all() {
    /*
    Loop through local.status.tab and call tabs_inject_one() for each tab ID.
    */

    const promises = []

    for (const property in local.status.tab) {
        const tab = local.status.tab[property]

        promises.push(
            tabs_inject_one(tab.id)
        )
    } // for

    await Promise.allSettled(promises)
} // tabs_inject_all

const tabs_inject_one = local.function.tabs_inject_one = async function tabs_inject_one(tab_id) {
    /*
    Inject a "pluma.js" script into a tab, if needed.

    @param  {Number}  tab_id  Tab ID which may be injected.
    */

    const tab = local.status.tab[tab_id]

    if (tab === undefined) {
        // tab recently removed so return early
        return 'early'
    } // if

    const allow      = tab.allow
    const hostname   = tab.hostname
    const spellcheck = tab.spellcheck
    const url        = tab.url

    const new_tab = (url === 'chrome://newtab/' || url === 'edge://newtab/')

    if (allow === true && hostname !== '' && new_tab === false) {
        log('tabs_inject_one ->', tab_id)

        // figure out whether to inject "pluma.js" or "pluma-spellcheck.js"
        const file_name = (spellcheck === false) ? 'pluma.js' : 'pluma-spellcheck.js'

        const details = {
            files: ['/js/inject/' + file_name],
            injectImmediately: true,
            target: {
                'allFrames': true,
                'tabId': tab_id
            }
        } // details

        try {
            await browser.scripting.executeScript(details)

            log('tabs_inject_one -> pluma inject tab', tab_id)
        } catch (error) {
            log('tabs_inject_one -> pluma inject error ->', error.message)
        } // try
    } // if
} // tabs_inject_one

const tabs_inject_queue = local.function.tabs_inject_queue = async function tabs_inject_queue(tab_id, reset_queue) {
    /*
    Queue tab injection requests in case there are multiple injection requests in a short time. This function can recurse and call itself to process the queue.

    @param  {Number}   tab_id         Tab ID to queue for injection.
    @param  {Boolean}  [reset_queue]  Optional. If True, the queue system will be reset in order to run this function recursively. Defaults to false.
    */

    reset_queue = reset_queue || false

    const queue = local.status.tab_inject_queue // reference

    if (reset_queue === true || queue[tab_id] === undefined) {
        // create or reset an existing queue
        queue[tab_id] = 1 // 1 means we are busy
    } else {
        // increment the queue to indicate a queued request
        queue[tab_id]++

        return 'early'
    } // if

    try {
        await tabs_inject_one(tab_id)
    } catch (error) {
        // do nothing
        log('tabs_inject_queue -> error', error)
    } // try

    await delay(3000) // milliseconds

    if (queue[tab_id] === 1) {
        // no additional queue requests came in while we were processing the queue
        delete queue[tab_id]
    } else {
        // queue is greater than 1
        await tabs_inject_queue(tab_id, true) // true meaning reset the queue
    } // if
} // tabs_inject_queue

const tabs_status_init = local.function.tabs_status_init = async function tabs_status_init() {
    /*
    Populate the local.status.tab object with tab objects that track the last known allow, hostname, ID, and URL values for a tab. Also update local.status.stringify based on the local.status.tab object.
    */

    // reset the current tab object before populating it
    local.status.tab = {}

    const query_options = {
        populate: true,
        windowTypes: ['normal']
    } // query_options

    try {
        const windows = await browser.windows.getAll(query_options)

        for (const one_window of windows) {
            for (const tab of one_window.tabs) {
                const tab_url  = tab.url
                const hostname = url_to_hostname(tab_url)
                const title    = url_to_title(tab_url)

                local.status.tab[tab.id] = {
                    allow     : allow_edit(hostname, tab.id), // true or false
                    hostname  : hostname,
                    id        : tab.id,
                    spellcheck: local.option.spellcheck, // true or false
                    title     : title,
                    url       : tab_url
                }
            } // for
        } // for

        local.status.tab_stringify = JSON.stringify(local.status.tab)
    } catch (error) {
        log('tabs_status_init -> error ->', error.message)
    } // try
} // tabs_status_init

const url_setup = local.function.url_setup = function url_setup() {
    /*
    Setup the local.url object.
    */

    const root = shared.url.extension

    // each of the following arrays list their elements in alpha order
    const themes = ['dark', 'light']
    const icons  = ['blue', 'dark', 'light']
    const pages  = ['options', 'popup'] // not all pages are needed here, only pages that may be opened directly, pages that will need to know what theme and icon color to display initially

    for (const theme of themes) {
        local.url[theme] = {}

        for (const icon of icons) {
            local.url[theme][icon] = {}

            for (const page of pages) {
                local.url[theme][icon][page] = root + 'page/' + theme + '/' + icon + '/' + page + '.html'
            } // for
        } // for
    } // for
} // url_setup

const version_from_storage = local.function.version_from_storage = async function version_from_storage() {
    /*
    Return the last known version from storage or an empty string.

    @return  {String}  Version string like "2022.1.1.0" or "".
    */

    return await storage_get('version') || ''
} // version_from_storage

const version_less_than = local.function.version_less_than = function version_less_than(version, compare) {
    /*
    Compare a version string to the current version of this extension.

    @param   {String}   version  Version string like "2022.1.1.0".
    @param   {String}   compare  Version string like "2022.1.1.0".
    @return  {Boolean}           True or False.
    */
    let outcome = false // default

    const versionArray = version.split('.').map(string => parseInt(string, 10))
    const compareArray = compare.split('.').map(string => parseInt(string, 10))

    const compareArrayLength = compareArray.length

    for (let index = 0; index < compareArrayLength; index++) {
        const version_number = versionArray[index]
        const compare_number = compareArray[index]

        if (version_number < compare_number) {
            outcome = true
            break // break for loop
        } else if (version_number > compare_number) {
            break // break for loop
        } // if

        // keep looping until we break out of the for loop or run out of array items to compare
    } // for

    return outcome
} // version_less_than

const version_to_storage = local.function.version_to_storage = async function version_to_storage() {
    /*
    Save the current version to storage.
    */

    await storage_set({
        'version': local.version
    })
} // version_to_storage

//-----------------
// Event Listeners
//-----------------
browser.runtime.onConnect.addListener(listener_port_connect)

browser.tabs.onRemoved.addListener(listener_tab_removed)
browser.tabs.onUpdated.addListener(listener_tab_updated)

// listen for service worker install events
self.addEventListener('install', listener_service_worker_install)

if (shared.browser.firefox === true) {
    browser.permissions.onAdded.addListener(listener_permissions)
    browser.permissions.onRemoved.addListener(listener_permissions)
} // if

log('listeners active')

//-------
// Start
//-------
start()