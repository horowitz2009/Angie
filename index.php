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
<link rel="apple-touch-icon" href="images/favicon72.png">
<link rel="apple-touch-icon" sizes="72x72" href="images/favicon72.png">
<link rel="apple-touch-icon" sizes="144x144" href="images/favicon144.png">

<link rel="shortcut icon" href="images/favicon.png">


<!-- could easily use a custom property of the state here instead of 'name' -->
<!--<title ng-bind="'jeff'+$state.current.breadcrumbs[0].displayName">.::Felt::.</title>-->
<title update-title prefix='ФЕЛТ - '></title>


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

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>


  <!-- Modal Reset Password -->
  <div class="modal signUpContent fade" id="ModalResetPassword" tabindex="-1" role="dialog">
    <div class="modal-dialog ">
      <div class="modal-content">

        <iframe src="sink.html" name="sink" style="display: none"></iframe>

        <form name="loginForm" action="sink.html" target="sink" method="post" ng-controller="LoginController"
          ng-submit="resetPassword(credentials)" novalidate form-autofill-fix>
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 class="modal-title-site text-center">Забравена парола</h3>
          </div>
          <div class="modal-body">
            <div class="control-group">
              <div style="min-height: 25px; padding-bottom: 0px;">
                <span ng-cloak>{{result}}</span>
                <!-- <a ng-if="success" data-toggle="modal" data-target="#ModalLogin"> <span
                    class="">Вход</span> 
                </a>-->
              </div>
              <div ng-show="success" style="padding-top: 15px; padding-bottom: 15px;">
                <small>Затворете този прозорец и опитайте пак с 'ВХОД' като въведете новата си парола. След като влезете, ще можете да смените паролата с такава по ваш избор.</small><br>
                <small>Не сте получили писмо? Проверете дали правилно сте написали имейла и натиснете 'Изпрати пак'.</small>
              </div>
            </div>
            <div class="form-group login-username">
              <div>
                <input name="email" id="email" ng-model="credentials.email" class="form-control input" size="20"
                  placeholder="Имейл  адрес" type="text" 
                  ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }" required>
              </div>
            </div>
            <div>
              <div>
                <input class="btn btn-block btn-lg btn-primary"  type="submit" ng-value="send"
                       ng-disabled="loginForm.$invalid"><!-- value="Изпрати" -->
                       
              </div>
            </div>
            <!--userForm-->

          </div>
          <div class="modal-footer">
            <p class="text-center">
            </p>
          </div>
        </form>
      </div>
      <!-- /.modal-content -->

    </div>
    <!-- /.modal-dialog -->

  </div>
  <!-- /.Modal Login -->

  <!-- Modal Login start -->
  <div class="modal signUpContent fade" id="ModalLogin" tabindex="-1" role="dialog">
    <div class="modal-dialog ">
      <div class="modal-content">

        <iframe src="sink.html" name="sink" style="display: none"></iframe>

        <form name="loginForm" action="sink.html" target="sink" method="post" ng-controller="LoginController"
          ng-submit="login(credentials)" novalidate form-autofill-fix>
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 class="modal-title-site text-center">Въведете имейл и парола</h3>
          </div>
          <div class="modal-body">
            <div class="control-group">
              <div style="height: 25px;">
                <span ng-cloak>{{result}}</span>
              </div>
            </div>
            <div class="form-group login-username">
              <div>
                <input name="email" id="email" ng-model="credentials.email" class="form-control input" size="20"
                  placeholder="Имейл  адрес" type="text" required>
              </div>
            </div>
            <div class="form-group login-password">
              <div>
                <input name="password" id="password" ng-model="credentials.password" class="form-control input"
                  size="20" placeholder="Парола" type="password" required>
              </div>
            </div>
            <div class="form-group">
              <div>
                <div class="checkbox login-rememberme">
                  <label style="margin-left: 4px;"> <input name="rememberme" type="checkbox" id="rememberme_checkbox" class="rememberme"
                    ng-model="credentials.rememberme"> Запомни ме
                  </label>
                </div>
              </div>
            </div>
            <div>
              <div>
                <input name="submit" class="btn btn-block btn-lg btn-primary" value="Вход" type="submit"
                       ng-disabled="loginForm.$invalid">

              </div>
            </div>
            <!--userForm-->

          </div>
          <div class="modal-footer">
            <p class="text-center">
              Нямате акаунт? <a data-toggle="modal" data-dismiss="modal" href="#ModalSignup"> Създайте акаунт. </a> <br>
              <a data-toggle="modal" data-dismiss="modal" href="#ModalResetPassword"> Забравена парола? </a>
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

        <iframe src="sink.html" name="sink" style="display: none"></iframe>

        <form name="loginForm" action="sink.html" target="sink" method="post" ng-controller="RegisterController"
          ng-submit="register(newUser)" novalidate form-autofill-fix>
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 class="modal-title-site text-center">Регистрация</h3>
          </div>
          <div class="modal-body">
            <div class="control-group">
              <div style="height: 25px;">
                <span ng-cloak>{{result}}</span>
              </div>
            </div>

            <div class="form-group reg-email" ng-class="{ 'has-error' : loginForm.email.$invalid && !loginForm.email.$pristine }">
              <div>
                <input name="email" class="form-control input" size="20" ng-model="newUser.email"
                  ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1000, 'blur': 0} }"
                  placeholder="Имейл  адрес" type="email" required>
                  <div role="alert" class="help-block" style="color: #a94442;"
                       ng-show="loginForm.email.$error.email && !loginForm.email.$pristine">
                    Въведете валиден имейл</div>  
                  </div>
            </div>
            <div class="form-group reg-password">
              <div>
                <input name="password" class="form-control input" size="20" ng-model="newUser.password" pw-check="newUser.password2"
                  ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }"
                  placeholder="Парола" type="password" required>
              </div>
            </div>
            <div class="form-group reg-password">
              <div>
                <input name="password2" class="form-control input" size="20" ng-model="newUser.password2"
                  ng-model-options="{ updateOn: 'default blur', debounce: {'default': 300, 'blur': 0} }"
                  placeholder="Парола отново" type="password" required>
                <p class="help-block" style="color: #a94442;"
                    ng-show="loginForm.password.$error.pwmatch && !loginForm.password2.$pristine && !loginForm.password.$pristine">
                    Паролите не съвпадат!</p>  
                  
              </div>
            </div>
            <div>
              <div>
                <input name="submit" class="btn  btn-block btn-lg btn-primary" value="Регистрирай" type="submit"
                       ng-disabled="loginForm.$invalid">
              </div>
            </div>
            <!--userForm-->

          </div>
          <div class="modal-footer">
            <p class="text-center">
              Имате акаунт? <a data-toggle="modal" data-dismiss="modal" href="#ModalLogin"> Влезте от тук </a>
            </p>
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
  <header class="navbar navbar-tshop navbar-fixed-top megamenu" style="margin-bottom: 0px">
    <div class="navbar-top">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">
            <div class="pull-left ">
              <ul class="userMenu ">
                <!-- 
                <li><a ng-click="setLanguage('bg')"><span>BG</span></a></li>
                <li><a ng-click="setLanguage('en')"><span>EN</span></a></li>
                <li><a ng-click="setLanguage('ro')"><span>RO</span></a></li>
                <li><a ng-click="setLanguage('gr')"><span>GR</span></a></li>
                <li><a ng-click="setLanguage('mk')"><span>MK</span></a></li>
                -->
                <!-- <li><span>{{'ONLY_IN_BG'|translate}}</span></li>-->
                <li class="phone-number">
                  <a href="callto:+359899198669"> <span> <i
                      class="glyphicon glyphicon-phone-alt "></i></span> <span class="hidden-xs"
                    style="margin-left: 5px"> 089 919 86 69 </span>
                  </a>
                   
                <span ui-view="hint" class="navbar-text navbar-right"></span></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6 no-margin no-padding">
            <div class="pull-right">
              <ul id="userMenu" class="userMenu hide">
                <!-- logged -->
                <li ng-if="getUsername() !== 'guest'"><a href="#"> <span class="hidden-xs"
                    style="text-transform: none; font-size: 14px; line-height: 28px;" ng-bind="getUsername()"> ... </span></a>
                </li>

                <li ng-if="isAdmin" ng-cloak><a ui-sref="backend.summary"><span class="hidden-xs"> Админ Панел</span> <i
                    class="glyphicon glyphicon-briefcase hide visible-xs "></i> </a></li>

                <li ng-if="getUsername() !== 'guest'" ng-cloak><a ui-sref="account.summary"><span class="hidden-xs"> Моят акаунт</span> <i
                    class="glyphicon glyphicon-user hide visible-xs "></i> </a></li>

                <li ng-if="getUsername() !== 'guest'" ng-cloak><a ng-click="logout(false)"> <span class="hidden-xs">Изход</span> <i
                    class="glyphicon glyphicon-log-out hide visible-xs "></i>
                </a></li>

                <!-- not logged -->
                <li ng-if="getUsername() == 'guest'" ng-cloak><a data-toggle="modal" data-target="#ModalLogin"> <span
                    class="hidden-xs">Вход</span> <i class="glyphicon glyphicon-log-in hide visible-xs "></i>
                </a></li>

                <li ng-if="getUsername() == 'guest'" ng-cloak class="hidden-xs"><a href="#" data-toggle="modal"
                  data-target="#ModalSignup"> Регистрирайте акаунт </a></li>
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
          <span class="sr-only"> Toggle navigation </span> <span class="icon-bar"> </span> <span class="icon-bar"> </span>
          <span class="icon-bar"> </span>
        </button>
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-cart">
          <i class="fa fa-shopping-cart colorWhite"> </i> <span class="cartRespons colorWhite ng-cloak"> Количка ({{cart.subTotal | number:2}} лв) </span>
        </button>

        <!-- BRAND -->
        <a class="navbar-brand " ui-sref="home"> <img src="images/logo45.png" alt="ФЕЛТ">
        </a>

        <!-- this part for mobile -->
        <!-- 
        <div class="search-box pull-right hidden-lg hidden-md hidden-sm">
          <div class="input-group">
            <button class="btn btn-nobg getFullSearch" type="button">
              <i class="fa fa-search"> </i>
            </button>
          </div>
        </div>
        -->
      </div>

      <!-- CART MOBILE: this part is duplicate from cartMenu. Keep it for mobile -->
      <div class="navbar-cart collapse" id="mobileCart">
        <div class="cartMenu col-lg-5 col-md-6 col-sm-6 col-xs-12">
          <div id="cart1" class="miniCartTable mCustomScrollbar" data-mcs-theme="dark" style="overflow: visible;">
            <table>
              <tbody>
                <tr class="miniCartProduct" ng-repeat="item in cart.items">
                  <td width="20%" class="miniCartProductThumb">
                    <div>
                      <a ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})">
                        <img ng-src="{{item.product.image}}" alt="{{item.product.name}}">
                      </a>
                    </div>
                  </td>
                  <td width="40%">
                    <div class="miniCartDescription">
                      <h4>
                        <a ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})">
                          {{item.product.name}} 
                        </a>
                      </h4>
                      <div class="price">
                        <span> {{item.product.price | number:2}} </span><span>лв</span>
                      </div>
                    </div>
                  </td>
                  <td width="10%" class="miniCartQuantity"><a> X {{item.quantity}} </a></td>
                  <td width="15%" class="miniCartSubtotal"><span> {{item.sum | number:2}} </span><span>лв</span></td>
                  <td width="5%" class="delete">
                    <!-- glyphicon glyphicon-remove-sign  aria-hidden="true" --> <!--<button class="btn btn-link btn-sm" type="button" style="color: red" ng-click="removeFromCart(item.product)">-->
                    <a ng-click="removeFromCart(item.id)"> <span class="glyphicon glyphicon-remove-circle do-not-close"
                       style="color: red"></span>
                    </a> <!--</button>-->
                  </td>
                </tr>
              </tbody>
            </table>


          </div>
          <!--/.miniCartTable-->

          <div class="miniCartFooter  miniCartFooterInMobile text-right">
            <h3 class="text-right subtotal">{{cart.subTotal | number:2}} лв</h3>
            <a class="btn btn-sm btn-info" ui-sref="shop.cart.edit"><i class="fa fa-shopping-cart"></i> Подробно </a>
            <a class="btn btn-sm btn-inverse" ui-sref="shop.cart.checkout"> Поръчай </a>
          </div>
          <!--/.miniCartFooter-->

        </div>
        <!--/.cartMenu-->
      </div>
      <!--/.navbar-cart-->

      <!-- NAV elements -->
      <div class="navbar-collapse collapse" id="mobileNav">
        <ul class="nav navbar-nav">
          <!-- НАЧАЛО --> 
          <li ui-sref-active="active"><a ui-sref="home"> Начало </a></li>

          <!-- ПРОДУКТИ -->
          <li id="myDropdown" class="dropdown megamenu-fullwidth">
            <!-- <li ng-class="{active: $state.includes('shop')}"><a ui-sref="shop.categories.all">Продукти</a></li> -->
            <a class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" ui-sref="shop.all"> Продукти <b
              class="caret"> </b>
            </a>
            <ul class="dropdown-menu">
              <li class="megamenu-content ">
                <ul class="col-lg-3  col-sm-3 col-md-3 col-xs-12 unstyled noMarginLeft newCollectionUl">
                  <li class="no-border">
                    <p class="promo-1">
                      <strong> КАТЕГОРИИ </strong>
                    </p>
                  </li>
                  <li ng-repeat="menuitem in catMenuItems">
                    <a tabindex="-1" ui-sref="shop.one({ categoryId: menuitem.id })" style="text-transform: uppercase"> {{menuitem.name}}
                    </a>
                  </li>
                </ul>
                <ul class="col-lg-3  col-sm-3 col-md-3 hidden-xs">
                  <li><a class="newProductMenuBlock"
                    ui-sref="shop.one.product({categoryId:'wool',productId:'english-wool-red'})">
                    <img class="img-responsive" src="images/e_red.jpg" alt="product"> <span class="ProductMenuCaption"> <i
                        class="fa fa-caret-right"> </i> Червена вълна
                    </span>
                  </a></li>
                </ul>
                <ul class="col-lg-3  col-sm-3 col-md-3 hidden-xs">
                  <li><a class="newProductMenuBlock"
                    ui-sref="shop.one.product({categoryId:'silk',productId:'white'})"> <img
                      class="img-responsive" src="images/swhite.jpg" alt="product"> <span
                      class="ProductMenuCaption"> <i class="fa fa-caret-right"> </i> Бяла коприна
                    </span>
                  </a></li>
                </ul>
                <ul class="col-lg-3  col-sm-3 col-md-3 hidden-xs">
                  <li><a class="newProductMenuBlock"
                    ui-sref="shop.one.product({categoryId:'needles',productId:'en36'})"> <img
                      class="img-responsive" src="images/needle32.jpg" alt="product"> <span class="ProductMenuCaption"> <i
                        class="fa fa-caret-right"> </i> Игла #36
                    </span>
                  </a></li>
                </ul>
              </li>
            </ul>
          </li>

        </ul>

        <!--- this part will be hidden for mobile version -->
        <div class="nav navbar-nav navbar-right hidden-xs">
          <div id="desktopCart" class="dropdown  cartMenu cartMenu1 " ng-cloak>
            <a ui-sref="shop.cart.edit" class="dropdown-toggle cart111" data-toggle="dropdown" data-hover="dropdown"> <i
              class="fa fa-shopping-cart"> </i> <span class="cartRespons" 
              style="font-size: 16px; font-weight: normal; text-transform: none;"> Количка ({{cart.subTotal | number:2}} <small>лв</small>) </span>
              <b class="caret"> </b>
            </a>

            <div class="dropdown-menu col-lg-6 col-md-6 col-sm-7 col-xs-12">
              <div id="cart222" class="miniCartTable mCustomScrollbar" data-mcs-theme="dark" style="overflow: visible;">
                <table>
                  <tbody>
                    <tr class="miniCartProduct" ng-repeat="item in cart.items">
                      <td style="width: 20%" class="miniCartProductThumb">
                        <div>
                          <a
                            ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})">
                            <img ng-src="{{item.product.image}}" alt="{{item.product.name}}">
                          </a>
                        </div>
                      </td>
                      <td style="width: 40%">
                        <div class="miniCartDescription">
                          <h4>
                            <a ui-sref="shop.one.product({categoryId: item.product.categoryId, productId:item.product.id})">
                              {{item.product.name}} 
                            </a>
                          </h4>
                          <!--<span class="size"> 12 x 1.5 L </span>-->
                          <div class="price">
                            <span> {{item.product.price | number:2}} </span><span>лв</span>
                          </div>
                        </div>
                      </td>
                      <td style="width: 10%" class="miniCartQuantity"><a> X {{item.quantity}} </a></td>
                      <td style="width: 15%" class="miniCartSubtotal"><span> {{item.sum | number:2}} </span><span>лв</span></td>
                      <td style="width: 5%" class="delete">
                        <!-- glyphicon glyphicon-remove-sign  aria-hidden="true" --> <!--<button class="btn btn-link btn-sm" type="button" style="color: red" ng-click="removeFromCart(item.product)">-->
                        <a ng-click="removeFromCart(item.id)"> <span class="glyphicon glyphicon-remove-circle do-not-close"
                          style="color: red"></span>
                      </a> <!--</button>-->
                      </td>


                    </tr>
                  </tbody>
                </table>
              </div>
              <!--/.miniCartTable-->

              <div class="miniCartFooter text-right">
                <h3 class="text-right subtotal">{{cart.subTotal | number:2}} лв</h3>
                <a class="btn btn-sm btn-info" ui-sref="shop.cart.edit"><i class="fa fa-shopping-cart"></i> Подробно </a>
                <a class="btn btn-sm btn-inverse" ui-sref="shop.cart.checkout"> Поръчай </a>
              </div>
              <!--/.miniCartFooter-->

            </div>
            <!--/.dropdown-menu-->
          </div>
          <!--/.cartMenu-->

          <div class="search-box hidden">
            <div class="input-group">
              <button class="btn btn-nobg getFullSearch" type="button">
                <i class="fa fa-search"> </i>
              </button>
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

    <div class="search-full text-right">
      <a class="pull-right search-close"> <i class=" fa fa-times-circle"> </i>
      </a>

      <div class="searchInputBox pull-right">
        <input type="search" data-searchurl="search?=" name="q" placeholder="start typing and hit enter to search"
          class="search-input">
        <button class="btn-nobg search-btn" type="submit">
          <i class="fa fa-search"> </i>
        </button>
      </div>
    </div>
    <!--/.search-full-->
  </header>

  <div class="view-slide-in" ui-view="banner" autoscroll="false"></div>

  <!-- Main component START -->
  <div id="mainContainer" ui-view class="view-slide-in container main-container headerOffset" autoscroll="false"></div>
  <!-- Main component END -->



  <!-- FOOTER -->
  <hr>
  <pre ng-show="isDebug" class="ng-cloak">
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
  
  <div ng-show="isDebug" ng-repeat = "st in states" ng-cloak>
    state: {{st.name}}&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{{st.url}}
  </div>

  <footer class="hidden-print" ng-cloak>
    <div class="footer" id="footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-4 col-xs-6">
            <h3>Свържете се нас</h3>
            <ul>
              <li class="supportLi">
                <p>В работни дни от 10:00 до 19:00</p>
                <h4>
                  <a class="inline" href="callto:+359899198669"> <strong> <i class="fa fa-phone"> </i> 089 919 86 69
                  </strong>
                  </a>
                </h4>
                <h4>
                  <a class="inline" href="mailto:contact@felt-bg.com"> <i class="fa fa-envelope-o"> </i> contact@felt-bg.com
                  </a>
                </h4>
              </li>
            </ul>
          </div>
          <div class="col-sm-4 col-xs-6">
            <h3>Продукти</h3>
            <ul>
              <li><a ui-sref="home"> Начало </a></li>
              <li><a ui-sref="shop.all"> Категории </a></li>
              <li ng-repeat="menuitem in catMenuItems">
                <a ui-sref="shop.one({ categoryId: menuitem.id })"> {{menuitem.name}} </a>
              </li>
            </ul>
          </div>
          
          <div class="clearfix visible-xs-block"></div>
          
          <div class="col-sm-4 col-xs-6 hidden">
            <h3>Информация</h3>
            <ul>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details.html"> Условия на доставка</a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/product-details-style2.html"> Product
                  Details Version 2 </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/cart.html"> Cart </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us.html"> About us </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/about-us-2.html"> About us 2 </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us.html"> Contact us </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/contact-us-2.html"> Contact us 2 </a></li>
              <li><a href="http://codepeoples.com/tanimdesign.net/thsop-v-1.3/gray/terms-conditions.html"> Terms &amp;
                  Conditions </a></li>
            </ul>
          </div>
          
          <div class="col-sm-4 col-xs-6">
            <h3>Моят акаунт</h3>
            <ul>
            
              <li ng-if="getUsername() == 'guest'" ng-cloak><a data-toggle="modal" data-target="#ModalLogin">Вход</a></li>
              
              <li ng-if="getUsername() !== 'guest'" ng-cloak><a ui-sref="account.summary">Моят акаунт</a></li>
              <li ng-if="getUsername() !== 'guest'" ng-cloak><a ui-sref="account.man.edit">Редактирай акаунт</a></li>
              <li ng-if="getUsername() !== 'guest'" ng-cloak><a ui-sref="account.summary.orders">Моите поръчки</a></li>
              
              <li ng-if="getUsername() == 'guest'" ng-cloak><a href="#" data-toggle="modal"
                  data-target="#ModalSignup"> Регистрирайте акаунт </a></li>
              
              <li ng-if="getUsername() !== 'guest'" ng-cloak><a ng-click="logout(false)"> Изход </a></li>
              
            </ul>
          </div>
          
          <!--  UNUSED SECTION -->
          <!-- 
          <div class="col-lg-3  col-md-3 col-sm-8 col-xs-12 hidden">
            <h3>Stay in touch</h3>
            <ul>
              <li>
                <div class="input-append newsLatterBox text-center">
                  <input type="text" class="full text-center" placeholder="Email ">
                  <button class="btn  bg-gray" type="button">
                    Subscribe <i class="fa fa-long-arrow-right"> </i>
                  </button>
                </div>
              </li>
            </ul>
            <ul class="social">
              <li><a href="http://facebook.com/"> <i class=" fa fa-facebook"> &nbsp; </i>
              </a></li>
              <li><a href="http://twitter.com/"> <i class="fa fa-twitter"> &nbsp; </i>
              </a></li>
              <li><a href="https://plus.google.com/"> <i class="fa fa-google-plus"> &nbsp; </i>
              </a></li>
              <li><a href="http://youtube.com/"> <i class="fa fa-pinterest"> &nbsp; </i>
              </a></li>
              <li><a href="http://youtube.com/"> <i class="fa fa-youtube"> &nbsp; </i>
              </a></li>
            </ul>
          </div>-->
          <!-- end of UNUSED SECTION -->
        </div>
        <!--/.row-->
      </div>
      <!--/.container-->
    </div>
    <!--/.footer-->

    <div class="footer-bottom">
      <div class="container">
        <p class="pull-left">© ФЕЛТ 2015. Всички права запазени.</p>

        <div class="pull-right paymentMethodImg hidden">
          <img height="30" class="pull-right" src="images/master_card.png" alt="img"> <img height="30"
            class="pull-right" src="images/paypal.png" alt="img"> <img height="30" class="pull-right"
            src="images/american_express_card.png" alt="img"> <img height="30" class="pull-right"
            src="images/discover_network_card.png" alt="img"> <img height="30" class="pull-right"
            src="images/google_wallet.png" alt="img">
        </div>
      </div>
    </div>
    <!--/.footer-bottom-->
  </footer>

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
  <script type="text/javascript" src="app/app.js"></script>
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
  <script type="text/javascript" src="app/shop/orders.js"></script>
  <script type="text/javascript" src="app/shipping/shipping-service.js"></script>
  <script type="text/javascript" src="app/shipping/shipping-factory.js"></script>
  <script type="text/javascript" src="app/common/color-service.js"></script>
  <script type="text/javascript" src="common/utils/utils-service.js"></script>

  <!-- include touchspin.js // touch friendly input spinner component   -->
  <script type="text/javascript" src="js/touchspin/src/jquery.bootstrap-touchspin-mine.js"></script>

  <!-- include custom script for only homepage  -->
  <script type="text/javascript" src="js/home.js"></script>

  <!-- include custom script for site  -->
  <script type="text/javascript" src="js/script.js"></script>

  <div login-dialog ng-if="!isLoginPage"></div>
</body>
</html>
