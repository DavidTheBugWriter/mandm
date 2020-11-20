// A helper to get the UserId/Guid.
// If the User is logged in, it will get the UserId from the cookie, if not it will get the Guid from the trackingData.






function getUserGuid() {
    return trackingData.getCustomer().Guid; 
}


function redEye() {

    var previouspage = document.referrer;
    var site;
    var currency;
    if ($(".MandMFRA").length > 0) {
        site = "&site=FR";
        currency = "&currency=EUR";
    } else if ($(".MandMGBP").length > 0) {
        site = "&site=com";
        currency = "&currency=GBP";
    } else if ($(".MandMIRE").length > 0) {
        site = "&site=IE";
        currency = "&currency=EUR";
    } else if ($(".MandMGER").length > 0) {
        site = "&site=DE";
        currency = "&currency=EUR";
    } else if ($(".MandMNL").length > 0) {
        site = "&site=NL";
        currency = "&currency=EUR";
    } else if ($(".MandMDKK").length > 0) {
        site = "&site=DK";
        currency = "&currency=DKK";
    } else if ($(".MandMPL").length > 0) {
        site = "&site=PL";
        currency = "&currency=PLN";
    } else {
        console.log("Error loading redeye values");
    }


    var imgEnd = '" alt="" height="0" width="0" />';
    var guid = "&guid=" + getUserGuid();


    // Email SIGN UP
    function signUp() {
        $("#redEyeAll").remove();
        var email = $(".emailSignUpText").val();
        var encodedEmail = '&email=' + encodeURIComponent(email).split("%40").join("@");
        if (email !== "" && $("#mvt-38-v4-box").length === 0) {
            var signUpControl =
                '<img class="hidden" id="emailSignUp" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif?nourl=email-sign-up&newsletter=header&emailpermit=yes'
                    .concat(encodedEmail, site, currency, guid, imgEnd);
            $("body").append(signUpControl);
        } else if (email !== "" && $("#mvt-38-v4-box").length > 0) {
            var signUpPopup =
                '<img class="hidden" id="emailSignUp" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif?nourl=email-sign-up&newsletter=popup&emailpermit=yes'
                    .concat(encodedEmail, site, currency, guid, imgEnd);
            $("body").append(signUpPopup);
        }
    }

    $(document).ready(function() {
        $(".emailSignUpButton").on("click", signUp);
    });

    //

    // Log On- to be passed as and when a user logs in
    if (window.location.href.includes("Secure/Account/Welcome") &&
        !window.location.href.includes("SignIn") &&
        previouspage.indexOf("/Secure/Account/SignIn") > 0) {
        $("#redEyeAll").remove();
        var nourl = "?nourl=log-in";
        var email_val = trackingData.getCustomer().Email;
        var email_val_filter = encodeURIComponent(email_val).split("%40").join("@");
        var email = "&email=" + email_val_filter;
        var redEyelogOn =
            '<img class="hidden" id="logOn" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif'.concat(nourl,
                email,
                site,
                currency,
                guid,
                imgEnd);
        $("body").append(redEyelogOn);
    }
    //


    // Log On Checkout- to be passed as and when a user logs in
    if (window.location.href.includes("/Secure/Checkout/CustomerOrderDetails") > 0 &&
        previouspage.indexOf("/Secure/Account/SignIn") > 0 &&
        trackingData.getUserType() === "MyAccount") {
        $("#redEyeAll").remove();
        var nourl = "?nourl=log-in";
        var email_val = trackingData.getCustomer().Email;
        var email_val_filter = encodeURIComponent(email_val).split("%40").join("@");
        var email = "&email=" + email_val_filter;
        var redEyelogOn =
            '<img class="hidden" id="logOn" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif'.concat(nourl,
                email,
                site,
                currency,
                guid,
                imgEnd);
        $("body").append(redEyelogOn);
    }
    //

    // Checkout - Email Passed (to be passed when continuing to guest checkout) ** WORKING IN CC
    if (window.location.href.includes("/Secure/Checkout/CustomerOrderDetails") &&
        !window.location.href.includes("SignIn") &&
        trackingData.getUserType() === "Guest") {

        var email = trackingData.getCustomer().Email;
        var checkoutEmailPassed =
            '<img class="hidden" id="checkoutEmailPassed" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif?nourl=checkout-email-passed&checkout_email_passed=checkout-email-passed' +
                '&email=' +
                encodeURIComponent(email).split("%40").join("@") +
                site +
                currency +
                '&guid=' +
                getUserGuid() +
                '"' +
                'alt="" width="0" height="0">';
        $("body").append(checkoutEmailPassed);

        document.addEventListener("load",
            function() {
                $("#redEyeAll").remove();
            })
    }
    //


    //Guest Checkout
    if (window.location.href.includes("/Secure/Checkout/CustomerOrderDetails") &&
        !window.location.href.includes("SignIn") &&
        trackingData.getUserType() === "Guest") {


        var nourl = "?nourl=guest-checkout-details-confirmed";
        var checkout = "&checkout=guest";
        var email_val = trackingData.getCustomer().Email; // ok
        var email_val_filter = encodeURIComponent(email_val).split("%40").join("@"); // ok
        var email = "&email=" + email_val_filter; // ok
        sessionStorage.setItem("email", email)

        __zone_symbol__addEventListener("change",
            function(event) {

                switch (event.target.id) {
                case "firstName":
                    var firstname_val = event.target.value;
                    var firstname_val_filter = encodeURIComponent(firstname_val);
                    var firstname = "&firstname=" + firstname_val_filter;
                    sessionStorage.setItem("firstName", firstname)
                    break;
                case "lastName":
                    var lastname_val = event.target.value;
                    var lastname_val_filter = encodeURIComponent(lastname_val);
                    var lastname = "&lastname=" + lastname_val_filter;
                    sessionStorage.setItem("lastName", lastname)
                    break;
                case "mobileNumber":
                    var mobile_val = event.target.value;
                    var mobile_val_filter = encodeURIComponent(mobile_val);
                    var mobile = "&mobile=" + mobile_val_filter;
                    sessionStorage.setItem("mobile", mobile)
                    break;
                case "customerEmail":
                    var email_val = event.target.value;
                    var email_val_filter = encodeURIComponent(email_val).split("%40").join("@");
                    var email = "&email=" + email_val_filter;
                    sessionStorage.setItem("email", email)
                    break;
                default:
                    break;
                }

            });

        function guestCheckout() {
            $("#redEyeAll").remove();
            $("#guest-checkout-details-confirmed").remove();

            var fn = sessionStorage.getItem("firstName");
            var ln = sessionStorage.getItem("lastName");
            var mo = sessionStorage.getItem("mobile")
            var em = sessionStorage.getItem("email")

            var allnospaces = fn.concat(ln, mo, em);
            var redEyeGuestCheckout =
                '<img class="hidden" id="guest-checkout-details-confirmed" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif'
                    .concat(nourl, checkout, allnospaces, site, currency, guid, imgEnd);
            $("body").append(redEyeGuestCheckout);
            // We store locally the data to bring it on the next page
        }

        document.addEventListener("load",
            function() {
                $("[data-gtm='cc-continue-your_details']").on("click", guestCheckout);
            })
        document.addEventListener("change",
            function() {
                $("[data-gtm='cc-continue-your_details']").on("click", guestCheckout);
            })

    }


    //

    // Registration Confirm
    if (window.location.href.indexOf("/Secure/Account/New") > 0 && trackingData.getUserType() === "Guest") {
        function registrationConfirm() {
            $("#redEyeAll").remove();
            var nourl = "?nourl=registration-confirm";
            var rg_conf = "&rg_conf=yes";
            var title_val = $("#CardholderDetails_CardholderName_Salutation").val();
            var title_val_filter = encodeURIComponent(title_val);
            var title = "&title=" + title_val_filter;
            var firstname_val = $("#CardholderDetails_CardholderName_FirstName").val();
            var firstname_val_filter = encodeURIComponent(firstname_val);
            var firstname = "&firstname=" + firstname_val_filter;
            var lastname_val = $("#CardholderDetails_CardholderName_Surname").val();
            var lastname_val_filter = encodeURIComponent(lastname_val);
            var lastname = "&lastname=" + lastname_val_filter;
            var mobile_val = $("#CustomerDetails_Mobile").val();
            var mobile_val_filter = encodeURIComponent(mobile_val);
            var mobile = "&mobile=" + mobile_val_filter;
            var email_val = $("#CustomerDetails_EmailAddress").val();
            var email_val_filter = encodeURIComponent(email_val).split("%40").join("@");
            var email = "&email=" + email_val_filter;
            var address1_val = $("#CardholderDetails_Address_AddressLine1").val();
            var address1_val_filter = encodeURIComponent(address1_val);
            var address1 = "&address1=" + address1_val_filter;
            var address2_val = $("#CardholderDetails_Address_AddressLine2").val();
            var address2_val_filter = encodeURIComponent(address2_val);
            var address2 = "&address2=" + address2_val_filter;
            var address3_val = $("#CardholderDetails_Address_AddressLine3").val();
            var address3_val_filter = encodeURIComponent(address3_val);
            var address3 = "&address3=" + address3_val_filter;
            var town_val = $("#CardholderDetails_Address_Town").val();
            var town_val_filter = encodeURIComponent(town_val);
            var town = "&town=" + town_val_filter;
            var location_val = $("#CardholderDetails_Address_County").val();
            var location_val_filter = encodeURIComponent(location_val);
            var location = "&location=" + location_val_filter;
            var postcode_val = $("#CardholderDetails_Address_PostCode").val();
            var postcode_val_filter = encodeURIComponent(postcode_val);
            var postcode = "&postcode=" + postcode_val_filter;
            var country_val = $("#CardholderDetails_FindAddress_Country").val();
            var country_name = $("#CardholderDetails_FindAddress_Country option[value='" + country_val + "']").text();
            var country_val_filter = encodeURIComponent(country_name);
            var country = "&country=" + country_val_filter;
            var allnospaces = title.concat(firstname,
                lastname,
                mobile,
                email,
                address1,
                address2,
                address3,
                town,
                location,
                postcode,
                country);
            var redEyeregistrationConfirm =
                '<img class="hidden" id="registrationConfirm" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif'
                    .concat(nourl, rg_conf, allnospaces, site, currency, guid, imgEnd);
            localStorage.setItem("redEyeregistrationConfirm_data", redEyeregistrationConfirm);
            // We store locally the data to bring it on the next page
        }

        registrationConfirm();
        $("input").on("change", registrationConfirm);
    }
    // ============ //
    if (window.location.href.indexOf("Secure/Account/Welcome") > 0 && previouspage.indexOf("/Secure/Account/New") > 0) {
        $("#redEyeAll").remove();
        var redEyeregistrationConfirm_data_print = localStorage.getItem("redEyeregistrationConfirm_data");
        $("body").append(redEyeregistrationConfirm_data_print);
    }
    //    

    // MY Account - Details
    if (window.location.href.indexOf("/Secure/Account/Customer") > 0 ||
        window.location.href.indexOf("/Secure/Account/Address") > 0 ||
        window.location.href.indexOf("/Secure/Account/Delivery") > 0 ||
        window.location.href.indexOf("/Secure/Account/Phone") > 0 ||
        window.location.href.indexOf("/Secure/Account/Email") > 0 ||
        window.location.href.indexOf("/Secure/Account/Dob") > 0 ||
        window.location.href.indexOf("/Secure/Account/Password") > 0) {
        function myAccountDetails() {
            $("#redEyeAll").remove();
            var nourl = "?nourl=my-account-details";
            var title_var = trackingData.getCustomer().Title.toString();
            var title_var_filter = encodeURIComponent(title_var);
            var title = "&title=" + title_var_filter;
            var first_var = trackingData.getCustomer().FirstName.toString();
            var first_var_filter = encodeURIComponent(first_var);
            var first_name = "&firstname=" + first_var_filter;
            var last_var = trackingData.getCustomer().LastName.toString();
            var last_var_filter = encodeURIComponent(last_var);
            var last_name = "&lastname=" + last_var_filter;
            var email_var = trackingData.getCustomer().Email.toString();
            var email_var_filter = encodeURIComponent(email_var).split("%40").join("@");
            var email_address = "&email-n-store=" + email_var_filter;
            var telephone_var = trackingData.getCustomer().Telephone.toString();
            var telephone_var_filter = encodeURIComponent(telephone_var);
            var telephone = "&telephone=" + telephone_var_filter;
            var redEyeMyAccountDetails =
                '<img class="hidden" id="hidden redEyeMyAccountDetails" src="//reporting.mandmdirect.com/cgi-bin/rr/blank.gif'
                    .concat(nourl,
                        title,
                        first_name,
                        last_name,
                        email_address,
                        telephone,
                        site,
                        currency,
                        guid,
                        imgEnd);
            $("body").append(redEyeMyAccountDetails);
        }

        myAccountDetails();
    }
    //
}


