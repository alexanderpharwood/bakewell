
var appId = "system-app";

$('.ui-window').removeClass('active');

//Function for the app's main process / logic (kept in global process object). Removed from memory when the app is closed.
BAKEWELL.appProccess[appId] = function(){
    
    //Show / dont show, screen debugging
    
$('#save').click(function(){
    $('.setting-control').each(function(){
console.log($(this));
        BAKEWELL.core.settings.setValueFromControl($(this));
        
    });
    BAKEWELL.ui.window.notification("system-app", "success", "Settings saved", 1000);
     BAKEWELL.core.settings.triggerSettings();
});
};

BAKEWELL.appProccess[appId].appState = {
    "additionalCss": "width: 700px; height: 400px; min-width: 700px; min-height: 400px;"
};


//Logic here to do the loading of the template etc. Once all scrupts and templates and initializing logic have been completed, we can fire the main prccess function (above).

$.ajax({

    type: "GET", //Personally i prefer using post, you can swap this to get if you want.
    url: "webapp/apps/" + appId + "/"  + appId + ".html",
    dataType: "html", //Note the dataType has been changed from default here.
    error: function() {
      //You can do a fallback here
        console.log("load failed template");
    },
    success: function(data) { //Note the data variable here. This is your returned data

       $('.desktop-area').append(data);
        
                $('#' + appId + ' .window-body').transition('fade in');
                BAKEWELL.core.logging.screenLog("Launched: " + appId);
                BAKEWELL.core.initWindow(appId);
                BAKEWELL.appProccess[appId]();
            
          
    }

});

var appCss = '#editor{height: 100%;margin: 0px;}';
$('#appCss').append(appCss);