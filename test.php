<?php
  include './php/startup.php';
?>

<!DOCTYPE html>
<html lang="en" ng-app="felt.test">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Fav and touch icons -->
<link rel="apple-touch-icon" href="images/favicon72.png">
<link rel="apple-touch-icon" sizes="72x72" href="images/favicon72.png">
<link rel="apple-touch-icon" sizes="144x144" href="images/favicon144.png">

<link rel="shortcut icon" href="images/faviconTest.png">


<!-- could easily use a custom property of the state here instead of 'name' -->
<!--<title ng-bind="'jeff'+$state.current.breadcrumbs[0].displayName">.::Felt::.</title>-->
<title>FELT - test</title>


<!-- Bootstrap core CSS -->
<link href="app/bower_components/bootstrap/css/bootstrap.css" rel="stylesheet">

<!-- add theme styles for this template -->
<link id="pagestyle" href="css/skin-2.css" rel="stylesheet">

<!-- Custom styles for this template -->
<link href="css/style.css" rel="stylesheet">
<link href="css/mystyle.css" rel="stylesheet">
<link href="css/mbExtruder.css" rel="stylesheet">

<!-- LIGHTBOX -->
<link href="app/bower_components/lightbox2/dist/css/lightbox.css" rel="stylesheet">
<!-- 
<link rel="stylesheet" href="app/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css">
<link rel="stylesheet" href="app/bower_components/angular-bootstrap/ui-bootstrap-csp.css">
-->

<!-- css3 animation effect for this template -->
<link href="css/animate.css" rel="stylesheet">

<!-- styles needed by carousel slider -->
<link href="css/owl.carousel.css" rel="stylesheet">
<link href="css/owl.theme.css" rel="stylesheet">

<!-- normalize -->
<link href="app/bower_components/normalize.css/normalize.css" rel="stylesheet">

<!-- styles needed by checkRadio -->
<link href="js/ion.checkRadio-1.1.0/css/ion.checkRadio.css" rel="stylesheet">
<link href="js/ion.checkRadio-1.1.0/css/ion.checkRadio.cloudy.css" rel="stylesheet">

<!-- styles needed by mCustomScrollbar -->
<link href="app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css" rel="stylesheet">

<!-- Angucomplete-alt -->
<link href="app/bower_components/angucomplete-alt/angucomplete-alt.css" rel="stylesheet">

<!-- Angular animations -->
<link href="css/ng-animations.css" rel="stylesheet">
<link href="css/coolbuttons.css" rel="stylesheet">

<!-- Just for debugging purposes. -->
<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->

</head>

<body ng-controller="MainCtrl">

  <!-- Le javascript ================================================== -->

  <!-- Placed at the end of the document so the pages load faster -->
  <script type="text/javascript" src="app/bower_components/jquery/dist/jquery.min.js"></script>
  <script type="text/javascript" src="app/bower_components/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"></script>
  <script type="text/javascript" src="app/bower_components/bootstrap/js/bootstrap.min.js"></script>
  
  <!-- include jqueryCycle plugin -->
  <script type="text/javascript" src="app/bower_components/jquery-cycle2/build/jquery.cycle2.min.js"></script>

  <!-- include easing plugin -->
  <script type="text/javascript" src="js/jquery.easing.1.3.js"></script>

  <!-- include parallax plugin -->
  <script type="text/javascript" src="app/bower_components/jquery.scrollTo/jquery.scrollTo.min.js"></script>
  <script type="text/javascript" src="app/bower_components/jquery.serialScroll/jquery.serialScroll.min.js"></script>
  <script type="text/javascript" src="app/bower_components/jQuery-Parallax/scripts/jquery.parallax-1.1.3.js"></script>

  <!-- include mCustomScrollbar plugin //Custom Scrollbar  -->
  <script type="text/javascript" src="app/bower_components/jquery-mousewheel/jquery.mousewheel.min.js"></script>
  <script type="text/javascript"
    src="app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"></script>

  <!-- include checkRadio plugin //Custom check & Radio  -->
  <script type="text/javascript" src="js/ion.checkRadio-1.1.0/js/ion.checkRadio.min.js"></script>

  <!-- include grid.js // for equal Div height  -->
  <script type="text/javascript" src="js/grids.js"></script>

  <!-- include carousel slider plugin  -->
  <script type="text/javascript" src="js/owl.carousel.min.js"></script>

  <!-- jQuery minimalect // custom select   -->
  <script type="text/javascript" src="js/jquery.minimalect.min.js"></script>

  <!-- ANGULAR -->
  <script type="text/javascript" src="app/bower_components/angular/angular.js"></script>
  <script type="text/javascript" src="app/bower_components/angular-animate/angular-animate.js"></script>
  <script type="text/javascript" src="app/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
  
  <script type="text/javascript" src="app/bower_components/angular-bootstrap/ui-bootstrap.js"></script>
  <script type="text/javascript" src="app/bower_components/angular-utils-ui-breadcrumbs/uiBreadcrumbs.js"></script>
  <script type="text/javascript" src="app/bower_components/angucomplete-alt/angucomplete-alt.js"></script>
  <script type="text/javascript" src="app/bower_components/angular-translate/angular-translate.js"></script>
  
  <!-- LIGHTBOX -->
  <script type="text/javascript" src="app/bower_components/lightbox2/dist/js/lightbox.js"></script>
  
  <script type="text/javascript" src="app/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js"></script>
  <script type="text/javascript" src="app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>


  <!-- LOKI -->
  <script type="text/javascript" src="js/lokijs.js"></script>
  <script type="text/javascript" src="js/jquerySyncToMySqlAdapter.js"></script>


  <!-- APP -->
  <script type="text/javascript" src="app/test.js"></script>
  <script type="text/javascript" src="app/home/account.js"></script>
  <script type="text/javascript" src="app/home/account.router.js"></script>
  <script type="text/javascript" src="app/backend/backend.router.js"></script>
  <script type="text/javascript" src="common/auth/authentication.js"></script>
  <script type="text/javascript" src="app/shop/shop.js"></script>
  <script type="text/javascript" src="app/shop/shipping.js"></script>
  <script type="text/javascript" src="app/shop/cart.js"></script>
  <script type="text/javascript" src="app/shop/cart.router.js"></script>
  <script type="text/javascript" src="app/shop/shop-service.js"></script>
  <script type="text/javascript" src="app/shop/inventory.js"></script>
  <script type="text/javascript" src="app/shop/stockentries.js"></script>
  <script type="text/javascript" src="app/shop/orders.js"></script>
  <script type="text/javascript" src="app/shipping/shipping-service.js"></script>
  <script type="text/javascript" src="app/shipping/shipping-factory.js"></script>
  <script type="text/javascript" src="app/common/color-service.js"></script>
  <script type="text/javascript" src="common/utils/utils-service.js"></script>

  <!-- include touchspin.js // touch friendly input spinner component   -->
  <script type="text/javascript" src="js/touchspin/src/jquery.bootstrap-touchspin-mine.js"></script>

</body>
</html>
