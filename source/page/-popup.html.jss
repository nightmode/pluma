<js>
    const theme = args[0]
    const icon  = args[1]
</js><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/css/popup.css?version=2025.1.1.0">
    <link rel="preload" href="/fonts/inter.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter-medium.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="preload" href="/fonts/inter-semibold.woff?version=2025.1.1.0" as="font" crossorigin>
    <link rel="icon" href="/images/icon/logo/logo-<js>write(icon)</js>-32.png?version=2025.1.1.0" type="image/png">
    <title>Pluma</title>
</head>
<body class="popup <js>write(theme)</js>">

    <div class="popup-card">
        <div id="popup-wrapper"><!-- javascript will add the class "visible" to this div when ready -->
            <div class="popup-options">
                <div class="popup-options-row">
                    <div class="popup-options-title">
                        Edit all tabs
                    </div>

                    <div class="popup-options-center">
                        <div>
                            <input type="checkbox" is="custom-checkbox" data-option-type="global">
                        </div>
                    </div><!-- popup-options-center -->
                </div><!-- popup-options-row -->

                <div class="popup-options-row">
                    <div class="popup-options-title">
                        Spellcheck when editing
                    </div>

                    <div class="popup-options-center">
                        <div>
                            <input type="checkbox" is="custom-checkbox" data-option-type="spellcheck">
                        </div>
                    </div><!-- popup-options-center -->
                </div><!-- popup-options-row -->

                <div class="popup-options-row">
                    <div class="popup-options-title">
                        Edit this tab
                    </div>

                    <div class="popup-options-center">
                        <div>
                            <input type="checkbox" is="custom-checkbox" data-option-type="tab">
                        </div>
                    </div><!-- popup-options-center -->
                </div><!-- popup-options-row -->
            </div><!-- popup-options -->

            <hr>

            <p id="popup-summary" class="popup-summary">
                <!-- will be populated by javascript -->
            </p>
        </div><!-- popup-wrapper -->

        <div id="loading"><!-- javascript will add the class "hidden" here once options are ready for use -->
            <div>
                <js>include('/images/-loading.svg')</js>
                Loading
            </div>
        </div><!-- loading -->
    </div><!-- popup-card -->

    <p class="popup-footer">
        <strong>Pluma</strong>
        <a href="/page/<js>write(theme)</js>/<js>write(icon)</js>/options.html" id="link-options">
            <span>Options</span>
        </a>
    </p>

    <script src="/js/browser-polyfill.js?version=2025.1.1.0"></script>
    <script src="/js/shared.js?version=2025.1.1.0"></script>
    <script src="/js/page/popup.js?version=2025.1.1.0"></script>

</body>
</html>