var mmUA = new function () {

    var execute = function (uaAccountId) {
        // wrap logic with try catch to ensure any issues do not block subsequent js logic
        try {
            executeinternal(uaAccountId);
        } catch (e) {
        }
    };

    var executeinternal = function (uaAccountId) {

          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

          if ($('.MandMDKK').length > 0) {
              ga('create', 'UA-241645-20', 'auto');
          }
    };



    return {
        execute: execute
    };
}

