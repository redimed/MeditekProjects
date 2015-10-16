<!DOCTYPE html>
<html>
    <head>
        <title>Upload File</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
        <link href="{{asset('../resources/assets/fileinput/css/fileinput.min.css')}}" media="all" rel="stylesheet" type="text/css" />
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <!-- canvas-to-blob.min.js is only needed if you wish to resize images before upload.
             This must be loaded before fileinput.min.js -->
        <script src="{{asset('../resources/assets/fileinput/js/plugins/canvas-to-blob.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('../resources/assets/fileinput/js/fileinput.min.js')}}"></script>
        <!-- bootstrap.js below is only needed if you wish to the feature of viewing details
             of text file preview via modal dialog -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" type="text/javascript"></script>
        <!-- optionally if you need translation for your language then include
            locale file as mentioned below -->
        <script src="{{asset('../resources/assets/fileinput/js/fileinput_locale_el.js')}}"></script>
        <style>
html, body {
    height: 100%;
}

            body {
    margin: 0;
    padding: 0;
    width: 100%;
    display: table;
    font-weight: 100;
                font-family: 'Lato';
            }

            .container {
    text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
    text-align: center;
                display: inline-block;
            }

            .title {
    font-size: 96px;
            }
        </style>

        <style>
            .kv-avatar .file-preview-frame,.kv-avatar .file-preview-frame:hover {
                margin: 0;
                padding: 0;
                border: none;
                box-shadow: none;
                text-align: center;
            }
            .kv-avatar .file-input {
                display: table-cell;
                max-width: 220px;
            }
        </style>


    </head>
    <body>
        <div class="container">
            <div class="content">
                <div>Meditek Upload File</div>
                <!-- <form class="form" method="post" action="../api/UploadFile" enctype="multipart/form-data"> -->
                @yield('UploadForm')
                
            </div>
        </div>
    </body>
</html>
