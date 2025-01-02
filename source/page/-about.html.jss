<js>
    const theme = args[0]
    const icon  = args[1]
    const page  = 'about'
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
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/guide.html">
                        <span>Guide</span>
                    </a>
                </li>
                <li class="active">
                    <a class="page active" tabindex="-1">
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

        <div id="content" class="content visibility-hidden">
            <js>include('/page/include/-permissions.html.jss')</js>

            <js>include('/page/include/-show-message.html.jss')</js>

            <h1>About</h1>

            <div class="box">
                <div class="box-inner">
                    <p>
                        You are running Pluma version
                        <strong id="about-version">1.0</strong>
                        <span id="about-browser"></span>
                    </p>

                    <p>
                        This software is provided under a no-contact and no-support model. Do not contact the author, for any reason, even if you think it would benefit the author.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <h2>Change Log</h2>

            <div class="box">
                <div class="box-inner">
                    <h3>January 1, 2025</h3>

                    <p>
                        Updated license to be in the public domain.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3>April 1, 2024</h3>

                    <p>
                        Updated to a no-contact and no-support model.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3>January 24, 2023</h3>

                    <p>
                        Official support for Mozilla Firefox.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3>November 26, 2022</h3>

                    <p>
                        Updated contact information.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3>September 15, 2022</h3>

                    <p>
                        Pluma officially launches.
                    </p>
                </div><!-- box-inner -->
            </div><!-- box -->

            <h2>Troubleshooting</h2>

            <div class="box">
                <div class="box-inner">
                    <p>
                        The information below is what Pluma sees behind the scenes. It may be useful for troubleshooting and as long as this page is open, it will continually update to reflect any changes.
                    </p>

                    <hr>

                    <p>
                        <strong>Options</strong><br>
                        <span id="trouble-options" class="word-break-all">Unknown</span>
                    </p>

                    <p>
                        <strong>Pluma Version</strong><br>
                        <span id="trouble-version">1.0</span>
                    </p>

                    <p>
                        <strong>Web Browser Version</strong><br>
                        <span id="trouble-browser">Unknown</span>
                    </p>

                    <hr>

                    <div>
                        <input id="trouble-copy" type="button" value="Copy Information" class="button smaller">
                        <input id="trouble-copy-busy" type="button" value="Copied" class="button hidden smaller" disabled>
                    </div>
                </div><!-- box-inner -->
            </div><!-- box -->
        </div><!-- content -->
    </div><!-- wrapper -->

    <js>include('/page/include/-scroll-nav.html')</js>

    <script src="/js/browser-polyfill.js?version=2025.1.1.0"></script>
    <script src="/js/shared.js?version=2025.1.1.0"></script>
    <script src="/js/page/about.js?version=2025.1.1.0"></script>

</body>
</html>