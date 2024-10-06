<?php include './config.php'; ?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title><?= $config['title'] ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link rel="icon" type="image/ico" sizes="32x32" href="./favicon.ico">
    <link rel="icon" type="image/ico" sizes="16x16" href="./favicon.ico">
    <link rel="shortcut icon" href="./favicon.ico">

    <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA==" crossorigin="" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha256-eSi1q2PG6J7g7ib17yAaWMcrr5GrtohYChqibrV7PBE=" crossorigin="anonymous" />
    <link rel="stylesheet" type="text/css" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />
    <link rel="stylesheet" type="text/css" href="styles.css" />
    <style>
        .info {
            width: <?= $config['legendWidth']?>px;
        }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="navbar-header">
        <a class="navbar-brand" href="./"><img class="align-middle" src="./favicon.ico" border="0" height="32px"></a>
        <a class="navbar-brand" href="./"><?= $config['title'] ?></a>
    </div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav mr-auto">
            <?php
            $headerLeft = $config['header']['left'];
            if (isset($headerLeft) && $headerLeft !== false) {
                foreach ($headerLeft as $nav) {
                    echo '
                <li class="nav-item">
                    <a class="nav-link" href="' . $nav['url'] . '" target="_self"><i class="' . $nav['icon'] . '"></i>&nbsp;' . $nav['name'] . '</a>
                </li>';
                }
            }
            ?>
        </ul>
        <ul class="navbar-nav ml-auto">
            <?php
            $headerRight = $config['header']['right'];
            if (isset($headerRight) && $headerRight !== false) {
                foreach ($headerRight as $nav) {
                    echo '
                <li class="nav-item">
                    <a class="nav-link" href="' . $nav['url'] . '" target="_blank"><i class="' . $nav['icon'] . '"></i>&nbsp;' . $nav['name'] . '</a>
                </li>';
                }
            }
            ?>
        </ul>
    </div>
</nav>

<div id="mapid" style="top: 59px; left: 0; position: absolute; height: 100%; width: 100%;"></div>

<script>
    var config = <?= json_encode($config) ?>;
</script>

<script type="text/javascript" src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg==" crossorigin=""></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" crossorigin="anonymous"></script>
<script src="script.js"></script>

</body>
</html>