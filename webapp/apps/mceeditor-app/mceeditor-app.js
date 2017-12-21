'use strict'
var appId = "mceeditor-app";

$('.ui-window').removeClass('active');

var jsRef = '<script src="webapp/apps/mceeditor-app/core/tinymce.min.js"></script>';
$('body').append(jsRef);

//Function for the app's main process / logic (kept in global process object). Removed from memory when the app is closed.
BAKEWELL.appProccess[appId] = function(){
    
     $('#' + appId + ' .ui.dropdown').dropdown({
        action: 'hide'
   });
   
  tinymce.init({
  selector: 'textarea.mceeditor-app',
  height: '70vh',
  theme: 'modern',
  plugins: [
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
  ],
  toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
  image_advtab: true,
  templates: [
    { title: 'Test template 1', content: 'Test 1' },
    { title: 'Test template 2', content: 'Test 2' }
  ],
  content_css: [
    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
    '//www.tinymce.com/css/codepen.min.css'
  ]
 });           
           
}

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