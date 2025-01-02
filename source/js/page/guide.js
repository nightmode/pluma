'use strict'

//-----------
// Variables
//-----------
const local = {
    'element': {
        'content'   : document.getElementById('content'),
        'html'      : document.getElementById('html'),
        'loading'   : document.getElementById('loading'),
        'scroll_nav': document.getElementById('scroll-nav')
    },
    'function': { // will hold various functions
        // listener_port_disconnect
        // listener_port_message

        // port_connect
        // port_listeners
        // port_message_init_guide

        // show_content

        // start
        // start_continue
    },
    'page': 'guide', // the name of this page
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.js
        // browser_is_dark
        // icon_color
        // theme
        // theme_popup
    },
    'status': { // will hold values from background.js
        // permissions
    }
} // local

//-----------
// Functions
//-----------
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

    @param  {Object}  obj   Object like {subject:"init-guide"}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'init-guide':
            log('listener_port_message -> init-guide')

            local.preference = obj.preference
            local.status     = obj.status

            await start_continue()

            break
        case 'option-set':
            // not used on this page

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
                    theme_and_icon() // from shared.js

                    break
                case 'theme_popup':
                    // not used on this page

                    break
            } // switch

            break
        case 'status-permissions':
            log('listener_port_message -> status-permissions -> ' + obj.value)

            local.status.permissions = obj.value

            // show the permissions area, if needed
            permissions_display() // from shared.js

            break
        case 'status-tab':
            // not used on this page

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
        name: 'guide'
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

const port_message_init_guide = local.function.port_message_init_guide = function port_message_init_guide() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-guide'
    } // message

    local.port.postMessage(message)
} // port_message_init_guide

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the guide page.
    */

    await shared_start() // from shared.js

    listen_mouse_events() // from shared.js
    listen_scroll_to_links() // from shared.js
    listen_scroll_nav() // from shared.js
    listen_allow_permissions_button() // from shared.js

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_guide()

    // startup will continue in start_continue() once listener_port_message() receives an "init-guide" message
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the guide page.
    */

    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    // show the permissions area, if needed
    permissions_display() // from shared.js

    browser_customize() // from shared.js

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

//-------
// Start
//-------
start()