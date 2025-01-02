'use strict'

//-----------
// Variables
//-----------
const local = {
    'element': {
        'about_browser'    : document.getElementById('about-browser'),
        'about_version'    : document.getElementById('about-version'),
        'content'          : document.getElementById('content'),
        'html'             : document.getElementById('html'),
        'loading'          : document.getElementById('loading'),
        'scroll_nav'       : document.getElementById('scroll-nav'),
        'trouble_browser'  : document.getElementById('trouble-browser'),
        'trouble_copy'     : document.getElementById('trouble-copy'),
        'trouble_copy_busy': document.getElementById('trouble-copy-busy'),
        'trouble_options'  : document.getElementById('trouble-options'),
        'trouble_version'  : document.getElementById('trouble-version')
    },
    'function': { // will hold various functions
        // display_browser_type
        // display_options

        // listen_trouble_copy

        // listener_port_disconnect
        // listener_port_message

        // options_to_display

        // port_connect
        // port_listeners
        // port_message_init_about

        // show_content

        // start
        // start_continue

        // stringify
    },
    'option': { // will hold values from background.js
        // global
        // spellcheck
        // tab
    },
    'page': 'about', // the name of this page
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.js
        // browser_is_dark
        // icon_color
        // theme
        // theme_popup
    },
    'status': { // will hold values from background.js
        // permissions
    },
    'version': null // will hold a value from background.js
} // local

//-----------
// Functions
//-----------
const display_browser_type = local.function.display_browser_type = function display_browser_type() {
    /*
    Display the current browser type.
    */

    let text = ''

    if (shared.browser.chrome) {
        text = 'on Google Chrome.'
    } else if (shared.browser.edge) {
        text = 'on Microsoft Edge.'
    } else if (shared.browser.firefox) {
        text = 'on Mozilla Firefox.'
    } else {
        text = 'on what appears to be an unsupported browser. Supported browsers include Google Chrome, Microsoft Edge, and Mozilla Firefox.'
    } // if

    local.element.about_browser.textContent = text
} // display_browser_type

const display_options = local.function.display_options = function display_options() {
    /*
    Display options information within the troubleshooting area.
    */

    const options = options_to_display()

    local.element.trouble_options.textContent = stringify(options)
} // display_options

const listen_trouble_copy = local.function.listen_trouble_copy = function listen_trouble_copy() {
    /*
    Listener for the "Copy Information" button at the bottom of the troubleshooting information area.
    */

    local.element.trouble_copy.addEventListener('click', async function(e) {
        e.preventDefault()

        const options = options_to_display()

        let trouble_text = ''

        trouble_text += 'Options' + '\n'
        trouble_text += stringify(options) + '\n\n'

        trouble_text += 'Pluma Version' + '\n'
        trouble_text += local.version + '\n\n'

        trouble_text += 'Web Browser Version' + '\n'
        trouble_text += navigator.userAgent

        try {
            // copy to clipboard
            await navigator.clipboard.writeText(trouble_text)

            // hide button
            local.element.trouble_copy.classList.add('hidden')

            // show busy button
            local.element.trouble_copy_busy.classList.remove('hidden')

            await delay(3000)
        } catch (error) {
            alert('Oops. Information could not be automatically copied to your clipboard.\n\nPlease select and copy the information manually.')
        } // try

        // hide busy button
        local.element.trouble_copy_busy.classList.add('hidden')

        // show button
        local.element.trouble_copy.classList.remove('hidden')
    })
} // listen_trouble_copy

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

    @param  {Object}  obj   Object like {subject:"init-about"}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'init-about':
            log('listener_port_message -> init-about')

            local.option     = obj.option
            local.preference = obj.preference
            local.status     = obj.status
            local.tab        = obj.tab
            local.version    = obj.version

            await start_continue()

            break
        case 'option-set':
            log('listener_port_message -> option-set -> ' + obj.name + ' =', obj.value)

            local.option[obj.name] = obj.value

            display_options()

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

const options_to_display = local.function.options_to_display = function options_to_display() {
    /*
    Return an options object.

    @return  {Object}
    */

    const options = {
        'global'    : local.option.global,
        'spellcheck': local.option.spellcheck,
        'tab'       : local.option.tab
    } // options

    return options
} // options_to_display

const port_connect = local.function.port_connect = function port_connect() {
    /*
    Connect a port to the background service worker.
    */

    local.port = browser.runtime.connect({
        name: 'about'
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

const port_message_init_about = local.function.port_message_init_about = function port_message_init_about() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-about'
    } // message

    local.port.postMessage(message)
} // port_message_init_about

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('visibility-hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the about page.
    */

    await shared_start() // from shared.js

    listen_mouse_events() // from shared.js
    listen_scroll_nav() // from shared.js
    listen_trouble_copy()
    listen_allow_permissions_button() // from shared.js

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_about()

    // startup will continue in start_continue() once listener_port_message() receives an "init-about" message
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue starting the about page.
    */

    //--------------------------
    // Update the About section
    //--------------------------

    // display the extension version
    local.element.about_version.textContent = local.version.replace('.0', '')

    // display the current browser type
    display_browser_type()

    //------------------------------------
    // Update the Troubleshooting section
    //------------------------------------

    // display options info
    display_options()

    // display the extension version
    local.element.trouble_version.textContent = local.version

    // display the web browser version
    local.element.trouble_browser.textContent = navigator.userAgent

    //----------
    // Continue
    //----------
    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    // show the permissions area, if needed
    permissions_display() // from shared.js

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

const stringify = local.function.stringify = function stringify(obj) {
    /*
    Stringify a JavaScript object and return a string without the default wrapping parentheses. Defaults to returning "Unknown" if there is a problem with the in object parameter.

    @param   {Object}  obj   Object.
    @return  {String}
    */

    let text = 'Unknown'

    try {
        text = JSON.stringify(obj)
        text = text.slice(1, text.length - 1) // remove first and last characters
    } catch (error) {
        // do nothing
    } // try

    return text
} // stringify

//-------
// Start
//-------
start()