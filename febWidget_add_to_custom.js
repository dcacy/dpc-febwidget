febWidget: function() {

  function myCustomWidget(container$, widgetData) {
    XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
      febWidget.widget(container$, widgetData);
    });
  }

  function myCustomEditor(container$, widgetData) {
    XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
      febWidget.editor(container$, widgetData);
    });
  }

  function save(container$, widgetData) {
    XCC.require(["/xcc/rest/public/custom/febWidget.js"], function(febWidget) {
      febWidget.save(container$, widgetData);
    });
  }
  XCC.W.registerCustomWidget("FEB Widget", "table", myCustomWidget, myCustomEditor, save);
}
