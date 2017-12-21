'use strict';
var appId = "ace-js-app";

$('.ui-window').removeClass('active');


//Launcher path - this file will do a getScript on the program's main js file, but from the correct place so any further includes will work.
var jsRef = '<script src="webapp/apps/ace-js-app/src-min-noconflict/ace.js"></script>';
    $('body').append(jsRef);

//Function for the app's main process / logic (kept in global process object). Removed from memory when the app is closed.
BAKEWELL.appProccess[appId] = function(){

                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/twilight");
                editor.session.setMode("ace/mode/javascript");
    
   $('#' + appId + ' .ui.dropdown').dropdown({
        action: 'hide'
   });
    
   $('#' + appId + ' .window-menu .menu-action').click(function(){
        var action = $(this).attr('data-menu-action');
       switch(action){
           case "alert":
            alert("Alerting!");
           break;
           default:
            break;
       }
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
        BAKEWELL.core.logging.screenLog("Failed loading template for: " + appId);
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