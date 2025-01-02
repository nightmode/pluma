<js>
    const theme = args[0]
    const icon  = args[1]
    const page  = 'options'
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
                <li class="active">
                    <a class="page active" tabindex="-1">
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

            <div class="content-thin">
                <h1>Options</h1>

                <div class="box">
                    <div class="box-inner box-options">
                        <div class="options-header">
                            <h3>
                                Global
                            </h3>
                        </div><!-- options-header -->

                        <div class="options options-list">
                            <hr class="grid-col-span-2">

                            <div class="options-row">
                                <div class="options-text">
                                    <div class="options-title options-title-strong" id="options-title-global">
                                        Edit All Tabs
                                    </div>
                                </div><!-- options-text -->

                                <div class="options-center">
                                    <div>
                                        <input type="checkbox" is="custom-checkbox" data-option-type="global" data-option="global">
                                    </div>
                                </div><!-- options-center -->
                            </div><!-- options-row -->

                            <div class="options-row">
                                <div class="options-text">
                                    <div class="options-title options-title-strong" id="options-title-spellcheck">
                                        Spellcheck When Editing
                                    </div>
                                </div><!-- options-text -->

                                <div class="options-center">
                                    <div>
                                        <input type="checkbox" is="custom-checkbox" data-option-type="spellcheck" data-option="spellcheck">
                                    </div>
                                </div><!-- options-center -->
                            </div><!-- options-row -->
                        </div><!-- options -->
                    </div><!-- box-inner -->
                </div><!-- box -->

                <div class="box no-margin-top">
                    <div class="box-inner box-options">
                        <div class="options-header">
                            <h3>
                                Tabs
                            </h3>

                            <div class="options-filter" id="options-filter-tabs">
                                <input is="custom-filter" class="custom-filter" id="options-filter-tabs-text" placeholder="Filter" spellcheck="false" type="text">
                                <input class="hidden options-filter-clear" id="options-filter-tabs-clear" type="button" value="" aria-hidden="true">
                            </div><!-- options-filter -->

                            <div class="options-sort" id="options-sort-tabs">
                                <select is="custom-select" data-option="tabs">
                                    <option value="">Sort</option>
                                    <optgroup label="Title">
                                        <option value="a-z">A&ndash;Z</option>
                                        <option value="z-a">Z&ndash;A</option>
                                    </optgroup>
                                    <optgroup label="Option">
                                        <option value="edit-view">Edit&ndash;View</option>
                                        <option value="view-edit">View&ndash;Edit</option>
                                    </optgroup>
                                </select>
                            </div><!-- options-sort -->
                        </div><!-- options-header -->

                        <div class="loading hidden" id="options-tabs-loading">
                            <div>
                                <js>include('/images/-loading.svg')</js>
                                Loading
                            </div>
                        </div><!-- loading -->

                        <div id="options-list-area-tabs">
                            <div class="options options-list hidden" id="options-tabs">
                                <!-- will be populated by javascript -->
                            </div><!-- options -->
                        </div><!-- options-list-area-tabs -->

                        <div class="options-paginate hidden" id="options-paginate-tabs">
                            <hr>

                            <div class="flex">
                                <div class="link">
                                    <a class="options-paginate-link" data-option="first" href="">&lt;--</a>
                                </div>
                                <div class="link">
                                    <a class="options-paginate-link" data-option="previous" href="">&lt;-</a>
                                </div>
                                <div class="text">
                                    <span class="text-viewing">
                                        Viewing
                                    </span>
                                    <span class="text-numbers">
                                        <!-- will be populated by javascript -->
                                    </span>
                                </div>
                                <div class="link">
                                    <a class="options-paginate-link" data-option="next" href="">-&gt;</a>
                                </div>
                                <div class="link">
                                    <a class="options-paginate-link" data-option="last" href="">--&gt;</a>
                                </div>
                            </div><!-- flex -->
                        </div><!-- options-paginate -->
                    </div><!-- box-inner -->
                </div><!-- box -->
            </div><!-- content-thin -->
        </div><!-- content -->
    </div><!-- wrapper -->

    <template id="template-options-tabs-row">
        <hr class="grid-col-span-2">

        <div class="options-row">
            <div class="options-text">
                <div class="options-title">
                    ...
                </div>
            </div><!-- options-text -->

            <div class="options-center">
                <div>
                    <input type="checkbox" is="custom-checkbox" data-option-type="tab" data-option><!-- data option will be set to a tab id -->
                </div>
            </div><!-- options-center -->
        </div><!-- options-row -->
    </template>

    <template id="template-options-tabs-no-results">
        <hr class="grid-col-span-2">
        <p class="grid-col-span-2 no-margin-bottom text-center">
            No results for filter.
        </p>
    </template>

    <js>include('/page/include/-scroll-nav.html')</js>

    <script src="/js/browser-polyfill.js?version=2025.1.1.0"></script>
    <script src="/js/shared.js?version=2025.1.1.0"></script>
    <script src="/js/page/options.js?version=2025.1.1.0"></script>

</body>
</html>