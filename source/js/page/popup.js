'use strict'

//-----------
// Variables
//-----------
const local = {
    'class': { // will hold various classes
        // custom_checkbox
    },
    'element': {
        'link_options' : document.getElementById('link-options'),
        'loading'      : document.getElementById('loading'),
        'popup_wrapper': document.getElementById('popup-wrapper'),
        'summary'      : document.getElementById('popup-summary')
    },
    'function': { // will hold various functions
        // custom_elements_define

        // listen_checkboxes
        // listen_link_option

        // listener_port_disconnect
        // listener_port_message

        // port_connect
        // port_listeners
        // port_message_init_popup

        // start
        // start_continue

        // tab_current

        // update_display_global
        // update_display_spellcheck
        // update_display_summary
        // update_display_tab
    },
    'option': { // will hold values from background.js
        // global
        // spellcheck
        // tab
    },
    'page': 'popup', // the name of this page
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.js
        // browser_is_dark
        // icon_color
        // theme
        // theme_popup
    },
    'start_continue': false, // will be set true once the "start_continue" function runs
    'status': { // will hold values from background.js
        // permissions
        // tab
    },
    'tab': { // will be set by tab_current()
        'id': 0
    },
    'troubleshoot': null // generic troubleshooting placeholder
} // local

//---------
// Classes
//---------
const custom_checkbox = local.class.custom_checkbox = class custom_checkbox extends HTMLInputElement {
    /*
    Custom checkbox element.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.optionType // for example, global for local.option.global

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false via update display functions
            e.stopPropagation()

            const value = this.checked

            switch (property) {
                case 'global':
                    local.option.global = value

                    log('custom_checkbox -> global -> set to ' + value)

                    update_display_global()
                    update_display_summary()

                    break
                case 'spellcheck':
                    local.option.spellcheck = value

                    log('custom_checkbox -> spellcheck -> set to ' + value)

                    update_display_spellcheck()
                    update_display_summary()

                    break
                case 'tab':
                    const tab_id = local.tab.id

                    if (value === true) {
                        local.option.tab[tab_id] = true
                    } else {
                        // remove this tab option
                        delete local.option.tab[tab_id]
                    } // if

                    log('custom_checkbox -> tab -> set ' + value + ' for tab id', tab_id)

                    update_display_tab()
                    update_display_summary()

                    break
            } // switch

            // relay option to background.js
            const message = {
                'subject': 'option-set',
                'name'   : property,
                'value'  : local.option[property]
            } // message

            local.port.postMessage(message)
        }) // addEventListener click
    } // constructor
} // custom_checkbox

//-----------
// Functions
//-----------
const custom_elements_define = local.function.custom_elements_define = function custom_elements_define() {
    /*
    Define Custom Elements for programmatic use and also upgrade any existing HTML elements with matching "is" properties.
    */

    customElements.define('custom-checkbox', custom_checkbox, { extends: 'input' })
} // custom_elements_define

const listen_checkboxes = shared.function.listen_checkboxes = function listen_checkboxes() {
    /*
    Listen for checkbox mousedown and mouseup events so mouse users do not get persistent focus effects after a click.
    */

    const items = document.querySelectorAll('input[type=checkbox]')
    const items_length = items.length

    for (let i = 0; i < items_length; i++) {
        items[i].addEventListener('mousedown', function(e) {
            e.preventDefault() // prevents focus state for mouse users
        })

        items[i].addEventListener('mouseup', function(e) {
            // blur anything that has focus since we just had a mouse click
            document.activeElement.blur()
        })
    } // for
} // listen_checkboxes

const listen_link_option = shared.function.listen_link_option = function listen_link_option() {
    /*
    Listen for option link clicks.
    */

    const event_handler = function(e) {
        e.preventDefault()
        e.stopPropagation()

        try {
            const message = {
                'subject': 'page-options'
            } // message

            local.port.postMessage(message)
        } catch (error) {
            log('listen_link_option -> error ->', error)
        } // try
    } // event_handler

    local.element.link_options.addEventListener('auxclick', event_handler)
    local.element.link_options.addEventListener('click',    event_handler)
    local.element.link_options.addEventListener('dblClick', event_handler)
} // listen_link_option

const listener_port_disconnect = local.function.listener_port_disconnect = function listener_port_disconnect() {
    /*
    Listener for local.port.onDisconnect events.
    */

    // disconnect events will not happen if a background service worker goes inactive however... local.port remains valid and messages can be sent through it to activate an inactive service worker

    log('listener_port_disconnect -> disconnected')

    local.port = null // default

    setTimeout(function() {
        port_connect()
        port_listeners()
    }, 1000)
} // listener_port_disconnect

const listener_port_message = local.function.listener_port_message = async function listener_port_message(obj, info) {
    /*
    Listener for local.port.onMessage events.

    @param  {Object}  obj   Object like {subject:"init-popup"}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'init-popup':
            log('listener_port_message -> init-popup')

            local.option     = obj.option
            local.preference = obj.preference
            local.status     = obj.status

            await start_continue()

            break
        case 'option-set':
            local.option[obj.name] = obj.value

            log('listener_port_message -> option-set -> set local.option.' + obj.name)

            switch(obj.name) {
                case 'global':
                    update_display_global()
                    update_display_summary()
                    break
                case 'spellcheck':
                    update_display_spellcheck()
                    update_display_summary()
                    break
                case 'tab':
                    update_display_tab()
                    update_display_summary()
                    break
            } // switch

            break
        case 'preference-set':
            local.preference[obj.name] = obj.value

            log('listener_port_message -> preference-set -> set local.preference.' + obj.name)

            switch (obj.name) {
                case 'browser_is_dark':
                    theme_and_icon() // from shared.js

                    break
                case 'icon_color':
                    theme_and_icon() // from shared.js

                    break
                case 'theme':
                    // not used on this page

                    break
                case 'theme_popup':
                    theme_and_icon() // from shared.js

                    break
            } // switch

            break
        case 'status-permissions':
            log('listener_port_message -> status-permissions -> ' + obj.value)

            local.status.permissions = obj.value

            update_display_summary()

            break
        case 'status-tab':
            local.status.tab = obj.value

            log('listener_port_message -> status-tab -> set local.status.tab')

            update_display_summary()

            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const port_connect = local.function.port_connect = function port_connect() {
    /*
    Connect a port to the background service worker.
    */

    local.port = browser.runtime.connect({
        name: 'popup'
    })
} // port_connect

const port_listeners = local.function.port_listeners = function port_listeners() {
    /*
    Add port event listeners.
    */

    local.port.onMessage.addListener(listener_port_message)

    local.port.onDisconnect.addListener(listener_port_disconnect)

    log('port_listeners -> active')
} // port_listeners

const port_message_init_popup = local.function.port_message_init_popup = function port_message_init_popup() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-popup'
    } // message

    local.port.postMessage(message)
} // port_message_init_popup

const start = local.function.start = function start() {
    /*
    Start the popup page.
    */

    // fade in the loading animation
    local.element.loading.classList.add('fade-in')

    listen_checkboxes()
    listen_link_option()

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_popup()

    // startup will continue in start_continue() once listener_port_message() receives an "init-popup" message

    setTimeout(function() {
        if (local.start_continue === false) {
            log('start -> start continue false after 3 seconds -> request init popup again')

            // request data from background.js again
            port_message_init_popup()
        } // if
    }, 3000)
} // start

const start_continue = local.function.start_continue = async function start_continue() {
    /*
    Continue to start the popup page.
    */

    if (local.start_continue === true) {
        // this function should only run once so return early
        return 'early'
    } // if

    local.start_continue = true

    local.tab = await tab_current()

    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    custom_elements_define()
    update_display_global()
    update_display_spellcheck()
    update_display_tab()
    update_display_summary()

    // hide the loading animation and show options
    local.element.loading.classList.add('hidden')
    local.element.popup_wrapper.classList.add('visible')
} // start_continue

const tab_current = local.function.tab_current = async function tab_current() {
    /*
    If possible, return information about an active tab of an active window.

    @return  {Object}
    */

    // default result to return
    const result = {
        'id': 0
    } // result

    try {
        const query_options = {
            populate: true,
            windowTypes: ['normal']
        } // query_options

        const one_window = await browser.windows.getCurrent(query_options)

        const tab = one_window.tabs.find(tab => tab.active === true)

        result.id = tab.id
    } catch (error) {
        // an error most likely means there are no windows open
        log('tab_current -> error ->', error.message)
    } // try

    return result
} // tab_current

const update_display_global = local.function.update_display_global = function update_display_global() {
    /*
    Update the checked state of the global option checkbox.
    */

    const checkbox = document.querySelector('[data-option-type=global]')

    if (checkbox.checked === local.option.global) {
        // do nothing
    } else {
        checkbox.checked = local.option.global
    } // if
} // update_display_global

const update_display_spellcheck = local.function.update_display_spellcheck = function update_display_spellcheck() {
    /*
    Update the checked state of the spellcheck option checkbox.
    */

    const checkbox = document.querySelector('[data-option-type=spellcheck]')

    if (checkbox.checked === local.option.spellcheck) {
        // do nothing
    } else {
        checkbox.checked = local.option.spellcheck
    } // if
} // update_display_spellcheck

const update_display_summary = local.function.update_display_summary = function update_display_summary() {
    /*
    Update the display summary area.
    */

    const tab_id = local.tab.id
    const tab    = local.status.tab[tab_id]
    const title  = tab.title || 'Unknown'

    let summary = '' // will be set to an actual summary below

    if (local.status.permissions === false) {
        summary = 'Pluma requires permissions to function. Please visit the options page for more information.'

        // add css class
        local.element.summary.classList.add('popup-summary-warning')

        // remove css class
        local.element.summary.classList.remove('popup-summary-enabled')
    } else if (tab.allow === true) {
        if (local.option.global) {
            if (local.option.spellcheck) {
                summary = 'Editing and spellchecking all tabs.'
            } else {
                summary = 'Editing all tabs.'
            } // if
        } else {
            // global option is false

            if (local.option.spellcheck) {
                summary = 'Editing and spellchecking this tab.'
            } else {
                summary = 'Editing this tab.'
            } // if
        } // if

        // add css class
        local.element.summary.classList.add('popup-summary-enabled')

        // remove css class
        local.element.summary.classList.remove('popup-summary-warning')
    } else {
        if (title === 'Extension' || title === 'File' || title === 'File Server' || title === 'New Tab' || title === 'Special Page') {
            summary = title + 's are view only.'
        } else if (title === 'Chrome' || title === 'Chrome Web Store' || title === 'Edge' || title === 'Firefox') {
            summary = title + ' pages are view only.'
        } else if (title === 'Mozilla Firefox Add-ons' || title === 'Microsoft Edge Add-ons') {
            summary = title + ' are view only.'
        } else {
            summary = 'Viewing this tab.'
        } // if

        // remove css classes
        local.element.summary.classList.remove('popup-summary-enabled', 'popup-summary-warning')
    } // if

    local.element.summary.textContent = summary
} // update_display_summary

const update_display_tab = local.function.update_display_tab = function update_display_tab() {
    /*
    Update the checked state of the tab option checkbox.
    */

    const checkbox = document.querySelector('[data-option-type=tab]')

    const tab_id = local.tab.id

    if (checkbox.checked === local.option.tab[tab_id]) {
        // do nothing
    } else {
        checkbox.checked = local.option.tab[tab_id]
    } // if
} // update_display_tab

//-------
// Start
//-------
start()