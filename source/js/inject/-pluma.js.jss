'use strict'

//-------
// Notes
//-------
/*
    The window object is safe to use because our script will be injected and isolated from any existing scripts.
*/

//---------------------------------------
// The following code will only run once
//---------------------------------------
if (window.local === undefined) {
    //-----------
    // Variables
    //-----------
    window.body = document.querySelector('body')

    window.local = {
        'function': { // will hold various functions
            // click
            // delay
            // listen_click
            // mutation_observer
            // port_message_iframe_load
            // start
        }
    } // local

    window.root = document.querySelector(':root')

    //-----------
    // Functions
    //-----------
    window.click = local.function.click = function click(target) {
        /*
        If possible, click a target or recurse and click the ancestor of a target.

        @param  {Object}  target  Target HTML object.
        */

        const tag = target.tagName.toLowerCase()

        if (tag === 'body' || tag === 'head' || tag === 'html') {
            // do nothing
            return 'early'
        } // if

        if (typeof target.click === 'function') {
            target.click()
        } else {
            // recurse by calling our own function for the parent of the current target element
            click(target.parentElement)
        } // if
    } // click

    window.delay = local.function.delay = function delay(ms) {
        /*
        Promise that will delay a desired number of milliseconds before resolving.

        @param   {Number}   ms  Number of milliseconds to delay.
        @return  {Promise}
        */

        return new Promise(resolve => setTimeout(resolve, ms))
    } // delay

    window.listen_click = local.function.listen_click = async function listen_click(event) {
        /*
        Listener for mouse click events.

        @param   {Object}   event  Mouse click event from addEventListener.
        */

        const alt      = event.altKey || event.metaKey
        const editable = root.contentEditable
        const tag      = event.target.tagName.toLowerCase()
        const type     = event.type

        if (editable === 'false') {
            // root is not editable, most likely due to a recent alt click
            return 'early'
        } // if

        if (type === 'click' || type === 'dblclick') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
        } // if

        if (alt === false) {
            return 'early'
        } // if

        if (tag === 'body' || tag === 'head' || tag === 'html') {
            return 'early'
        } // if

        // at this point, alt is true
        root.contentEditable = false

        if (type === 'click' || type === 'dblclick') {
            // click the target after a short delay
            const target = event.target

            setTimeout(click, 0, target)
        } // if

        await delay(500) // milliseconds

        // make the root editable again
        root.contentEditable = true

        await delay(1000) // milliseconds

        // encourage spellcheck to underline unknown words by focusing the body element
        body.focus()
    } // listen_click

    window.mutation_observer = local.function.mutation_observer = function mutation_observer() {
        /*
        Monitor mutations for IFRAME load events and alert the background page so it can inject "pluma.js" into all frames, if needed.
        */

        const observer = function(mutations, unused_observer) {
            /*
            When mutations occur, add a listener to recently added IFRAME elements to detect when they are loaded.

            @param  {Object}  mutations  List of mutated nodes.
            */

            const options = {
                passive: true
            } // options

            mutations.forEach(function(mutation) {
                [].filter.call(mutation.addedNodes, function(node) {
                    return node.nodeName.toLowerCase() === 'iframe'
                }).forEach(function(node) {
                    // found an iframe
                    port_message_iframe_load()

                    // add load event listener for any future changes to this iframe
                    node.addEventListener('load', function(unused_event) {
                        port_message_iframe_load()
                    }, options)
                }) // forEach
            }) // forEach
        } // observer

        const mutation_observer = new MutationObserver(observer)

        const options = {
            attributes: false,
            childList: true,
            subtree: true
        } // options

        mutation_observer.observe(body, options)
    } // mutation_observer

    window.port_message_iframe_load = local.function.port_message_iframe_load = function port_message_iframe_load() {
        /*
        Send a message to our extension server worker so it can inject "pluma.js" into all frames.
        */

        try {
            const port = chrome.runtime.connect()

            port.postMessage({
                'subject': 'iframe-load'
            })

            port.disconnect()
        } catch (error) {
            // the pluma extension may be disabled or was uninstalled
        } // try
    } // port_message_iframe_load

    window.start = local.function.start = async function start() {
        /*
        Start.
        */

        root.contentEditable = true

        // set spellcheck via jss <js>const spellcheck = args[0]</js>
        root.spellcheck = <js>write(spellcheck)</js>

        const options = {
            capture: true,
            passive: false
        } // options

        window.addEventListener('auxclick', listen_click, options)
        window.addEventListener('click',    listen_click, options)
        window.addEventListener('dblclick', listen_click, options)

        mutation_observer() // monitor for iframe load events

        // console.log('pluma injected')

        if (top === self) {
            // this window is NOT inside an iframe

            if (root.spellcheck === true) {
                await delay(1000) // milliseconds

                // encourage spellcheck to underline unknown words by focusing the body element
                body.focus()
            } // if
        } else {
            // this window is inside an iframe

            // add an empty div immediately after the body element to stop certain advertisements from growing vertically when they become editable
            const div = document.createElement('div')

            div.style.setProperty('display',      'block', 'important')
            div.style.setProperty('height',       '0px',   'important')
            div.style.setProperty('width',        '100%',  'important')

            body.prepend(div)
        } // if
    } // start

    //-------
    // Start
    //-------
    start()
} // if