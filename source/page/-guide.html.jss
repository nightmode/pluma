<js>
    const theme = args[0]
    const icon  = args[1]
    const page  = 'guide'
</js><!doctype html>
<html lang="en" id="html">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/css/shared.css?version=2025.1.1.0">
    <link rel="preload" href="/fonts/dancing-script-bold.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter-medium.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter-semibold.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter-bold.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="icon" href="/images/icon/logo/logo-<js>write(icon)</js>-32.png?version=2025.1.1.0" type="image/png">
    <title>Pluma</title>
</head>
<body class="<js>write(theme)</js>">

    <div class="wrapper">
        <header>
            <js>include('/images/-logo.svg')</js>
            <h1>Pluma</h1>
        </header>

        <nav>
            <ul>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/options.html">
                        <span>Options</span>
                    </a>
                </li>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/preferences.html">
                        <span>Preferences</span>
                    </a>
                </li>
                <li class="active">
                    <a class="page active" tabindex="-1">
                        <span>Guide</span>
                    </a>
                </li>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/about.html">
                        <span>About</span>
                    </a>
                </li>
            </ul>
        </nav>

        <div id="loading" class="loading">
            <div>
                <js>include('/images/-loading.svg')</js>
                Loading
            </div>
        </div><!-- loading -->

        <div id="content" class="content hidden">
            <js>include('/page/include/-permissions.html.jss')</js>

            <js>include('/page/include/-show-message.html.jss')</js>

            <h1>Guide</h1>

            <div class="box">
                <div class="box-inner">
                    <ul>
                        <li>
                            <a href="#overview" class="scroll-to" data-scroll-to="overview">Overview</a>
                        </li>
                        <li>
                            <a href="#extension-icon" class="scroll-to" data-scroll-to="extension-icon">Extension Icon</a>
                        </li>
                        <li>
                            <a href="#usage" class="scroll-to" data-scroll-to="usage">Usage</a>
                        </li>
                        <li>
                            <a href="#limitations" class="scroll-to" data-scroll-to="limitations">Limitations</a>
                        </li>
                        <li>
                            <a href="#uninstalling" class="scroll-to" data-scroll-to="uninstalling">Uninstalling</a>
                        </li>
                    </ul>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 id="overview">
                        Overview
                    </h3>

                    <p>
                        Pluma is an extension that allows you to spellcheck and edit text as you browse.

                        Proofread and mockup changes with immediate visual feedback.

                        Save time by not having to use slower document and image editing programs to explore what-if possibilities.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 id="extension-icon">
                        Extension Icon
                    </h3>

                    <p>
                        Although you can use the full <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/options.html">options</a> page to change settings, Pluma will take less clicks to manage if its extension icon is visible.
                    </p>

                    <div class="only-browser-brave">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the toolbar of your browser, use an extensions menu or other configuration option of your browser to always show the Pluma icon.
                        </p>
                    </div><!-- only-browser-brave -->

                    <div class="only-browser-chrome">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the toolbar of your browser, use the extensions <span class="no-wrap">menu <img src="/images/messages/chrome/puzzle.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the upper right of your browser to enable a <span class="no-wrap">pin <img src="/images/messages/chrome/pin.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> for Pluma.
                        </p>
                    </div><!-- only-browser-chrome -->

                    <div class="only-browser-edge">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in toolbar of your browser, use the extensions <span class="no-wrap">menu <img src="/images/messages/edge/puzzle.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the upper right of your browser and enable the <span class="no-wrap">eye <img src="/images/messages/edge/eye.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> for Pluma.
                        </p>
                    </div><!-- only-browser-edge -->

                    <div class="only-browser-firefox">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/firefox/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the toolbar of your browser, use the extensions <span class="no-wrap">menu <img src="/images/messages/firefox/puzzle.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the upper right of your browser and then click the <span class="no-wrap">gear <img src="/images/messages/firefox/gear.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> for Pluma and choose "Pin to Toolbar".
                        </p>
                    </div><!-- only-browser-firefox -->

                    <div class="only-browser-opera">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the toolbar of your browser, use an extensions menu or other configuration option of your browser to always show the Pluma icon.
                        </p>
                    </div><!-- only-browser-opera -->

                    <div class="only-browser-unknown">
                        <p>
                            If you do not see a Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in the toolbar of your browser, use an extensions menu or other configuration option of your browser to always show the Pluma icon.
                        </p>
                    </div><!-- only-browser-unknown -->
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 id="usage">
                        Usage
                    </h3>

                    <p>
                        As you browse, use the Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in your toolbar to view and change settings for the current tab that is focused. For example, navigate to <a href="https://www.blender.org/" rel="noopener noreferrer" target="_blank">blender.org</a> and once the page loads, click the Pluma icon in your toolbar. A popup should appear with the following options.
                    </p>

                    <ul>
                        <li>Edit all tabs</li>
                        <li>Spellcheck when editing</li>
                        <li>Edit this tab</li>
                    </ul>

                    <p>
                        The "Edit all tabs" option will turn Pluma on for all your tabs. This includes new tabs. This option is great if you are testing a site in multiple tabs or testing a site that tends to open links in new tabs.
                    </p>

                    <p>
                        The "Spellcheck when editing" option only applies when a tab is being edited. As in, spellchecking will only be enabled if the "Edit all tabs" or "Edit this tab" option is checked.
                    </p>

                    <p>
                        The "Edit this tab" option will turn Pluma on for a single tab only. This allows you to use Pluma for one or more tabs, without affecting all your tabs.
                    </p>

                    <p>
                        As you change options, a summary towards the bottom of the popup will list whether you are editing, editing and spellchecking, or just viewing a page. Once the popup is closed, you can also glance up at the Pluma <span class="no-wrap">icon <img src="/images/messages/chrome/status.png?version=2025.1.1.0" width="18" height="18" class="icon-inline" alt></span> in your toolbar to see the current status. If the icon is blue, Pluma is active for the current tab.
                    </p>

                    <p>
                        <strong>WARNING:</strong> Pluma wants you to be able to edit any text. That includes links, buttons, and other interactive elements. A normal click should allow you to edit most things but in order to activate a clickable item in edit mode, you will need to use a modifier key. In Windows, hold down the ALT key when clicking. In macOS, hold down the ALT or CMD keys when clicking. Holding down a modifier key when clicking is how you tell Pluma that you actually want to click something and not just edit it.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 id="limitations">
                        Limitations
                    </h3>

                    <p>
                        Keeping in mind that each website is a unique creation, here is a list of limitations you may encounter while using Pluma.
                    </p>

                    <ul>
                        <li>
                            Some sites may not be editable until the site fully loads.
                        </li>
                        <li>
                            Some sites may have text that looks editable but the text is actually an image.
                        </li>
                        <li>
                            Some sites may require holding down a modifier key when pressing enter to submit a form.
                        </li>
                        <li>
                            Some sites may have areas that are updated by JavaScript. Edits to these areas may be replaced or reset at any time.
                        </li>
                        <li>
                            Some sites may have form or other interactive elements that are always clickable and not editable.
                        </li>
                        <li>
                            Some sites may have invisible layers on top of text which may block your mouse from being able to click into text for editing.
                        </li>
                        <li>
                            Some sites will react to certain key presses when editing text. For example, the F key activates fullscreen video on YouTube.
                        </li>
                        <li>
                            Some sites may not display spelling suggestions until you click into the page or click into an area that should be checked for spelling.
                        </li>
                        <li>
                            Some sites may have advertisements that take a few seconds to become editable. These advertisements may disappear or be replaced at any time so edits are likely to be short lived.
                        </li>
                    </ul>

                    <p>
                        Also keep in mind that editing and spellchecking are provided by your browser. The more capable your browser is, the better your experience will be.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 id="uninstalling">
                        Uninstalling
                    </h3>

                    <p>
                        For the smoothest uninstall experience, make sure no tabs are in edit mode before disabling, removing, or uninstalling Pluma.
                    </p>

                    <p>
                        To fix any tabs that are still editable after uninstalling, navigate to a new page, reload a page, or restart your browser to return all pages to normal.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->
        </div><!-- content -->
    </div><!-- wrapper -->

    <js>include('/page/include/-scroll-nav.html')</js>

    <script src="/js/browser-polyfill.js?version=2025.1.1.0"></script>
    <script src="/js/shared.js?version=2025.1.1.0"></script>
    <script src="/js/page/guide.js?version=2025.1.1.0"></script>

</body>
</html>