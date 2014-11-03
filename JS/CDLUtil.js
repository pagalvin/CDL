/**
 * Created by pgalvin on 10/25/2014.
 */
var CDL = {

    Util: {

        // All of the CDL pages are going to be rooted in "[root]/Pages/[WebPartPage].aspx".  This is what I'm
        // supporting, anyway :).  This function uses that assumption to get to the Data directory and the actual
        // name of the config file.
        getConfigFileName: function(calledFromWhichPage) {
            var thisPageLocation = window.location.href;

            var configFileName = thisPageLocation.substring(0,thisPageLocation.indexOf('/Pages/'));

            configFileName += "/Data/CDLConfigDataAsJSON.txt";

            return configFileName;
        }
    }

};



