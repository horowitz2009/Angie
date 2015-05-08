<?php
  include './php/startup.php';
?>

<!DOCTYPE html>
<html lang="en" ng-app="felt">
<head>
<!--
    <script>
        paceOptions = {
          elements: true
        };
    </script>
    <script src="app/bower_components/pace/pace.min.js"></script>
    <link href="css/pace2.css" rel="stylesheet">
-->

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon" href="images/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon" sizes="144x144" href="images/apple-touch-icon-144-precomposed.png">

    <link rel="shortcut icon" href="images/favicon.png">


    <!-- could easily use a custom property of the state here instead of 'name' -->
    <!--<title ng-bind="'jeff'+$state.current.breadcrumbs[0].displayName">.::Felt::.</title>-->
    <title update-title prefix='ФЕЛТ - '></title>
    
    
    <!-- Bootstrap core CSS -->
    <link href="app/bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet">

    <!-- add theme styles for this template -->
    <link id="pagestyle" href="css/skin-2.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/style.css" rel="stylesheet">

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
<!-- Modal Login start -->
<div class="modal signUpContent fade" id="ModalLogin" tabindex="-1" role="dialog">
    <div class="modal-dialog ">
        <div class="modal-content">
        
        <iframe src="sink.html" name="sink" style="display:none"></iframe>
        
        <form name="loginForm" action="sink.html" target="sink" method="post" ng-controller="LoginController"
              ng-submit="login(credentials)" novalidate form-autofill-fix>
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"> ×</button>
                <h3 class="modal-title-site text-center"> Въведете имейл и парола </h3>
            </div>
            <div class="modal-body">
                <div class="control-group">
                    <div style="height:25px;">
                      <span ng-cloak>{{result}}</span>                        
                    </div>
                </div>
                <div class="form-group login-username">
                    <div>
                        <input name="email" id="email" ng-model="credentials.email" 
                               class="form-control input" size="20"
                               placeholder="Имейл  адрес" type="text" ><!-- autocomplete="off"
                               style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QsPDhss3LcOZQAAAU5JREFUOMvdkzFLA0EQhd/bO7iIYmklaCUopLAQA6KNaawt9BeIgnUwLHPJRchfEBR7CyGWgiDY2SlIQBT/gDaCoGDudiy8SLwkBiwz1c7y+GZ25i0wnFEqlSZFZKGdi8iiiOR7aU32QkR2c7ncPcljAARAkgckb8IwrGf1fg/oJ8lRAHkR2VDVmOQ8AKjqY1bMHgCGYXhFchnAg6omJGcBXEZRtNoXYK2dMsaMt1qtD9/3p40x5yS9tHICYF1Vn0mOxXH8Uq/Xb389wff9PQDbQRB0t/QNOiPZ1h4B2MoO0fxnYz8dOOcOVbWhqq8kJzzPa3RAXZIkawCenHMjJN/+GiIqlcoFgKKq3pEMAMwAuCa5VK1W3SAfbAIopum+cy5KzwXn3M5AI6XVYlVt1mq1U8/zTlS1CeC9j2+6o1wuz1lrVzpWXLDWTg3pz/0CQnd2Jos49xUAAAAASUVORK5CYII=); background-attachment: scroll; background-position: 100% 50%; background-repeat: no-repeat;" -->
                    </div>
                </div>
                <div class="form-group login-password">
                    <div>
                        <input name="password" id="password" ng-model="credentials.password"
                               class="form-control input" size="20"
                               placeholder="Парола" type="password" ><!-- autocomplete="off"
                               style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QsPDhss3LcOZQAAAU5JREFUOMvdkzFLA0EQhd/bO7iIYmklaCUopLAQA6KNaawt9BeIgnUwLHPJRchfEBR7CyGWgiDY2SlIQBT/gDaCoGDudiy8SLwkBiwz1c7y+GZ25i0wnFEqlSZFZKGdi8iiiOR7aU32QkR2c7ncPcljAARAkgckb8IwrGf1fg/oJ8lRAHkR2VDVmOQ8AKjqY1bMHgCGYXhFchnAg6omJGcBXEZRtNoXYK2dMsaMt1qtD9/3p40x5yS9tHICYF1Vn0mOxXH8Uq/Xb389wff9PQDbQRB0t/QNOiPZ1h4B2MoO0fxnYz8dOOcOVbWhqq8kJzzPa3RAXZIkawCenHMjJN/+GiIqlcoFgKKq3pEMAMwAuCa5VK1W3SAfbAIopum+cy5KzwXn3M5AI6XVYlVt1mq1U8/zTlS1CeC9j2+6o1wuz1lrVzpWXLDWTg3pz/0CQnd2Jos49xUAAAAASUVORK5CYII=); background-attachment: scroll; background-position: 100% 50%; background-repeat: no-repeat;" -->
                    </div>
                </div>
                <div class="form-group">
                    <div>
                        <div class="checkbox login-rememberme">
                            <label style=" margin-left: 4px;">
                              <input name="rememberme" type="checkbox" id="rememberme_checkbox"
                                     ng-model="credentials.rememberme"> Запомни ме 
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <input name="submit" class="btn  btn-block btn-lg btn-primary" value="Вход" type="submit">
                        
                    </div>
                </div>
                <!--userForm-->

            </div>
            <div class="modal-footer">
                <p class="text-center"> Нямате акаунт? 
                  <a data-toggle="modal" data-dismiss="modal" href="#ModalSignup">  Създайте акаунт. </a> <br>
                  <a href="forgot-password.html"> Забравена парола? </a>
                </p>
            </div>
          </form>  
        </div>
        <!-- /.modal-content -->

    </div>
    <!-- /.modal-dialog -->

</div>
<!-- /.Modal Login -->


<!-- Modal Signup start -->
<div class="modal signUpContent fade" id="ModalSignup" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
                
        <iframe src="sink.html" name="sink" style="display:none"></iframe>
        
        <form name="loginForm" action="sink.html" target="sink" method="post" ng-controller="RegisterController"
              ng-submit="register(newUser)" novalidate form-autofill-fix>
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"> ×</button>
                <h3 class="modal-title-site text-center"> Регистрация </h3>
            </div>
            <div class="modal-body">
                <div class="control-group">
                    <div style="height:25px;">
                      <span ng-cloak>{{result}}</span>                        
                    </div>
                </div>

                <div class="form-group reg-email">
                    <div>
                        <input name="email" class="form-control input" size="20" 
                               ng-model="newUser.email" placeholder="Имейл  адрес" type="text">
                    </div>
                </div>
                <div class="form-group reg-password">
                    <div>
                        <input name="password" class="form-control input" size="20" 
                               ng-model="newUser.password" placeholder="Парола" type="password">
                    </div>
                </div>
                <div class="form-group reg-password">
                    <div>
                        <input name="password" class="form-control input" size="20" 
                               ng-model="newUser.password2" placeholder="Парола отново" type="password">
                    </div>
                </div>
<!--            <div class="form-group">
                    <div>
                        <div class="checkbox login-rememberme">
                            <label style=" margin-left: 4px;">
                              <input name="rememberme" type="checkbox" id="rememberme_checkbox2"
                                     ng-model="newUser.rememberme"> Запомни ме 
                            </label>
                        </div>
                    </div>
                </div>
-->                
                <div>
                    <div>
                        <input name="submit" class="btn  btn-block btn-lg btn-primary" value="Регистрирай" type="submit">
                    </div>
                </div>
                <!--userForm-->

            </div>
            <div class="modal-footer">
                <p class="text-center"> Имате акаунт? <a data-toggle="modal" data-dismiss="modal"
                                                           href="#ModalLogin">
                    Влезте от тук </a></p>
            </div>
            </form>
        </div>
        <!-- /.modal-content -->

    </div>
    <!-- /.modal-dialog -->

</div>
<!-- /.ModalSignup End -->

<!-- ===================================================================== -->
<!-- NAVBAR -->
<!-- ===================================================================== -->
<header  class="navbar navbar-tshop navbar-fixed-top megamenu" style="margin-bottom: 0px">
    <div class="navbar-top">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">
                    <div class="pull-left ">
                        <ul class="userMenu ">
                            <li>
                                <a href="#">
                                    <span class="hidden-xs">Помощ</span>
                                    <i class="glyphicon glyphicon-info-sign hide visible-xs "></i>
                                </a>
                            </li>
                            <li class="phone-number">
                                <a href="callto:+359887352619">
                                    <span> <i class="glyphicon glyphicon-phone-alt "></i></span>
                                    <span class="hidden-xs" style="margin-left:5px"> 088 735 26 19 </span>
                                </a>
                                <span ui-view="hint" class="navbar-text navbar-right"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6 no-margin no-padding">
                    <div class="pull-right">
                        <ul id="userMenu" class="userMenu hide">
                            <!-- logged -->
                            <li ng-if="currentUser">
                              <a href="#">
                              <span class="hidden-xs" style="text-transform: none;font-size: 14px;line-height: 28px;" 
                                    ng-bind="currentUser.email">
                                ...
                              </span></a>
                            </li>
                            
                            <li ng-if="currentUser" ng-cloak>
                              <a ui-sref="myaccount"><span class="hidden-xs"> Моят акаунт</span> 
                                <i class="glyphicon glyphicon-user hide visible-xs "></i>
                              </a>
                            </li>
                            
                            <li ng-if="currentUser" ng-cloak>
                              <a ng-click="logout(false)">
                                <span class="hidden-xs">Изход</span>
                                <i class="glyphicon glyphicon-log-out hide visible-xs "></i> 
                              </a>
                            </li>
                            
                            <!-- not logged -->    
                            <li ng-if="currentUser == null" ng-cloak>
                              <a data-toggle="modal" data-target="#ModalLogin"> 
                                <span class="hidden-xs">Вход</span>
                                <i class="glyphicon glyphicon-log-in hide visible-xs "></i> 
                              </a>
                            </li>
                            
                            <li ng-if="currentUser == null" ng-cloak class="hidden-xs"><a
                                    href="#"
                                    data-toggle="modal" data-target="#ModalSignup"> Регистрирайте акаунт </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--/.navbar-top-->

    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only"> Toggle navigation </span>
                <span class="icon-bar"> </span>
                <span class="icon-bar"> </span>
                <span class="icon-bar"> </span>
            </button>
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-cart">
                <i class="fa fa-shopping-cart colorWhite"> </i>
                <span class="cartRespons colorWhite"> КОЛИЧКА (57.00лв) </span>
            </button>

            <!-- BRAND -->
            <a class="navbar-brand " ui-sref="home"> <img src="images/logo(1).png" alt="ФЕЛТ"> </a>

            <!-- this part for mobile -->
            <div class="search-box pull-right hidden-lg hidden-md hidden-sm">
                <div class="input-group">
                    <button class="btn btn-nobg getFullSearch" type="button">
                        <i class="fa fa-search"> </i>
                    </button>
                </div>
                <!-- /input-group -->
            </div>
        </div>

        <!-- this part is duplicate from cartMenu  keep it for mobile -->
        <div class="navbar-cart  collapse">
            <div class="cartMenu  col-lg-4 col-xs-12 col-md-4 ">
                <div id="cart1" class="miniCartTable mCustomScrollbar" data-mcs-theme="dark" style="overflow: visible;">
                    <table>
                        <tbody>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/3.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black22 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/2.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black33 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/5.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black44 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/3.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black55 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/3.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black66 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        <tr class="miniCartProduct">
                            <td width="20%" class="miniCartProductThumb">
                                <div>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        <img src="images/4.jpg" alt="img"> </a></div>
                            </td>
                            <td width="40%">
                                <div class="miniCartDescription">
                                    <h4>
                                        <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                            TSHOP T shirt Black77 </a></h4>
                                    <span class="size"> 12 x 1.5 L </span>

                                    <div class="price"><span> $8.80 </span></div>
                                </div>
                            </td>
                            <td width="10%" class="miniCartQuantity"><a> X 1 </a></td>
                            <td width="15%" class="miniCartSubtotal"><span> $8.80 </span></td>
                            <td width="5%" class="delete"><a> x </a></td>
                        </tr>
                        </tbody>
                    </table>


                </div>
                <!--/.miniCartTable-->

                <div class="miniCartFooter  miniCartFooterInMobile text-right">
                    <h3 class="text-right subtotal"> Subtotal: $199 </h3>
                    <a class="btn btn-sm btn-danger"> <i class="fa fa-shopping-cart"> </i> VIEW CART </a> <a
                        class="btn btn-sm btn-primary"> CHECKOUT </a></div>
                <!--/.miniCartFooter-->

            </div>
            <!--/.cartMenu-->
        </div>
        <!--/.navbar-cart-->

        <!-- NAV elements -->
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">

                <li ui-sref-active="active"><a ui-sref="home"> Начало </a></li>

                <li id="myDropdown" class="dropdown megamenu-fullwidth">
                    <!-- <li ng-class="{active: $state.includes('shop')}"><a ui-sref="shop.categories.all">Продукти</a></li> -->
                    <a class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" ui-sref="shop.all"> Продукти <b
                            class="caret"> </b> </a>
                    <ul class="dropdown-menu">
                        <li class="megamenu-content ">
                            <ul class="col-lg-3  col-sm-3 col-md-3 unstyled noMarginLeft newCollectionUl">
                                <li class="no-border">
                                    <p class="promo-1"><strong> КАТЕГОРИИ </strong></p>
                                </li>
                                <li ng-repeat="menuitem in catMenuItems">
                                    <a tabindex="-1" ui-sref="shop.one({ categoryId: menuitem.id })" style="text-transform: uppercase"> {{menuitem.name}}
                                    </a>
                                </li>
                            </ul>
                            <ul class="col-lg-3  col-sm-3 col-md-3  col-xs-4">
                                <li><a class="newProductMenuBlock" ui-sref="shop.categories.one.product({categoryId:'wool',productId:'english-wool-red'})">
                                    <img class="img-responsive" src="images/e_red.jpg" alt="product">
                                    <span class="ProductMenuCaption"> <i class="fa fa-caret-right"> </i> ЧЕРВЕНА ВЪЛНА </span>
                                </a></li>
                            </ul>
                            <ul class="col-lg-3  col-sm-3 col-md-3 col-xs-4">
                                <li><a class="newProductMenuBlock" ui-sref="shop.categories.one.product({categoryId:'silk',productId:'white'})">
                                    <img class="img-responsive" src="images/wool_rozova.jpg" alt="product"> <span
                                        class="ProductMenuCaption"> <i
                                        class="fa fa-caret-right"> </i> БЯЛА КОПРИНА </span> </a></li>
                            </ul>
                            <ul class="col-lg-3  col-sm-3 col-md-3 col-xs-4">
                                <li><a class="newProductMenuBlock" ui-sref="shop.categories.one.product({categoryId:'needles',productId:'n36'})">
                                    <img class="img-responsive" src="images/promo3.jpg" alt="product"> <span
                                        class="ProductMenuCaption"> <i class="fa fa-caret-right"> </i> Игла #36 </span>
                                </a></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <!-- change width of megamenu = use class > megamenu-fullwidth, megamenu-60width, megamenu-40width -->
                <li class="dropdown megamenu-80width "><a data-toggle="dropdown" class="dropdown-toggle" data-hover="dropdown"
                                                          href="#">
                    SHOP <b class="caret"> </b> </a>
                    <ul class="dropdown-menu">
                        <li class="megamenu-content">

                            <!-- megamenu-content -->

                            <ul class="col-lg-2  col-sm-2 col-md-2  unstyled noMarginLeft">
                                <li>
                                    <p><strong> Women Collection </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Kameez </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Tops </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Shoes </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> T
                                    shirt </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    TSHOP </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> Party
                                    Dress </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> Women
                                    Fragrances </a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2  unstyled">
                                <li>
                                    <p><strong> Men Collection </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Panjabi </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> Male
                                    Fragrances </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Scarf </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Sandal </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Underwear </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Winter Collection </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> Men
                                    Accessories </a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2  unstyled">
                                <li>
                                    <p><strong> Top Brands </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Diesel </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Farah </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    G-Star RAW </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#"> Lyle
                                    &amp; Scott </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    Pretty Green </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    TSHOP </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index.html#">
                                    TANJIM </a></li>
                            </ul>
                            <ul class="col-lg-3  col-sm-3 col-md-3 col-xs-6">
                                <li class="no-margin productPopItem "><a
                                        href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                    <img class="img-responsive" src="images/g4.jpg" alt="img"> </a> <a
                                        class="text-center productInfo alpha90"
                                        href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                    Eodem modo typi <br>
                                    <span> $60 </span> </a></li>
                            </ul>
                            <ul class="col-lg-3  col-sm-3 col-md-3 col-xs-6">
                                <li class="no-margin productPopItem relative"><a
                                        href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                    <img class="img-responsive" src="images/g5.jpg" alt="img"> </a> <a
                                        class="text-center productInfo alpha90"
                                        href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                    Eodem modo typi <br>
                                    <span> $60 </span> </a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="dropdown megamenu-fullwidth"><a data-toggle="dropdown" class="dropdown-toggle" data-hover="dropdown"
                                                           href="#">
                    PAGES <b class="caret"> </b> </a>
                    <ul class="dropdown-menu">
                        <li class="megamenu-content">

                            <!-- megamenu-content -->

                            <h3 class="promo-1 no-margin hidden-xs"> 28+ HTML PAGES ONLY $12 || AVAILABLE ONLY AT WRAP
                                BOOTSTRAP </h3>

                            <h3 class="promo-1sub hidden-xs"> Complete Parallax E-Commerce Boostrap Template, Responsive
                                on any Device, 10+ color Theme + Parallax Effect </h3>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> Home Pages </strong></p>
                                </li>
                                <li><a href="index.html"> Home Version 1 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index2.html"> Home
                                    Version 2 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index3.html"> Home
                                    Version 3 (BOXES) </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index4.html"> Home
                                    Version 4 (LOOK 2)</a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index5.html"> Home
                                    Version 5 (LOOK 3)</a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index-header2.html">
                                        Header Version 2 </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index-header3.html">
                                        Header Version 3 </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/index-static-search.html">Header
                                        Version 4<br>
                                        ( Static Search Form)</a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> Featured Pages </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/category.html">
                                    Category </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/sub-category.html">
                                    Sub Category </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/category-list.html">
                                        Category List View </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                                        Product Details Version 1 </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details-style2.html">
                                        Product Details Version 2 </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details-style3.html">
                                        Product Details Version 3 (Custom Thumbnail Position)</a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/single-product-modal.html">
                                        Single Product Details Modal</a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/single-subscribe-modal.html">
                                        Single Subscribe Modal</a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> &nbsp; </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/cart.html">
                                    Cart </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us.html">
                                    About us </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us-2.html">
                                    About us 2 (no parallax) </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us.html">
                                    Contact us </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us-2.html">
                                    Contact us 2 (No Fixed Map) </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/terms-conditions.html">
                                        Terms &amp; Conditions </a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> Checkout </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-0.html">
                                    Checkout Before </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-1.html">
                                    checkout step 1 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-2.html">
                                    checkout step 2 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-3.html">
                                    checkout step 3 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-4.html">
                                    checkout step 4 </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/checkout-5.html">
                                    checkout step 5 </a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> User Account </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/account-1.html">
                                    Account Login </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/account.html"> My
                                    Account </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/my-address.html">
                                    My Address </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/user-information.html">
                                        User information </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/wishlist.html">
                                    Wisth list </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/order-list.html">
                                    Order list </a></li>
                                <li>
                                    <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/forgot-password.html">
                                        Forgot Password </a></li>
                            </ul>
                            <ul class="col-lg-2  col-sm-2 col-md-2 unstyled">
                                <li class="no-border">
                                    <p><strong> &nbsp; </strong></p>
                                </li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/error-page.html">
                                    Error Page </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/blank-page.html">
                                    Blank Page </a></li>
                                <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/form.html"> Basic
                                    Form Element </a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>

            <!--- this part will be hidden for mobile version -->
            <div class="nav navbar-nav navbar-right hidden-xs">
              <div class="dropdown  cartMenu cartMenu1 ">
                <a ui-sref="shop.cart.edit" class="dropdown-toggle cart111" data-toggle="dropdown" data-hover="dropdown">
                  <i class="fa fa-shopping-cart"> </i> 
                  <span class="cartRespons"> Количка ({{cart.total | number:2}}) </span>
                  <b class="caret"> </b> 
                </a>

                <div class="dropdown-menu col-lg-4 col-xs-12 col-md-4 ">
                  <div id="cart222" class="miniCartTable mCustomScrollbar" data-mcs-theme="dark" style="overflow: visible;">
                    <table>
                      <tbody>
                        <tr class="miniCartProduct" ng-repeat="item in cart.items">
                          <td style="width:20%" class="miniCartProductThumb">
                            <div><a ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})">
                                <img ng-src="{{item.product.image}}" alt="{{item.product.name}}"></a></div>
                          </td>
                          <td style="width:40%">
                            <div class="miniCartDescription">
                              <h4><a ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})"> {{item.product.name}} </a></h4>
                              <!--<span class="size"> 12 x 1.5 L </span>-->
                              <div class="price"><span> {{item.product.price | number:2}} </span><span>лв</span></div>
                            </div>
                          </td>
                          <td style="width:10%" class="miniCartQuantity"><a> X {{item.quantity}} </a></td>
                          <td style="width:15%" class="miniCartSubtotal"><span> {{item.sum | number:2}} </span><span>лв</span></td>
                          <td style="width:5%" class="delete">
                            <!-- glyphicon glyphicon-remove-sign  aria-hidden="true" -->
                            <!--<button class="btn btn-link btn-sm" type="button" style="color: red" ng-click="removeFromCart(item.product)">-->
                            <a ng-click="removeFromCart(item.id)">
                              <span class="glyphicon glyphicon-remove-circle" style="color: red"></span>
                            </a>
                            <!--</button>-->
                          </td>
                          
                          
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--/.miniCartTable-->

                  <div class="miniCartFooter text-right">
                    <h3 class="text-right subtotal"> {{cart.subTotal | number:2}} лв </h3>
                    <a class="btn btn-sm btn-danger" ui-sref="shop.cart.edit"><i class="fa fa-shopping-cart"></i> VIEW CART </a>
                    <a class="btn btn-sm btn-primary" ui-sref="shop.cart.edit"> CHECKOUT </a>
                  </div>
                  <!--/.miniCartFooter-->

                </div>
                <!--/.dropdown-menu-->
              </div>
              <!--/.cartMenu-->

              <div class="search-box">
                <div class="input-group">
                  <button class="btn btn-nobg getFullSearch" type="button"><i class="fa fa-search"> </i></button>
                </div>
                <!-- /input-group -->

              </div>
              <!--/.search-box -->
            </div>
            <!--/.navbar-nav hidden-xs-->
        </div>
        <!--/.nav-collapse -->

    </div>
    <!--/.container -->

    <div class="search-full text-right"><a class="pull-right search-close"> <i class=" fa fa-times-circle"> </i> </a>

        <div class="searchInputBox pull-right">
            <input type="search" data-searchurl="search?=" name="q" placeholder="start typing and hit enter to search"
                   class="search-input">
            <button class="btn-nobg search-btn" type="submit"><i class="fa fa-search"> </i></button>
        </div>
    </div>
    <!--/.search-full-->
</header>

<div class="view-slide-in" ui-view="banner"  autoscroll="false"></div>

<!-- Main component START -->
<div ui-view class="view-slide-in container main-container headerOffset" autoscroll="false">
</div>
<!-- Main component END -->



<!-- FOOTER -->
<hr>
    <pre>
      <!-- Here's some values to keep an eye on in the sample in order to understand $state and $stateParams -->
      $state = {{$state.current.name}}
      $stateParams = {{$stateParams}}
      $state full url = {{ $state.$current.url.source }}
      <!-- $state.$current is not a public api, we are using it to
           display the full url for learning purposes-->
      session_id = <?php echo session_id(); ?>
      
      session_name = <?php echo session_name(); ?>
      
      session_cache_expire = <?php echo session_cache_expire(); ?>
      
      logged user = {{currentUser.email}}
      
      has focus = {{hasFocus}}
    </pre>


<footer>
    <div class="footer" id="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-3  col-md-3 col-sm-4 col-xs-6">
                    <h3> Support </h3>
                    <ul>
                        <li class="supportLi">
                            <p> Lorem ipsum dolor sit amet, consectetur </p>
                            <h4><a class="inline" href="callto:+8801680531352"> <strong> <i class="fa fa-phone"> </i> 88
                                01680 531352 </strong> </a></h4>
                            <h4><a class="inline" href="mailto:help@tshopweb.com"> <i class="fa fa-envelope-o"> </i>
                                help@tshopweb.com </a></h4>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-2  col-md-2 col-sm-4 col-xs-6">
                    <h3> Shop </h3>
                    <ul>
                        <li><a href="index.html"> Home </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/category.html">
                            Category </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/sub-category.html"> Sub
                            Category </a></li>
                    </ul>
                </div>
                <div class="col-lg-2  col-md-2 col-sm-4 col-xs-6">
                    <h3> Information </h3>
                    <ul>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html">
                            Product Details </a></li>
                        <li>
                            <a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details-style2.html">
                                Product Details Version 2 </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/cart.html"> Cart </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us.html"> About
                            us </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us-2.html"> About us
                            2 </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us.html"> Contact
                            us </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us-2.html"> Contact
                            us 2 </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/terms-conditions.html">
                            Terms &amp; Conditions </a></li>
                    </ul>
                </div>
                <div class="col-lg-2  col-md-2 col-sm-4 col-xs-6">
                    <h3> My Account </h3>
                    <ul>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/account-1.html"> Account
                            Login </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/account.html"> My
                            Account </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/my-address.html"> My
                            Address </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/wishlist.html"> Wisth
                            list </a></li>
                        <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/order-list.html"> Order
                            list </a></li>
                    </ul>
                </div>
                <div class="col-lg-3  col-md-3 col-sm-6 col-xs-12 ">
                    <h3> Stay in touch </h3>
                    <ul>
                        <li>
                            <div class="input-append newsLatterBox text-center">
                                <input type="text" class="full text-center" placeholder="Email ">
                                <button class="btn  bg-gray" type="button"> Subscribe <i
                                        class="fa fa-long-arrow-right"> </i></button>
                            </div>
                        </li>
                    </ul>
                    <ul class="social">
                        <li><a href="http://facebook.com/"> <i class=" fa fa-facebook"> &nbsp; </i> </a></li>
                        <li><a href="http://twitter.com/"> <i class="fa fa-twitter"> &nbsp; </i> </a></li>
                        <li><a href="https://plus.google.com/"> <i class="fa fa-google-plus"> &nbsp; </i> </a></li>
                        <li><a href="http://youtube.com/"> <i class="fa fa-pinterest"> &nbsp; </i> </a></li>
                        <li><a href="http://youtube.com/"> <i class="fa fa-youtube"> &nbsp; </i> </a></li>
                    </ul>
                </div>
            </div>
            <!--/.row-->
        </div>
        <!--/.container-->
    </div>
    <!--/.footer-->

    <div class="footer-bottom">
        <div class="container">
            <p class="pull-left"> © TSHOP 2014. All right reserved. </p>

            <div class="pull-right paymentMethodImg"><img height="30" class="pull-right" src="images/master_card.png"
                                                          alt="img"> <img height="30" class="pull-right"
                                                                          src="images/paypal.png" alt="img"> <img height="30"
                                                                                                           class="pull-right"
                                                                                                           src="images/american_express_card.png"
                                                                                                           alt="img">
                <img height="30" class="pull-right" src="images/discover_network_card.png" alt="img"> <img height="30"
                                                                                                    class="pull-right"
                                                                                                    src="images/google_wallet.png"
                                                                                                    alt="img"></div>
        </div>
    </div>
    <!--/.footer-bottom-->
</footer>


<div class="modal fade" id="modalAds" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog  modal-bg-1">
        <div class="modal-body-content">
            <a class="close" data-dismiss="modal">×</a>

            <div class="modal-body">
                <div class="col-lg-6 col-sm-8 col-xs-8">
                    <h3>enter your <br>email to receive</h3>

                    <p class="discountLg">10% OFF </p>

                    <p>We invite you to subscribe to our newsletter and receive 10% discount.
                    </p>

                    <div class="clearfx">
                        <form id="newsletter" class="newsletter">
                            <input type="text" id="subscribe" name="s" placeholder="Enter email" autocomplete="off"
                                   style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QsPDhss3LcOZQAAAU5JREFUOMvdkzFLA0EQhd/bO7iIYmklaCUopLAQA6KNaawt9BeIgnUwLHPJRchfEBR7CyGWgiDY2SlIQBT/gDaCoGDudiy8SLwkBiwz1c7y+GZ25i0wnFEqlSZFZKGdi8iiiOR7aU32QkR2c7ncPcljAARAkgckb8IwrGf1fg/oJ8lRAHkR2VDVmOQ8AKjqY1bMHgCGYXhFchnAg6omJGcBXEZRtNoXYK2dMsaMt1qtD9/3p40x5yS9tHICYF1Vn0mOxXH8Uq/Xb389wff9PQDbQRB0t/QNOiPZ1h4B2MoO0fxnYz8dOOcOVbWhqq8kJzzPa3RAXZIkawCenHMjJN/+GiIqlcoFgKKq3pEMAMwAuCa5VK1W3SAfbAIopum+cy5KzwXn3M5AI6XVYlVt1mq1U8/zTlS1CeC9j2+6o1wuz1lrVzpWXLDWTg3pz/0CQnd2Jos49xUAAAAASUVORK5CYII=); background-attachment: scroll; background-position: 100% 50%; background-repeat: no-repeat;">
                            <button class="subscribe-btn">Subscribe</button>
                        </form>
                    </div>

                    <p><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/category.html"
                          class="link shoplink"> SHOP NOW <i class="fa fa-caret-right"> </i> </a></p>


                </div>
            </div>

        </div>
    </div>
</div>


<!-- Le javascript ================================================== -->

<!-- Placed at the end of the document so the pages load faster -->
<script type="text/javascript" src="app/bower_components/jquery/dist/jquery.js"></script>
<script type="text/javascript" src="app/bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script type="text/javascript" src="app/bower_components/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"></script>

<script type="text/javascript" >
    // this script required for subscribe modal
    $(window).load(function () {
        console.log("993 START " + "<?php echo $useremail; ?>");
        
        
        // full load
        //$('#modalAds').modal('show');
        //$('#modalAds').removeClass('hide');

        //$("#cart1").mCustomScrollbar();
    });
</script>

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
<script type="text/javascript" src="app/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"></script>

<!-- include checkRadio plugin //Custom check & Radio  -->
<script type="text/javascript" src="js/ion.checkRadio-1.1.0/js/ion.checkRadio.js"></script>

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

<!-- LOKI -->
<script type="text/javascript" src="js/lokijs.js"></script>
<script type="text/javascript" src="js/jquerySyncToMySqlAdapter.js"></script>


<!-- APP -->
<script type="text/javascript" src="app/app.js"></script>
<script type="text/javascript" src="app/shop/shop.js"></script>
<script type="text/javascript" src="app/shop/cart.js"></script>
<script type="text/javascript" src="app/shop/shop-service.js"></script>
<script type="text/javascript" src="app/common/color-service.js"></script>
<script type="text/javascript" src="common/utils/utils-service.js"></script>
<script type="text/javascript" src="common/auth/authentication.js"></script>

<!-- include touchspin.js // touch friendly input spinner component   -->
<script type="text/javascript" src="js/touchspin/src/jquery.bootstrap-touchspin-mine.js"></script>

<!-- include custom script for only homepage  -->
<script type="text/javascript" src="js/home.js"></script>

<!-- include custom script for site  -->
<script type="text/javascript" src="js/script.js"></script>

<div login-dialog ng-if="!isLoginPage"></div>
</body>
</html>
