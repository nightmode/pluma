'use strict'

//-----------
// Variables
//-----------
const local = {
    'class': { // will hold various classes
        // custom_checkbox
        // custom_filter
        // custom_select
    },
    'display': { // display information based on local.option.tab and local.status.tab
        'tab': {
            // 1: {
            //     'allow': true, // allow edit mode
            //     'title': 'microsoft.com'
            //     'title_sort': 'microsoft.com'
            // }
        }
    },
    'element': {
        'content'                         : document.getElementById('content'),
        'html'                            : document.getElementById('html'),
        'loading'                         : document.getElementById('loading'),
        'options_filter_tabs'             : document.getElementById('options-filter-tabs'),
        'options_filter_tabs_clear'       : document.getElementById('options-filter-tabs-clear'),
        'options_filter_tabs_text'        : document.getElementById('options-filter-tabs-text'),
        'options_list_area_tabs'          : document.getElementById('options-list-area-tabs'),
        'options_paginate_tabs'           : document.getElementById('options-paginate-tabs'),
        'options_sort_tabs'               : document.getElementById('options-sort-tabs'),
        'options_tabs'                    : document.getElementById('options-tabs'),
        'options_tabs_loading'            : document.getElementById('options-tabs-loading'),
        'options_title_global'            : document.getElementById('options-title-global'),
        'options_title_spellcheck'        : document.getElementById('options-title-spellcheck'),
        'scroll_nav'                      : document.getElementById('scroll-nav'),
        'template_options_tabs_no_results': document.getElementById('template-options-tabs-no-results'),
        'template_options_tabs_row'       : document.getElementById('template-options-tabs-row')

    },
    'filter': { // default filter strings which can be changed by the user
        'tabs': '',
    },
    'function': { // will hold various functions
        // custom_elements_define

        // listen_filter_clear
        // listen_pagination
        // listener_port_disconnect
        // listener_port_message

        // locale_compare

        // port_connect
        // port_listeners
        // port_message_init_options

        // show_content

        // start
        // start_continue

        // update_display_filter_sort
        // update_display_global
        // update_display_info
        // update_display_paginate
        // update_display_paginate_page
        // update_display_spellcheck
        // update_display_tabs
    },
    'option': { // will hold values from background.js
        // global
        // spellcheck
        // tab
    },
    'page': 'options', // the name of this page
    'paginate': { // default settings which can be changed when paging through display items
        'display': 10, // items to show per page
        'tabs': 1,  // default page number
        'navigate': {
            'tabs': '', // can be set to "first", "next", "previous", or "last"
        }
    },
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.js
        // browser_is_dark
        // icon_color
        // theme
        // theme_popup
    },
    'setting': { // will hold values from background.js
        // show_message
    },
    'sort': { // default sort methods which can be changed by the user
        'tabs': 'a-z' // "a-z", "z-a", "edit-view", or "view-edit"
    },
    'status': { // will hold values from background.js
        // permissions
        // tab
    }
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

        const tab_id = parseInt(this.dataset.option, 10) // convert tab id string to integer

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false via update display functions
            e.stopPropagation()

            const value = this.checked

            switch (property) {
                case 'global':
                    local.option.global = value

                    log('custom_checkbox -> global -> set to ' + value)

                    update_display_global()

                    break
                case 'spellcheck':
                    local.option.spellcheck = value

                    log('custom_checkbox -> spellcheck -> set to ' + value)

                    update_display_spellcheck()

                    break
                case 'tab':
                    if (value === true) {
                        local.option.tab[tab_id] = true
                    } else {
                        // remove this tab option
                        delete local.option.tab[tab_id]
                    } // if

                    log('custom_checkbox -> tab -> set ' + value + ' for tab id', tab_id)

                    update_display_tabs()

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

const custom_filter = local.class.custom_filter = class custom_filter extends HTMLInputElement {
    /*
    Custom input text element for filtering the tabs option area.
    */

    constructor() {
        super() // setup object inheritance

        this.addEventListener('input', function(e) {
            e.stopPropagation()

            let value = this.value

            try {
                value = value.trim()

                if (value !== this.value) {
                    // filter had spaces trimmed
                    this.value = value
                } // if

                value = value.toLowerCase()
            } catch (error) {
                // do nothing
            } // try

            // set local filter property so it can persist while this page is open
            local.filter.tabs = value

            // reset current page to 1 since filter changed
            local.paginate.tabs = 1

            if (value === '') {
                // hide filter clear button
                local.element.options_filter_tabs_clear.classList.add('hidden')
            } else {
                // show filter clear button
                local.element.options_filter_tabs_clear.classList.remove('hidden')
            } // if

            update_display_tabs()
        })
    } // constructor
} // custom_filter

const custom_select = local.class.custom_select = class custom_select extends HTMLSelectElement {
    /*
    Custom select element.
    */

    constructor() {
        super() // setup object inheritance

        this.addEventListener('change', function(e) {
            e.stopPropagation()

            // reset current page to 1 since sort changed
            local.paginate.tabs = 1

            // set local sort property so it can persist while this page is open
            local.sort.tabs = this.value || 'a-z'

            update_display_tabs()
        })
    } // constructor
} // custom_select

//-----------
// Functions
//-----------
const custom_elements_define = local.function.custom_elements_define = function custom_elements_define() {
    /*
    Define Custom Elements for programmatic use and also upgrade any existing HTML elements with matching "is" properties.
    */

    if (customElements.get('custom-checkbox') === undefined) {
        // a custom checkbox element has not been defined yet
        customElements.define('custom-checkbox', custom_checkbox, {
            extends: 'input'
        })
    } // if

    if (customElements.get('custom-filter') === undefined) {
        // a custom filter element has not been defined yet
        customElements.define('custom-filter', custom_filter, {
            extends: 'input'
        })
    } // if

    if (customElements.get('custom-select') === undefined) {
        // a custom select element has not been defined yet
        customElements.define('custom-select', custom_select, {
            extends: 'select'
        })
    } // if
} // custom_elements_define

const listen_filter_clear = local.function.listen_filter_clear = function listen_filter_clear() {
    /*
    Listen for click events on the filter clear button that is only visible when the tabs filter is active.
    */

    local.element.options_filter_tabs_clear.addEventListener('click', function(e) {
        e.preventDefault()

        // clear the filter input associated with this clear button
        local.element.options_filter_tabs_text.value = ''

        // clear the filter string since setting the value of the input above does not trigger an "input" event
        local.filter.tabs = ''

        // hide this clear button
        this.classList.add('hidden')

        update_display_tabs()
    })
} // listen_filter_clear

const listen_pagination = local.function.listen_pagination = function listen_pagination() {
    /*
    Listen for navigation clicks on the "first", "previous", "next", and "last" arrows seen at the bottom of the tabs option area.
    */

    const elements = document.getElementsByClassName('options-paginate-link')

    for (const item of elements) {
        item.addEventListener('click', function(e) {
            e.preventDefault()

            const option = this.dataset.option

            log('listen_pagination -> tabs -> ' + option)

            local.paginate.navigate.tabs = option

            update_display_tabs()
        })
    } // for
} // listen_pagination

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

    @param  {Object}  obj   Object like {subject:"init-options"}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'init-options':
            log('listener_port_message -> init-options')

            local.option     = obj.option
            local.preference = obj.preference
            local.setting    = obj.setting
            local.status     = obj.status

            await start_continue()

            break
        case 'option-set':
            log('listener_port_message -> option-set -> set local.option.' + obj.name)

            local.option[obj.name] = obj.value

            switch(obj.name) {
                case 'global':
                    update_display_global()
                    break
                case 'spellcheck':
                    update_display_spellcheck()
                    break
                case 'tab':
                    update_display_tabs()
                    break
            } // switch

            break
        case 'preference-set':
            log('listener_port_message -> preference-set -> set local.preference.' + obj.name)

            local.preference[obj.name] = obj.value

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
            log('listener_port_message -> status-tab -> set local.status.tab')

            local.status.tab = obj.value

            update_display_tabs()

            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const locale_compare = local.function.locale_compare = new Intl.Collator('en-US', {
    caseFirst: 'upper',
    ignorePunctuation: false,
    localeMatcher: 'best fit',
    numeric: true,
    sensitivity: 'variant',
    usage: 'sort'
}).compare // alias function

const port_connect = local.function.port_connect = function port_connect() {
    /*
    Connect a port to the background service worker.
    */

    local.port = browser.runtime.connect({
        name: 'options'
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

const port_message_init_options = local.function.port_message_init_options = function port_message_init_options() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-options'
    } // message

    local.port.postMessage(message)
} // port_message_init_options

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the options page.
    */

    await shared_start() // from shared.js

    listen_mouse_events() // from shared.js
    listen_filter_clear()
    listen_pagination()
    listen_scroll_nav() // from shared.js
    listen_show_message_dismiss() // from shared.js
    listen_allow_permissions_button() // from shared.js

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_options()

    // startup will continue in start_continue() once listener_port_message() receives an "init-options" message
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the options page.
    */

    show_message() // from shared.js

    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    // show the permissions area, if needed
    permissions_display() // from shared.js

    custom_elements_define()
    update_display_global()
    update_display_spellcheck()
    update_display_tabs()

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

const update_display_filter_sort = local.function.update_display_filter_sort = function update_display_filter_sort() {
    /*
    Return an optionally filtered and definitely sorted list of tabs from local.display.tab.

    @return  {Object}  Array of tab name strings.
    */

    let tabs_names = Object.keys(local.display.tab)

    const filter = local.filter.tabs

    if (filter !== '') {
        tabs_names = tabs_names.filter(function(item) {
            return local.display.tab[item].title_sort.includes(filter)
        })
    } // if

    const sort = local.sort.tabs || 'a-z' // "a-z", "z-a", "edit-view", or "view-edit"

    const tabs = local.display.tab

    switch (sort) {
        case 'edit-view':
            // sort edit-view

            tabs_names.sort(function(a, b) {
                let compare_a = (tabs[a].allow === true) ? 0 : 1
                let compare_b = (tabs[b].allow === true) ? 0 : 1

                let result = locale_compare(
                    compare_a,
                    compare_b
                ) // result

                if (result === 0) {
                    // sort strings are equal so sort by title_sort property
                    compare_a = tabs[a].title_sort
                    compare_b = tabs[b].title_sort

                    result = locale_compare(compare_a, compare_b)
                } // if

                if (result === 0) {
                    // sort strings are equal so sort by title property
                    compare_a = tabs[a].title
                    compare_b = tabs[b].title

                    result = locale_compare(compare_a, compare_b)
                } // if

                return result
            }) // sort

            break
        case 'view-edit':
            // sort view-edit

            tabs_names.sort(function(a, b) {
                let compare_a = (tabs[a].allow === true) ? 1 : 0
                let compare_b = (tabs[b].allow === true) ? 1 : 0

                let result = locale_compare(
                    compare_a,
                    compare_b
                ) // result

                if (result === 0) {
                    // sort strings are equal so sort by title_sort property
                    compare_a = tabs[a].title_sort
                    compare_b = tabs[b].title_sort

                    result = locale_compare(compare_a, compare_b)
                } // if

                if (result === 0) {
                    // sort strings are equal so sort by title property
                    compare_a = tabs[a].title
                    compare_b = tabs[b].title

                    result = locale_compare(compare_a, compare_b)
                } // if

                return result
            }) // sort

            break
        case 'z-a':
            // sort z-a

            tabs_names.sort(function(a, b) {
                let result = locale_compare(
                    tabs[b].title_sort,
                    tabs[a].title_sort
                ) // result

                if (result === 0) {
                    // sort strings are equal so sort by title instead
                    result = locale_compare(
                        tabs[b].title,
                        tabs[a].title
                    )
                } // if

                return result
            }) // sort

            break
        default:
            // sort a-z

            tabs_names.sort(function(a, b) {
                let result = locale_compare(
                    tabs[a].title_sort,
                    tabs[b].title_sort
                ) // result

                if (result === 0) {
                    // sort strings are equal so sort by title instead
                    result = locale_compare(
                        tabs[a].title,
                        tabs[b].title
                    )
                } // if

                return result
            }) // sort

            break
    } // switch

    return tabs_names
} // update_display_filter_sort

const update_display_global = local.function.update_display_global = function update_display_global() {
    /*
    Update the checked state of the global option checkbox and the corresponding title describing the current status.
    */

    const checkbox = document.querySelector('[data-option=global]')

    if (checkbox.checked === local.option.global) {
        // do nothing
    } else {
        checkbox.checked = local.option.global
    } // if

    let class_add    = 'options-title-enabled' // default
    let class_remove = 'options-title-disabled' // default

    if (local.option.global === false) {
        class_add    = 'options-title-disabled'
        class_remove = 'options-title-enabled'
    } // if

    local.element.options_title_global.classList.remove(class_remove)
    local.element.options_title_global.classList.add(class_add)
} // update_display_global

const update_display_info = local.function.update_display_info = function update_display_info() {
    /*
    Synchronize local.display.tab with local.option.tab and local.status.tab by removing, adding, and updating display objects as needed.
    */

    //------------------------
    // Remove Display Objects
    //------------------------
    for (const tab_id in local.display.tab) {
        if (local.option.tab[tab_id] === undefined && local.status.tab[tab_id] === undefined) {
            // remove this display property
            delete local.display.tab[tab_id]
        } // if
    } // for

    //----------------------------------
    // Add Display Objects from Options
    //----------------------------------
    for (const tab_id in local.option.tab) {
        if (local.display.tab[tab_id] === undefined) {
            // create a display object

            local.display.tab[tab_id] = {
                'allow'     : local.option.tab[tab_id],
                'title'     : 'Unknown', // can be set later in this function
                'title_sort': 'unknown'  // can be set later in this function
            }
        } // if
    } // for

    //---------------------------------
    // Add Display Objects from Status
    //---------------------------------
    for (const tab_id in local.status.tab) {
        if (local.display.tab[tab_id] === undefined) {
            // create a display object

            local.display.tab[tab_id] = {
                'allow'     : false, // can be set later in this function
                'title'     : local.status.tab[tab_id].title,
                'title_sort': local.status.tab[tab_id].title.toLowerCase()
            }
        } // if
    } // for

    //------------------------
    // Update Display Objects
    //------------------------
    for (const tab_id in local.display.tab) {
        const option_exists = (local.option.tab[tab_id] !== undefined)

        if (option_exists) {
            local.display.tab[tab_id].allow = local.option.tab[tab_id]
        } // if

        const status_exists = (local.status.tab[tab_id] !== undefined)

        if (status_exists) {
            local.display.tab[tab_id].title      = local.status.tab[tab_id].title
            local.display.tab[tab_id].title_sort = local.status.tab[tab_id].title.toLowerCase()
        } // if
    } // for
} // update_display_info

const update_display_paginate = local.function.update_display_paginate = function update_display_paginate(items, page, max_page) {
    /*
    Update the navigation links and text for a user visible paginate area for the tabs option area. When needed, set a CSS minimum height for the listing area so pagination controls do not jump when less then 10 options are being shown and there are multiple pages.

    @param  {Number}  items     Number of items being viewed.
    @param  {Number}  page      The current page being viewed.
    @param  {Number}  max_page  The maximum page number.
    */

    const options_paginate = local.element['options_paginate_tabs']

    //------------------
    // Navigation Links
    //------------------
    options_paginate.querySelectorAll('a').forEach(function(link) {
        if (max_page === 1) {
            // hide all navigation links
            link.classList.add('disable-nav')

            return 'early'
        } // if

        const option = link.dataset.option

        if (option === 'first' || option === 'previous') {
            if (page <= 1) {
                link.classList.add('disable-nav')
            } else {
                link.classList.remove('disable-nav')
            } // if
        } else if (option === 'next' || option === 'last') {
            if (page >= max_page) {
                link.classList.add('disable-nav')
            } else {
                link.classList.remove('disable-nav')
            } // if
        } // if
    }) // forEach

    //--------------
    // Display Text
    //--------------
    let to = page * local.paginate.display

    const from = to - local.paginate.display + 1

    if (to > items) {
        to = items
    } // if

    options_paginate.querySelector('.text-numbers').textContent = from + '-' + to + ' of ' + items

    //------------------
    // List Area Height
    //------------------
    let height = '0px' // default

    if (max_page > 1) {
        height = (local.paginate.display * 65 - 22) + 'px'
    } // if

    const options_list_area = local.element['options_list_area_tabs']

    if (options_list_area.style.minHeight !== height) {
        options_list_area.style.minHeight = height
    } // if
} // update_display_paginate

const update_display_paginate_page = local.function.update_display_paginate_page = function update_display_paginate_page(items, max_page) {
    /*
    Figure out the current pagination page based on the number of items to display, the current page, and any navigation requests from a user. Return the current page number for the display property "tabs".

    @param  {Number}  items     Number of items to paginate.
    @param  {Number}  max_page  The maximum page number.
    */

    let page = local.paginate.tabs
    let navigate = local.paginate.navigate.tabs

    if (navigate !== '') {
        // navigation request from user
        switch (navigate) {
            case 'first':
                page = local.paginate.tabs = 1

                break
            case 'previous':
                if (page > 1) {
                    page = --local.paginate.tabs
                } // if

                break
            case 'next':
                if (page < max_page) {
                    page = ++local.paginate.tabs
                } // if

                break
            case 'last':
                page = local.paginate.tabs = max_page

                break
        } // switch

        // clear navigation request
        local.paginate.navigate.tabs = ''
    } // if

    // pagination sanity check
    if (page < 1) {
        // page too low, reset to first page
        page = local.paginate.navigate.tabs = 1
    } else if (page > max_page) {
        // page too high, reset to max page
        page = local.paginate.navigate.tabs = max_page
    } // if

    return page
} // update_display_paginate_page

const update_display_spellcheck = local.function.update_display_spellcheck = function update_display_spellcheck() {
    /*
    Update the checked state of the spellcheck option checkbox and the corresponding title describing the current status.
    */

    const checkbox = document.querySelector('[data-option=spellcheck]')

    if (checkbox.checked === local.option.spellcheck) {
        // do nothing
    } else {
        checkbox.checked = local.option.spellcheck
    } // if

    let class_add    = 'options-title-enabled'  // default
    let class_remove = 'options-title-disabled' // default

    if (local.option.spellcheck === false) {
        class_add    = 'options-title-disabled'
        class_remove = 'options-title-enabled'
    } // if

    local.element.options_title_spellcheck.classList.remove(class_remove)
    local.element.options_title_spellcheck.classList.add(class_add)
} // update_display_spellcheck

const update_display_tabs = local.function.update_display_tabs = function update_display_tabs() {
    /*
    Update the display of tab options.
    */

    // show loading
    local.element.options_tabs_loading.classList.remove('hidden')

    // hide options tabs area
    local.element.options_tabs.classList.add('hidden')

    // clear the options tabs area
    local.element.options_tabs.textContent = ''

    update_display_info()

    const tabs = update_display_filter_sort()
    const tabs_length = tabs.length

    if (tabs_length === 0) {
        // no tabs

        const filter = (local.filter.tabs !== '') ? true : false

        const template = local.element['template_options_tabs_no_results'].content.cloneNode(true)

        if (filter === false) {
            // hide filter and sort tools
            local.element.options_filter_tabs.classList.add('hidden')
            local.element.options_sort_tabs.classList.add('hidden')
        } // if

        local.element.options_tabs.appendChild(template)

        // hide pagination area
        local.element.options_paginate_tabs.classList.add('hidden')

        // remove options-list class
        local.element.options_tabs.classList.remove('options-list')
    } else {
        // one or more tabs

        // show filter and sort tools
        local.element.options_filter_tabs.classList.remove('hidden')
        local.element.options_sort_tabs.classList.remove('hidden')

        // pagination
        const max_page = Math.ceil(tabs_length / local.paginate.display) // the maximum number of pages

        const page = update_display_paginate_page(tabs_length, max_page)

        // update pagination area
        update_display_paginate(tabs_length, page, max_page)

        // show pagination area
        local.element.options_paginate_tabs.classList.remove('hidden')

        const display_after_index = (page * local.paginate.display) - local.paginate.display

        let index = 0 // keep track of how many tabs we have looped through
        let display_count = 0 // keep track of how many tabs we have displayed to the user

        for (const tab_id of tabs) {
            index++

            if (index <= display_after_index) {
                continue // for loop
            } // if

            display_count++

            if (display_count > local.paginate.display) {
                break // for loop
            } // if

            const template = local.element.template_options_tabs_row.content.cloneNode(true)

            const checkbox      = template.querySelector('input')
            const options_title = template.querySelector('.options-title')

            options_title.textContent = local.display.tab[tab_id].title

            // setup checkboxes
            checkbox.dataset.option = tab_id

            checkbox.checked = local.option.tab[tab_id] || false

            local.element.options_tabs.appendChild(template)
        } // for

        // add options-list class
        local.element.options_tabs.classList.add('options-list')
    } // if

    // hide loading
    local.element.options_tabs_loading.classList.add('hidden')

    // show options tabs area
    local.element.options_tabs.classList.remove('hidden')
} // update_display_tabs

//-------
// Start
//-------
start()