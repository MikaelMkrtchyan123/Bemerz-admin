<!--
//********************************************************************
//  Bemerz Software, Inc. CONFIDENTIAL AND PROPRIETARY
//  FOR USE BY AUTHORIZED PERSONS ONLY
//
//  This is an unpublished work fully protected by the
//  United States copyright laws and is a trade secret
//  belonging to the copyright holder.
//
//  Copyright (c) 2016 Bemerz Software Inc.
//  All Rights Reserved.
//********************************************************************
-->
<?php
$bemerzEnv = "dev";
if (getenv('BEMERZ_ENV') == "production"){
  $bemerzEnv = "prod";
}
$configFile = json_decode(file_get_contents("js/builder.json"), true);
?>
<!DOCTYPE html>
<html ng-app="bemerzApp">
<head>
  <meta charset="utf-8"/>
  <meta name="apple-itunes-app" content="app-id=1109732057, app-argument=keedgo"/>
  <meta name="google-play-app" content="app-id=com.bemerz.afterschool">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration and Login</title>
  <link rel="stylesheet" href="css/materialize.css"/>
  <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/font.css"/>
  <link rel="icon" href="favicon.ico?version=1.0.0" sizes="16x16">
  <link href='//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,400italic' rel='stylesheet'
        type='text/css'>

  <link rel='stylesheet' href='css/fullcalendar.css'/>

  <link rel='stylesheet' href='css/jquery.smartbanner.css'/>

  <link rel="stylesheet" href="css/style.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/documents.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/events.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/groups.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/header_footer.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/login.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/messages.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/privacy.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <link rel="stylesheet" href="css/users.css?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"/>
  <script type="application/javascript">
    var BEMERZ_ENV = "<?php echo $bemerzEnv; ?>";
    var BEMERZ_VERSION = "<?php echo $configFile["versions"][$bemerzEnv]; ?>";
  </script>

  <script type="application/javascript" src="js/out.js?version=<?php echo $configFile["versions"][$bemerzEnv]; ?>"></script>

</head>
<body ng-controller="AppCtrl">

<script type="text/javascript">
  $(function() { $.smartbanner({
    title: 'Keedgo',
    author: 'Bemerz Software',
    icon: 'ionic.png',
    daysHidden: 0,
    daysReminder: 0,
    hideOnInstall: false
  }) } )
</script>


<!-- <div ng-http-loader template="/templates/loader.html"></div> -->
<div id="preloaderPercent" class="overlay fixed-overlay">
  <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</div>
<section id="pageWrap" class="white-bg content-wrapper-box" ui-view>

</section>

<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/2921184.js"></script>
</body>

</html>