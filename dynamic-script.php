<?php
header("Content-type: application/javascript");
include './config.php';
?>
const startLat = <?=$config['startLat']?>;
const startLon = <?=$config['startLon']?>;
const startZoom = <?=$config['startZoom']?> || 10;
const minZoom = <?=$config['minZoom']?> || 10;
const maxZoom = <?=$config['maxZoom']?> || 18;
const areas = <?=json_encode($config['areas'])?>;
const areasText = "<?=$config['areasText']['singular']?>";
const areasTextPlural = "<?=$config['areasText']['plural']?>";
const tileserver = "<?=$config['tileserver']?>";
const legendSort = <?=$config['legendSort'] !== false ? '1' : '0'?>;
