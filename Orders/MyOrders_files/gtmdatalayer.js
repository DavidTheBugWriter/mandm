//Google Tag Manager Data Layer
function gtmDataLayer() {
    analyticsEvent = function () {};
    analyticsSocial = function () {};
    analyticsVPV = function () {};
    analyticsClearVPV = function () {};
    analyticsForm = function () {};
    window.dataLayer = window.dataLayer || [];

    // STANDARD DATALAYER
    // Go through each product and find the relevant information and pass to GTM Datalayer.

    var products = trackingData.getProducts(),
        allProductInfo = [],
        fhhdn = $("#FHTotal"),
        fhtotal = 0;
    var fhBnrTop = $("#FHCampaignBannerTop"),
        fhBnrBtm = $("#FHCampaignBannerBottom");
    var ftsTerm = getFtsTerm();

    //For purpose of AWIN Order Confirmation tracking
    var getCustomerType = function () {
        if (trackingData.getUserType() === "MyAccount") {
            return "EXISTING";
        }
        return "NEW";
    }
    var customerType = getCustomerType();

    // Go through each product and find the relevant information and pass to GTM Datalayer.
    $.each(products,
        function () {
            allProductInfo.push({
                'sku': this.Product.Sku + "/" + this.Product.Colour,
                'name': this.Product.SeoName,
                'category': this.Product.Category,
                'price': this.Product.UnitPrice,
                'quantity': this.Quantity,
                'id': this.Id,
                'customerType': customerType
            });
        });

    if (typeof (fhhdn) !== "undefined") {
        fhtotal = $(fhhdn).val();
    }

    dataLayer.push({
        'userId': trackingData.getCustomer().Guid,
        'pageType': trackingData.getPage().Category,
        'transactionId': trackingData.getOrderId().replace('W', ''),
        'transactionTotal': trackingData.getOrderGoodsTotalExcVat(),
        'transactionProducts': allProductInfo,
        'fhTotal': fhtotal,
        'fhBannerTopCampaignId': fhBnrTop.val() || "",
        'isLoggedIn': trackingData.getUserType() === "MyAccount",
        'fhBannerBottomCampaignId': fhBnrBtm.val() || "",
        'ftsTerm': ftsTerm
    });

    // CLICK POSITIONING IN ARRAYS
    // Used to determine position of clicked elements for GTM tags

    if (trackingData.getPage().Category === "Home") {
        $("#marketingPage img").on("click", function () {
            var homepageIndex = $("#marketingPage img").index(this) + 1;
            dataLayer.push({
                'event': "homepagePosition",
                'homepagePosition': homepageIndex
            });
        });
        // Dynamic Remarketing Homepage
        dataLayer.push({
            'ecomm_pagetype': "home"
        });
    }

    // ENHANCED ECOMMERCE DATALAYER
    if (trackingData.getPage().Category === "ProductList" || trackingData.getPage().Category === "ProductSearch" && window.location.href.indexOf("/02/fts/?search=failedsearch") <= 0) {
        // Product Impression dataLayer
        //used to track posistion across pages 
        var getProductImpressions = trackingData.getProductsFromLister();
        var currentPage = $('.pageNumbers').html().match(/\d+/) - 1;
        var itemsPp = $("option.showXProducts:selected").val().slice(-2);

        var productImpressions = [];
        $.each(getProductImpressions,
            function (i) {
                productImpressions.push({
                    'name': this.Name,
                    'id': this.Id.toUpperCase(),
                    'price': this.Price,
                    'brand': this.Brand.toLowerCase(),
                    'category': this.Category + "/" + this.SubCategory,
                    'position': i + 1 + (currentPage * itemsPp),
                    'list': document.location.href
                });
            });
        //Split product list array into manageable chunks of 24 if too big
        var productImpressionsArray = [];
        var productImpressionsPart1 = productImpressions.splice(0, 24);
        productImpressionsArray.push(productImpressionsPart1);
        if (productImpressions.length > 24) {
            var productImpressionsPart2 = productImpressions.splice(0, 24);
            productImpressionsArray.push(productImpressionsPart2);
        }
        if (productImpressions.length > 24) {
            var productImpressionsPart3 = productImpressions.splice(0, 24);
            productImpressionsArray.push(productImpressionsPart3);
        }
        if (productImpressions.length > 0) {
            var productImpressionsPart4 = productImpressions;
            productImpressionsArray.push(productImpressionsPart4);
        }
        for (var i = 0; i < productImpressionsArray.length; i++) {
            dataLayer.push({
                'event': "Impressions",
                'ecommerce': {
                    'currencyCode': trackingData.getCurrency(),
                    'impressions': productImpressionsArray[i]
                }
            });
        }

        // Product Click dataLayer

        $(".itemimage").on("click", function () {
            var hiddenProductInfo = $(this).siblings(".hiddenProductInfo");
            var clickedProductName = hiddenProductInfo.children(".hpName").text();
            var clickedProductId = hiddenProductInfo.children(".hpCode").text();
            var clickedProductPrice = hiddenProductInfo.children(".hpPrice").text();
            var clickedProductBrand = hiddenProductInfo.children(".hpBrand").text().toLowerCase();
            var clickedProductCat = hiddenProductInfo.children(".hpCat").text();
            var clickedProductSubCat = hiddenProductInfo.children(".hpSubCat").text();
            var clickedProductPosition = $(this.parentNode).prevAll().length + 1;
            dataLayer.push({
                'event': "productClick",
                'ecommerce': {
                    'click': {
                        'actionField': {
                            'list': document.location.href
                        },
                        'products': [{
                            'name': clickedProductName,
                            'id': clickedProductId.toUpperCase(),
                            'price': clickedProductPrice,
                            'brand': clickedProductBrand,
                            'category': clickedProductCat + "/" + clickedProductSubCat,
                            'position': clickedProductPosition + (currentPage * itemsPp)
                        }]
                    }
                }
            });
        });

        // Add to basket PLP dataLayer
        $(".buyButton").on("click", function () {
            var productadded = $(this).parents(".item-details").siblings(".hiddenProductInfo");
            var addedProducts = [];
            var addedProductName = productadded.children(".hpName").text();
            var addedProductId = productadded.children(".hpCode").text();
            var addedProductPrice = productadded.children(".hpPrice").text();
            var addedProductBrand = productadded.children(".hpBrand").text().toLowerCase();
            var addedProductCat = productadded.children(".hpCat").text();
            var addedProductSubCat = productadded.children(".hpSubCat").text();
            var addedProductPosition = $(this).parents(".plitem").prevAll().length + 1;
            var currentPage = $('.pageNumbers').html().match(/\d+/) - 1;
            var itemsPp = $("option.showXProducts:selected").val().slice(-2);

            addedProducts.push({
                'name': addedProductName,
                'id': addedProductId.toUpperCase(),
                'price': addedProductPrice,
                'brand': addedProductBrand,
                'category': addedProductCat + "/" + addedProductSubCat,
                'quantity': 1,
                'position': addedProductPosition + (currentPage * itemsPp)
            });
            addedProducts.length = 1;
            $(document).ajaxComplete(function (event, request, settings) {
                if (/\/SiteBasket\/add/.test(settings.url)) {
                    dataLayer.push({
                        'event': "addToBasketPLP",
                        'ecommerce': {
                            'currencyCode': trackingData.getCurrency(),
                            'add': {
                                'actionField': {
                                    'list': document.location.href
                                },
                                'products': addedProducts
                            }
                        }
                    });
                }
            });
        });

    }
    // Get Product Details dataLayer
    if (trackingData.getPage().Category === "ProductDetails") {
        var getProductDetails = trackingData.getProductsFromDetails();
        var productDetails = [];
        //Get data for displayed Fred Recommendations

        $.each(getProductDetails, function () {
            productDetails.push({
                'name': this.Name,
                'id': this.Id.toUpperCase(),
                'price': this.Price,
                'brand': this.Brand.toLowerCase(),
                'category': this.Category + "/" + this.SubCategory
            });
        });

        dataLayer.push({
            'event': "productDetailView",
            'ecommerce': {
                'detail': {
                    'products': productDetails
                }
            },
            // Dynamic Remarketing PDP
            'ecomm_pagetype': "product",
            'ecomm_prodid': trackingData.getProductsFromDetails()[0].Id.toUpperCase()
        });
    }
    // Product List
    if (trackingData.getPage().Category === "ProductList") {
        // Dynamic Remarketing Category Page
        var getcategoryProducts = trackingData.getProductsFromLister();
        var categoryProductId = [];
        $.each(getcategoryProducts, function () {
            categoryProductId.push(this.Id.toUpperCase());
        });
        dataLayer.push({
            'ecomm_pagetype': "category",
            'ecomm_prodid': categoryProductId.slice(0, 3)
        });
    }
    // Product Search
    if (trackingData.getPage().Category === "ProductSearch" && window.location.href.indexOf("/02/fts/?search=failedsearch") <= 0) {
        // Dynamic Remarketing Search Results
        var searchedProducts = trackingData.getProductsFromLister();
        var searchedProductId = [];
        $.each(searchedProducts, function () {
            searchedProductId.push(this.Id.toUpperCase());
        });
        dataLayer.push({
            'ecomm_pagetype': "searchresults",
            'ecomm_prodid': searchedProductId.slice(0, 3)
        });
    }
    // Add to basket PDP dataLayer
    if (trackingData.getPage().Category === "ProductDetails") {
        $(".buyButton").on("click", function () {
            $(document).ajaxComplete(function (event, request, settings) {
                if (/\/SiteBasket\/add/.test(settings.url)) {
                    dataLayer.push({
                        'event': "addToBasketPDP",
                        'ecommerce': {
                            'currencyCode': trackingData.getCurrency(),
                            'add': {
                                'products': [{
                                    'name': trackingData.getProductsFromDetails()[0].Name,
                                    'id': trackingData.getProductsFromDetails()[0].Id.toUpperCase(),
                                    'price': trackingData.getProductsFromDetails()[0].Price,
                                    'brand': trackingData.getProductsFromDetails()[0].Brand.toLowerCase(),
                                    'category': trackingData.getProductsFromDetails()[0].Category + "/" + trackingData.getProductsFromDetails()[0].SubCategory,
                                    'quantity': 1
                                }]
                            }
                        }
                    });
                }
            });
        });
    }
    // Fred campaign impressions
    if (trackingData.getPage().Category === "ProductList" || trackingData.getPage().Category === "ProductSearch" || trackingData.getPage().Category === "ProductDetails") {
        var campaignBanner = $("div.fhCampaignBanner");

        if (campaignBanner.length) {
            var fredCampaignBanner = [];
            var promoImpPosition = "";

            if (trackingData.getPage().Category === "ProductDetails") {
                promoImpPosition = "PDPBanner";
            } else if ($(campaignBanner).attr("id") === "FHBannerBottom") {
                promoImpPosition = "lowerPLPBanner";
            } else {
                promoImpPosition = "upperPLPBanner";
            }

            fredCampaignBanner.push({
                name: $(campaignBanner).attr("data-campaignid"),
                position: promoImpPosition
            });

            if (promoImpPosition !== "lowerPLPBanner") {
                dataLayer.push({
                    'event': "promotionImpression",
                    'ecommerce': {
                        'promoView': {
                            'promotions': fredCampaignBanner
                        }
                    }
                });
            }
        }

        // Contentsquare artificial pageview
        $(".buyButton").on("click", function () {
            var productCode = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
            var sizeControl = $('#s' + productCode + '.sizeSelect li.selected');
            if (sizeControl.length !== 0) {
                dataLayer.push({
                    'event': "csAddToBasket"
                });
            }
        });
    }
    // Fred campaign clicks dataLayer
    $(".fhCampaignBanner a").on("click", function () {
        var id = $(this).parents(".fhCampaignBanner").attr("data-campaignid");
        var position = "";
        var getId = $(this).parents(".fhCampaignBanner").attr("id");

        switch (getId) {
            case "FHBannerBottom":
                position = "lowerPLPBanner";
                break;
            case "FHPDPBannerBottom":
                position = "PDPBanner";
                break;
            default:
                position = "upperPLPBanner";
                break;
        }

        dataLayer.push({
            'event': "promotionClick",
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        name: id,
                        position: position
                    }]
                }
            }
        });
    });
    //View Basket dataLayer
    if (trackingData.getPage().Category === "ViewBasket") {
        var basketProducts = trackingData.getProducts();
        // Dynamic Remarketing Carted
        var basketProductId = [];
        $.each(basketProducts, function () {
            basketProductId.push(this.Product.Id.toUpperCase());
        });
        dataLayer.push({
            'ecomm_pagetype': "cart",
            'ecomm_prodid': basketProductId

        });
    }
    // Checkout dataLayer
    if (trackingData.getPage().Category === "Checkout") {
        var checkoutProducts = trackingData.getProducts();
        var checkoutProductInfo = [];
        var checkoutStep = trackingData.getPage().Value;
        $.each(checkoutProducts, function () {
            checkoutProductInfo.push({
                'name': this.Product.SeoName,
                'id': this.Product.Id.toUpperCase(),
                'price': this.Product.UnitPrice,
                'brand': this.Product.Brand.toLowerCase(),
                'category': this.Product.Category + "/" + this.Product.SubCategory,
                'quantity': this.Quantity
            });
        });

        var ecomm_prodid = [];
        checkoutProducts.forEach(function(item){
            ecomm_prodid.push(item.Product.Id.toUpperCase());
        })

        //Convert checkout step to number for GA
        switch (checkoutStep) {
            case "SignInMyAccount", "SignInGuest":
                checkoutStep = 1;
                break;
            case "CustomerOrderDetails":
                checkoutStep = 2;
                break;
            default:
                checkoutStep = "other";
        }
        dataLayer.push({
            'event': "checkout",
            'ecommerce': {
                'checkout': {
                    'actionField': {
                        'step': checkoutStep
                    },
                    'products': checkoutProductInfo
                }
            },
            'ecomm_prodid': ecomm_prodid
        });
    }
    // Purchase dataLayer
    if (trackingData.getPage().Category === "Order Confirmation") {
        var purchaseProducts = trackingData.getProducts();
        var purchaseProductInfo = [];
        var revenue = +(trackingData.getOrderGoodsTotalExcVat() + trackingData.getOrderShipTotal()).toFixed(2);
        $.each(purchaseProducts, function () {
            purchaseProductInfo.push({
                'name': this.Product.SeoName,
                'id': this.Product.Id.toUpperCase(),
                'price': this.Product.UnitPrice,
                'brand': this.Product.Brand.toLowerCase(),
                'category': this.Product.Category + "/" + this.Product.SubCategory,
                'quantity': this.Quantity
            });
        });
        dataLayer.push({
            'event': "orderPurchase",
            'ecommerce': {
                'purchase': {
                    'actionField': {
                        'id': trackingData.getOrderId(),
                        'revenue': revenue,
                        'shipping': trackingData.getOrderShipTotal(),
                        'coupon': trackingData.getPromotionCode()
                    },
                    'products': purchaseProductInfo
                }
            }
        });
        // Dynamic Remarketing Purchased
        var purchaseProductId = [];
        $.each(purchaseProducts, function () {
            purchaseProductId.push(this.Product.Id.toUpperCase());
        });
        dataLayer.push({
            'ecomm_pagetype': "purchase",
            'ecomm_prodid': purchaseProductId

        });
    };

    // CONSENT TRACKING
    var page = window.location.href;

    // My Account Consent
    if (page.indexOf("/Secure/Account/Mailing") > 0) {

        // My Account Email Consent
        $("#ConsentOptOutOfEmail").on("click", function () {
            var myEmailPermit = $("#ConsentOptOutOfEmail").prop("checked");
            var myEmailPermitStatus;
            if (myEmailPermit === true) {
                myEmailPermitStatus = "No";
            } else {
                myEmailPermitStatus = "Yes";
            }
            dataLayer.push({
                'event': "myAccountEmailConsent",
                'myAccountEmailOptIn': myEmailPermitStatus
            });
        });
    }

    //CONSOLIDATED CHECKOUT

    //For purpose of identifying customer type in checkout
    dataLayer.push({
        'checkoutCustomerType': trackingData.getUserType()
    });



    if (window.location.href.toLowerCase().indexOf("/secure/checkout/customerorderdetails") > 0) {

        var ccCategory = "";
        var ccAction = "";
        var ccLabel = "";
        var ccFunnel = "CC Funnel";
        var ccDetailsFunnel = "CC Details Funnel";
        var ccContinueBtn = "Continue Button";
        var ccPaymentStep = "3_Payment";
        var ccInteraction = "CC Interaction";
        var ccBillingAddress = "CC Billing Address";
        var ccDeliveryAddress = "CC Delivery Address";
        var ccDeliveryMethod = "CC Delivery Method";
        var ccMiniBasket = "CC Mini Basket";
        var ccC;
        var ccA;
        var ccL;

        //Checkout Validation
        var ccValidation = "CC Validation";
        var ccDetailsError = "CC Cardholder Details Error";
        var ccDetailsErrorBilling = "CC Cardholder Details Error (Billing Address)";

        document.addEventListener("click", function (event) {
            var dataGTM = event.target.getAttribute("data-gtm");
            if (dataGTM != undefined || dataGTM != null) {
                switch (dataGTM) {
                    // HEADER
                    case "cc-signin-header":
                        ccCategory = ccInteraction;
                        ccAction = "CC Header";
                        ccLabel = "Sign in";
                        break;

                    case "cc-myaccount-header":
                        ccCategory = ccInteraction;
                        ccAction = "CC Header";
                        ccLabel = "My Account";
                        break;

                    case "cc-logo-header":
                        ccCategory = ccInteraction;
                        ccAction = "CC Header";
                        ccLabel = "Logo";
                        break;


                        // YOUR DETAILS
                    case "cc-continue-your_details":
                        ccC = ccDetailsFunnel;
                        ccA = "CC Details";
                        ccL = ccContinueBtn;

                        if (!errorChecks() && !DBerrorCheck("cc_your_details")) {
                            ccCategory = ccC;
                            ccAction = ccA;
                            ccLabel = ccL;
                        } else {
                            ccCategory = "";
                            ccAction = "";
                            ccLabel = "";
                        }

                        break;
                    case "cc-mobile_landline_toggle-your_details":
                        ccCategory = ccInteraction;
                        ccAction = "CC Details";
                        ccLabel = "Does not have a mobile?";
                        break;
                    case "cc-landline_mobile_toggle-your_details":
                        ccCategory = ccInteraction;
                        ccAction = "CC Details";
                        ccLabel = "Want to use a mobile number?";
                        break;
                    case "cc-edit-your_details":
                        ccCategory = ccInteraction;
                        ccAction = "CC Details";
                        ccLabel = "Edit";
                        break;

                    case "cc-mobile_tip-your_details":
                        ccCategory = ccInteraction;
                        ccAction = "CC Details";
                        ccLabel = "Tooltip";
                        break;

                        // YOUR BILLING ADDRESS
                    case "cc-continue-billing_address":
                        ccC = ccDetailsFunnel;
                        ccA = ccBillingAddress;
                        ccL = ccContinueBtn;
                        if (!errorChecks() && !DBerrorCheck("cc_billing_address")) {
                            ccCategory = ccC;
                            ccAction = ccA;
                            ccLabel = ccL;
                        } else {
                            ccCategory = "";
                            ccAction = "";
                            ccLabel = "";
                        }
                        break;
                    case "cc-postocode_popup_manual_toggle-billing_address":
                        ccCategory = ccInteraction;
                        ccAction = ccBillingAddress;
                        ccLabel = "Manual Address";
                        break;
                    case "cc-toggle_postcode_link-billing_address":
                        ccCategory = ccInteraction;
                        ccAction = ccBillingAddress;
                        if (document.querySelector("*[data-gtm='cc-find_address-billing_address']")) {
                            ccLabel = "Postcode Lookup";
                        } else {
                            ccLabel = "Manual enter address";
                        }
                        break;
                    case "cc-edit-billing_address":
                        ccCategory = ccInteraction;
                        ccAction = ccBillingAddress;
                        ccLabel = "Edit";
                        break;
                    case "cc-find_address-billing_address":
                        ccCategory = ccInteraction;
                        ccAction = ccBillingAddress;
                        ccLabel = "Find My Address";
                        break;

                        // YOUR DELIVERY ADDRESS
                    case "cc-same_as_billing-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Same as Billing Address";
                        break;
                    case "cc-previous_address-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Previous Delivery Address";
                        break;
                    case "cc-new_address-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Create New Delivery Address";
                        break;
                    case "cc-toggle_postcode_link-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Manual Address";
                        break;
                    case "cc-continue-delivery_address":
                        ccC = ccDetailsFunnel;
                        ccA = ccDeliveryAddress;
                        ccL = ccContinueBtn;
                        if (!errorChecks() && !DBerrorCheck("cc_delivery_address")) {
                            ccCategory = ccC;
                            ccAction = ccA;
                            ccLabel = ccL;
                        } else {
                            ccCategory = "";
                            ccAction = "";
                            ccLabel = "";
                        }
                        break;
                    case "cc-edit-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Edit";
                        break;
                    case "cc-find_address-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Find My Address";
                        break;
                    case "cc-toogle-to-postcode-lookup":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Postcode Lookup";
                        break;
                    case "cc-toogle-to-manual-entry":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "Manual Address";
                        break;
                    case "cc-what_if_not_in-delivery_address":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryAddress;
                        ccLabel = "What if I am not in?";
                        break;

                        // DELIVERY METHOD
                    case "cc-add_returns_label-delivery_method":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryMethod;
                        ccLabel = "Add Hermes Returns Label";
                        break;
                    case "cc-hermes_more_info-delivery_method":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryMethod;
                        ccLabel = "Hermes (More Info)";
                        break;
                    case "cc-hermes_store_locator-delivery_method":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryMethod;
                        ccLabel = "Hermes Store Locator";
                        break;

                    case "cc-unlimited-more-info-link":
                        ccCategory = ccInteraction;
                        ccAction = ccDeliveryMethod;
                        ccLabel = "More info (Unlimited Link)";
                        break;

                    case "cc-delivery-method":
                        var methodClicked = event.target.getAttribute("data-dmethod");
                        document.getElementById("continueToPaymentButton1").setAttribute("data-dmethod", methodClicked);
                        document.getElementById("continueToPaymentButton2").setAttribute("data-dmethod", methodClicked);
                        //document.getElementById("continue-to-payment-button").setAttribute("data-dmethod", methodClicked);
                        break;

                        // CONTACT PREFERENCES

                    case "cc-consent_options-contact_preferences":
                        ccCategory = ccInteraction;
                        ccAction = "Contact Preferences";
                        ccLabel = "";
                        break;

                        // SIDEBASKET

                    case "cc-edit-sidebasket":
                        ccCategory = ccInteraction;
                        ccAction = ccMiniBasket;
                        ccLabel = "Edit";
                        break;
                    case "cc-summary_edit-sidebasket":
                        ccCategory = ccInteraction;
                        ccAction = ccMiniBasket;
                        ccLabel = "Edit in Summary";
                        break;
                    case "cc_sidebasket_qty_interaction":
                        ccCategory = ccInteraction;
                        ccAction = ccMiniBasket;
                        ccLabel = "Item Qty Edited";
                        break;
                    case "cc_sidebasket_item_removed":
                        ccCategory = ccInteraction;
                        ccAction = ccMiniBasket;
                        ccLabel = "Item removed";
                        break;


                    // CONTINUE TO PAYMENT, this 2 have to be replaced by continue-to-payment-button once inline is on
                    case "paymentButton1":
                        ccC = ccFunnel;
                        ccA = ccPaymentStep;
                        ccL = "Main Continue";
                        if (!errorChecks() && !DBerrorCheck("cc_continue_main_container")) {
                            ccCategory = ccC;
                            ccAction = ccA;
                            ccLabel = ccL;

                            var methodId = event.target.getAttribute("data-dmethod");
                            dataLayer.push({
                                'event': "ccClick",
                                'ccCategory': "CC Interaction",
                                'ccAction': "CC Delivery Method",
                                'ccLabel': methodId
                            });

                        } else {
                            ccCategory = "";
                            ccAction = "";
                            ccLabel = "";
                        }

                        var accountCreated = document.querySelector("*[data-gtm='cc-password-correct']");
                        if (accountCreated) {
                            dataLayer.push({
                                'event': "ccClick",
                                'ccCategory': ccInteraction,
                                'ccAction': "CC Sign Up",
                                'ccLabel': ''
                            });
                        }


                        break;



                    case "paymentButton2":
                        ccC = ccFunnel;
                        ccA = ccPaymentStep;
                        ccL = "Sidebar Continue";
                        if (!errorChecks() && !DBerrorCheck("cc_continue_sidebar")) {
                            ccCategory = ccC;
                            ccAction = ccA;
                            ccLabel = ccL;
                        } else {
                            ccCategory = "";
                            ccAction = "";
                            ccLabel = "";
                        }

                        var accountCreated = document.querySelector("*[data-gtm='cc-password-correct']");
                        if (accountCreated) {
                            dataLayer.push({
                                'event': "ccClick",
                                'ccCategory': ccInteraction,
                                'ccAction': "CC Sign Up",
                                'ccLabel': ''
                            });
                        }

                        break;

                    default:
                        break;
                }

                if (ccCategory != "") {
                    dataLayer.push({
                        'event': "ccClick",
                        'ccCategory': ccCategory,
                        'ccAction': ccAction,
                        'ccLabel': ccLabel
                    });
                    ccCategory = "";
                    ccAction = "";
                    ccLabel = "";
                }
            }

        }, true);

        function errorChecks() {
            var errorList = document.querySelectorAll(".errorMessage");
            if (errorList.length > 0) {
                errorList.forEach((listItem) => {
                    var errorGTM = listItem.dataset.gtm;
                    switch (errorGTM) {
                        // YOUR DETAILS
                        case "cc-title_error-your_details":
                            dataLayer.push({
                                'event': "ccTitleError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "No Title"
                            });
                            break;

                        case "cc-firstname_error-your_details":
                            dataLayer.push({
                                'event': "ccFirstNameError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "No First Name"
                            });
                            break;

                        case "cc-lastname_error-your_details":
                            dataLayer.push({
                                'event': "ccLastNameError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "No Last Name"
                            });
                            break;

                        case "cc-email_error-your_details":
                            dataLayer.push({
                                'event': "ccEmailConfirmError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "Confirm Email Address"
                            });
                            break;

                        case "cc-mobile_required_error-your_details":
                            dataLayer.push({
                                'event': "ccNoMobileError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "Missing Phone Number"
                            });
                            break;

                        case "cc-landline_required_error-your_details":
                            dataLayer.push({
                                'event': "ccNoLandlineError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsError,
                                'ccErrorLabel': "Missing Landline Number"
                            });
                            break;

                        case "cc-postcode_error-billing_address":
                            dataLayer.push({
                                'event': "ccNoPostcodeBillingError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsErrorBilling,
                                'ccErrorLabel': "No Postcode"
                            });
                            break;

                        case "cc-error_address_required":
                            dataLayer.push({
                                'event': "ccNoHouseBillingError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': ccDetailsErrorBilling,
                                'ccErrorLabel': "No House Number or Name"
                            });
                            break;

                        case "cc-error-creating-password":
                            dataLayer.push({
                                'event': "ccPasswordMatchError",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "Error Creating Password",
                                'ccErrorLabel': "Password"
                            });
                            break;

                        case "cc_billingAddress_CustomerAddress1_required":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress1_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Required Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_billingAddress_CustomerAddress4_required":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress4_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Required Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_billingAddress_CustomerPostCode_required":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerPostCode_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Required Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;
                        case "cc_billingAddress_CustomerAddress1_wrongFormat":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress1_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Wrong Format Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_billingAddress_CustomerAddress4_wrongFormat":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress4_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Wrong Format Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_billingAddress_CustomerPostCode_wrongFormat":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerPostCode_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Wrong Format Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;
                        case "cc_billingAddress_CustomerAddress1_maxlength":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress1_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Maxlength Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_billingAddress_CustomerAddress4_maxlength":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerAddress4_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Maxlength Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_billingAddress_CustomerPostCode_maxlength":
                            dataLayer.push({
                                'event': "cc_billingAddress_CustomerPostCode_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Billing Addres Maxlength Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;

                        // Delivery Address
                        case "cc_deliveryAddress_CustomerAddress1_required":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress1_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Required Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerAddress4_required":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress4_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Required Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerPostCode_required":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerPostCode_required",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Required Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;
                        case "cc_deliveryAddress_CustomerAddress1_wrongFormat":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress1_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Wrong Format Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerAddress4_wrongFormat":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress4_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Wrong Format Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerPostCode_wrongFormat":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerPostCode_wrongFormat",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Wrong Format Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;
                        case "cc_deliveryAddress_CustomerAddress1_maxlength":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress1_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Maxlength Error",
                                'ccErrorLabel': "Address Line 1"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerAddress4_maxlength":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerAddress4_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Maxlength Error",
                                'ccErrorLabel': "Town"
                            });
                            break;

                        case "cc_deliveryAddress_CustomerPostCode_maxlength":
                            dataLayer.push({
                                'event': "cc_deliveryAddress_CustomerPostCode_maxlength",
                                'ccErrorCategory': ccValidation,
                                'ccErrorAction': "CC Delivery Address Maxlength Error",
                                'ccErrorLabel': "Postcode"
                            });
                            break;
                        default:
                            break;
                    }
                })
                return true;
            } else {
                return false;
            }
        }

        function DBerrorCheck(errorSection) {
            var DBErrorFired = document.querySelector("*[data-gtm='cc_technical_error']");
            if (DBErrorFired) {
                dataLayer.push({
                    'event': "ccClick",
                    'ccCategory': "Checkout Validation",
                    'ccAction': "DB Error",
                    'ccLabel': errorSection
                });
                return true;
            } else {
                return false;
            }
        }




    }
}



//Remove from basket dataLayer
// pushRemoveData is called in siteBasketKo.js by self.removeItem
var pushRemoveData = function (removedData) {
    dataLayer.push({
        'event': "removeFromBasket",
        'ecommerce': {
            'remove': {
                'products': [{
                    'name': removedData.Name,
                    'id': removedData.Id,
                    'price': removedData.Total,
                    'brand': removedData.Brand,
                    'category': removedData.Category + "/" + removedData.SubCategory,
                    'quantity': removedData.Quantity()
                }]
            }
        }
    });
}

//Adjust basket quantities dataLayer
// changeBasketQuantities is called in siteBasketKo.js
var changeBasketQuantities = function (product, oldQuantity, newQuantity) {
    if (newQuantity > oldQuantity) {
        dataLayer.push({
            'event': "increaseBasketQuantity",
            'ecommerce': {
                'add': {
                    'products': {
                        'name': product.Name,
                        'id': product.Id,
                        'price': product.Total,
                        'brand': product.Brand,
                        'category': product.Category + "/" + product.SubCategory,
                        'quantity': (newQuantity - oldQuantity)
                    }
                }
            }
        });
    } else {
        dataLayer.push({
            'event': "decreaseBasketQuantity",
            'ecommerce': {
                'remove': {
                    'products': {
                        'name': product.Name,
                        'id': product.Id,
                        'price': product.Total,
                        'brand': product.Brand,
                        'category': product.Category + "/" + product.SubCategory,
                        'quantity': (oldQuantity - newQuantity)
                    }
                }
            }
        });
    }
}

var getFtsTerm = function () {

    if (window.location.toString().indexOf("/02/fts/?search=") > -1) {
        if (undefined != mm.helpers.urlHelper) {
            var searchTerm = mm.helpers.urlHelper.getParameterByName("search", null);
            return searchTerm;
        }
    }

    return "";
}

//End Google Tag Manager Data Layer