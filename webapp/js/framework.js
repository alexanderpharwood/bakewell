'use strict';

var BAKEWELL = {};

//Sub namespaces
BAKEWELL.core = {};
BAKEWELL.ui = {};
BAKEWELL.audio = {};
BAKEWELL.background = {};
BAKEWELL.utilities = {};

//Namespace for proccesses started by apps. All of the app's logic should be n a function bound to this namespace.
BAKEWELL.appProccess = {};
BAKEWELL.appProccess.launch = {};


BAKEWELL.core.localStorage = {};

BAKEWELL.core.localStorage.clear = function(){
    window.localStorage.clear();
}
    
BAKEWELL.core.localStorage.set = function(key, value){
    var storage = window.localStorage;
    storage.setItem(key, value) // Pass a key name and its value to add or update that key.
}

BAKEWELL.core.localStorage.get = function(key){
    var storage = window.localStorage;
    var returnContent = storage.getItem(key); // Pass a key name and its value to add or update that key.
    return returnContent;
}


BAKEWELL.core.settings = {};
BAKEWELL.core.settings.values = {};

BAKEWELL.core.settings.init = function(){

    var settingsObj = null;
    var settingsObj = JSON.parse(BAKEWELL.core.localStorage.get('globalSettings'));
    if(settingsObj == null){
        settingsObj = {
            "show-screen-log": {
                "eleId": "show-screen-log-control",
                "targetType": "visible",
                "subTargetType": null,
                "controlType": "checkbox",
                "value": false
            },
            "email-address": {
                "eleId": "email-address",
                "targetType": "text",
                "subTargetType": null,
                "controlType": "text",
                "value": ""
            },
            "desktop-area-wallpaper": {
                "eleId": "desktop-area-wallpaper",
                "targetType": "css",
                "subTargetType": "background-image",
                "controlType": "text",
                "value": "http://static.simpledesktops.com/uploads/desktops/2016/12/05/Untitled-1-03-01.png"
            }, 
        };
        
    }
    
    BAKEWELL.core.settings.values = settingsObj;
    
}



BAKEWELL.core.settings.triggerSettings = function(){
    
    //For the settings elements (input fields - probably)
         $('.setting-control').each(function(){
             var dataSetting = $(this).attr('data-setting');

             if(BAKEWELL.core.settings.values[dataSetting].controlType == "checkbox"){
                $(this).prop("checked", BAKEWELL.core.settings.values[dataSetting].value);
            }
            else if(BAKEWELL.core.settings.values[dataSetting].type == "visible"){
                if(BAKEWELL.core.settings.values[dataSetting].value == true){
                    $(this).show();
                }
                else{
                    $(this).hide();
                }
            }
            else if(BAKEWELL.core.settings.values[dataSetting].controlType == "text"){
                $(this).val(BAKEWELL.core.settings.values[dataSetting].value);
            }

             
         });
    
    //for the setting targets / elements that are affected by the settings rather than elements that control the settings or set them
     $('.setting-target').each(function(){
         var dataSetting = $(this).attr('data-setting-target');
          if(BAKEWELL.core.settings.values[dataSetting].targetType == "checkbox"){
                $(this).prop("checked", BAKEWELL.core.settings.values[dataSetting].value);
            }
            else if(BAKEWELL.core.settings.values[dataSetting].targetType == "visible"){
                if(BAKEWELL.core.settings.values[dataSetting].value == true){
                    $(this).show();
                }
                else{
                    $(this).hide();
                }
            }
            else if(BAKEWELL.core.settings.values[dataSetting].targetType == "text"){
                $(this).val(BAKEWELL.core.settings.values[dataSetting].value);
            }
            else if(BAKEWELL.core.settings.values[dataSetting].targetType == "css"){
             
                switch(BAKEWELL.core.settings.values[dataSetting].subTargetType){
                    case "background-image":
                        $(this).css('background-image', 'url("'+BAKEWELL.core.settings.values[dataSetting].value+'")');
                    break;
                    default:
                    break;
                }
                
            }
     });
    
}

BAKEWELL.core.settings.setValue = function(settingId, value){

//selfId is only valid for settings with controllers (toggle for showingthe logging) for example, where we want the setting for that switch to be the same as the target setting. Otherwise, we can declare as null
    BAKEWELL.core.settings.values[settingId].value = value;
    
    BAKEWELL.core.logging.screenLog("Settings object updated");   
    BAKEWELL.core.localStorage.set("globalSettings", JSON.stringify(BAKEWELL.core.settings.values));
    
}


BAKEWELL.core.settings.setValueFromControl = function(controlElement){
       
    var settingId = controlElement.attr('data-setting');
    var controlType = controlElement.attr('type');

    var valueToSet;
    switch(controlType){
            
        case "checkbox":
            valueToSet = controlElement.prop("checked");
        break;
            
        case "text":
            valueToSet = controlElement.val();
        break;
    }
  BAKEWELL.core.settings.setValue(settingId, valueToSet);
    
//selfId is only valid for settings with controllers (toggle for showingthe logging) for example, where we want the setting for that switch to be the same as the target setting. Otherwise, we can declare as null
}



BAKEWELL.core.network = {};
BAKEWELL.core.network.ajax = function(method, url, mime, callback){ 
   var run = new Promise(function(resolve, reject){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    if (xmlhttp.status == 200) {
                        resolve(xmlhttp);
                    }
                    else {
                        reject(xmlhttp);
                    }
                }
            };
            xmlhttp.open(method, url, true);
            if(mime != null){
                xmlhttp.overrideMimeType(mime);
            }
            xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xmlhttp.send();
        });
    run.then(function(result){
	           callback(result);
            },
            function(err){
	           callback(err);
            });
}

BAKEWELL.core.network.checkState = function(domNetworkFlag){
    var systemTimer = setInterval(setClock,3000);
    function setClock(){
        BAKEWELL.core.network.ajax("GET", "https://httpbin.org/get", "application/json", function(response){
            if(response.status == 0){
                BAKEWELL.core.logging.screenLog("Failed network connection: keeping scanning alive");
                domNetworkFlag.removeClass('online');
                domNetworkFlag.addClass('offline');
                domNetworkFlag.text('OFFLINE');
            }
            else{
                domNetworkFlag.removeClass('offline');
                domNetworkFlag.addClass('online');
                domNetworkFlag.text('ONLINE');
            }
        });
    }
}

//BAKEWELL.core.loggging
BAKEWELL.core.logging = {};

    BAKEWELL.core.logging.enabled = true;
    //BAKEWELL.core.logging.quickLog function
    BAKEWELL.core.logging.quickLog = function(strLogString){
    }
    //BAKEWELL.core.logging.quickLog function
    BAKEWELL.core.logging.screenLog = function(strLogString){  
       var currentLogStack = $('.screen-logger-wrap > .screen-log').html();
       $('.screen-logger-wrap > .screen-log').html(new Date().toLocaleTimeString() + ': ' + strLogString + '<hr>' + currentLogStack);
    }

    
    //BAKEWELL.background.utilities
BAKEWELL.utilities = {};

    //BAKEWELL.background.common.clock
    BAKEWELL.utilities.clock = function(domClock){
        BAKEWELL.core.logging.screenLog('Initiated clock');
        var systemTimer = setInterval(setClock,1000);
        function setClock(){
            domClock.text(new Date().toLocaleTimeString());       
        }
    }

    
    //BAKEWELL.background.common
BAKEWELL.background.common = {};

    //BAKEWELL.background.common.stateCheck
    BAKEWELL.background.common.stateCheck = function(){
	   var stateCheckLoop = setInterval(runLoop, 5000);
       function runLoop(){	  
           //Statecheck for settings et will be doe here
       }
    }
    
    

BAKEWELL.core.handleDesktop = function(){
    
    //Need to do if statements here depentant on the user's settings
    
   BAKEWELL.core.settings.triggerSettings();
   
    
    //Even liostner for launchng apps
    $('body').on('mousedown', '.app-icon', function(){
        var appId = $(this).attr('data-app-id');
        $(this).transition({animation: 'pulse', duration: '0.2s'});
        if($(this).hasClass('active')){
            //already open
            if($('#' + appId).hasClass('hidden')){
                $('#' + appId).transition('drop in');
                $('.ui-window').removeClass('active');
                $('#' + appId).addClass('active');
            }
            else{
                $('#' + appId).click();
                $('#' + appId).transition('bounce');
                if(!$('#' + appId).hasClass('active')){
                    $('.ui-window').removeClass('active');
                    $('#' + appId).addClass('active');
                }
            }
        }
        else{
            //Load the app
            $.getScript( "webapp/apps/" + appId + "/"  + appId + ".js" )
            .done(function( script, textStatus ) {
            })
            .fail(function( jqxhr, settings, exception ) {
            });
        }
    });
    
    //clock
   BAKEWELL.utilities.clock($('.system-clock'));
    
    //Window controls: Close, Minimize etc.   
    $('body').on('click', '.ui-window > .window-header > .controls > .control', function(){
        var appId = $(this).attr('data-app-id');
        if($(this).hasClass('close')){
            $('#' + appId).transition({
                animation: 'scale out',
                onComplete: function(){
                    $('#' + appId).remove();
                    $('#' + appId + '-dock-icon').removeClass('active');
                    BAKEWELL.appProccess[appId] = function(){BAKEWELL.core.logging.screenLog("Application and main process terminated.");return false;}
                    BAKEWELL.appProccess[appId]();
                }
            });     
        }
        if($(this).hasClass('minimize')){
            $('#' + appId).transition('drop out');
        }
        if($(this).hasClass('maximize')){
            if($('#' + appId).hasClass('maximized')){
                $('#' + appId).addClass('ease-animate');
                $('#' + appId).css('top', BAKEWELL.appProccess[appId].appState.top);
                $('#' + appId).css('left', BAKEWELL.appProccess[appId].appState.left);
                $('#' + appId).height(BAKEWELL.appProccess[appId].appState.height);
                $('#' + appId).width(BAKEWELL.appProccess[appId].appState.width);
                $('#' + appId).removeClass('ease-animate');
                $('#' + appId).removeClass('maximized');
            }
            else{
                
            var windowPosition =  $('#' + appId).position();
            BAKEWELL.appProccess[appId].appState.height = $('#' + appId).height();
            BAKEWELL.appProccess[appId].appState.width = $('#' + appId).width();
            BAKEWELL.appProccess[appId].appState.top = windowPosition.top;
            BAKEWELL.appProccess[appId].appState.left = windowPosition.left;
            $('#' + appId).addClass('ease-animate');
            $('#' + appId).css('top', '30px');
            $('#' + appId).css('left', '55px');
            $('#' + appId).height($('.desktop-area').height());
            $('#' + appId).width($('.desktop-area').width());
            $('#' + appId).addClass('maximized');
            $('#' + appId).removeClass('ease-animate');
        }
        }
    });
    
    $('body').on('mousedown', '.ui-window', function(){
        var appId = $(this).attr('data-app-id');
        if(!$(this).hasClass('active')){
            $('.ui-window').removeClass('active');
            $(this).addClass('active');
        }
    }); 
    
     $('.ui.dropdown').dropdown({
        action: 'hide'
   });
    
};
    
BAKEWELL.core.initWindow = function(appId){
    
    document.addEventListener('contextmenu', event => event.preventDefault());
        
    //Can add resizable, position etc totehe winwo initialise function
    $('#' + appId).draggable({
        handle: '.window-header',
        containment: '.desktop-area', iframeFix: true
    })
    .resizable({
        containment: '.desktop-area',
        start: function(event, ui) {
            $('iframe').css('pointer-events','none');
        },
        stop: function(event, ui) {
            $('iframe').css('pointer-events','auto');
        }
    });
    $('#' + appId + ' .window-notification').hide();
    //Add the .active class to the app icon in the dock.
    $('#' + appId + '-dock-icon').addClass('active');  
    //Add the css perameters passed in.
    $('#' + appId).attr('style', BAKEWELL.appProccess[appId].appState.additionalCss);
    //Transition in the window
    $('#' + appId).transition('scale in');
    
    BAKEWELL.core.settings.triggerSettings();
};

BAKEWELL.ui.window = {};
BAKEWELL.ui.window.notification = function(windowId, type, text, duration){

    function closeNotification(){ 
                $('#'+windowId + ' .window-notification').transition('scale out');
                $('#'+windowId + ' .window-notification').removeClass('active');

            }
    
    if(!$('#'+windowId + ' .window-notification').hasClass('active')){
    $('#'+windowId + ' .window-notification').addClass(type);
    $('#'+windowId + ' .window-notification').addClass('active');
    $('#'+windowId + ' .window-notification').text(text);
    $('#'+windowId + ' .window-notification').transition({
        animation: 'scale in',
        onComplete: function(){
            setTimeout(closeNotification, duration);
        }
    });
    
    }
}


//BAKEWELL.init function
BAKEWELL.init = function(){
    console.log('BAKEWELL --- V1.0 pre alpha (c) Alex Harwood 2017, MIT');
    BAKEWELL.core.logging.screenLog('BAKEWELL --- V1.0 pre alpha (c) Alex Harwood 2017, MIT');
    BAKEWELL.core.logging.screenLog('Initiated logging');
    BAKEWELL.background.common.stateCheck();
    BAKEWELL.core.network.checkState($('.screen-logger-wrap .network-state'));
    BAKEWELL.core.settings.init();
    BAKEWELL.core.handleDesktop();
};

    