# dpc-febwidget

This is a sample widget to show Forms Experience Builder forms in an
IBM Connections Engagement Center widget.

## Quick Installation

```
Import the FEBWidgetForms.nitro_s file to your FEB server.
Create Form submissions using the above form.
Modify febWidget.js to point to the above form (find the TODO comment).
Upload febWidget.js to your EC server.
Add febWidget_add_to_custom.js to your custom.js.
Add the FEB widget to a page.
```

Note: This widget assumes that Forms Experience Builder is installed on the same server as IBM Connections.
If this is not the case for you, then you may need to modify the code to use a proxy or CORS or some
other technique to access your FEB server.

## Usage

Customize any EC page.  Click `Create Widget` and you'll see the FEB widget as an option.
Add it to your page, then go to edit mode and choose the form you want to render.

Please see the LICENSE file for license and copyright info. Specifically, please note that
this sample code is provided with NO WARRANTY! Please do not call IBM Support, as they will
not be able to help you.

## Detailed Installation

### FEB server

Import the form `FEBWidgetForms.nitro_s` into the FEB server. Make a note of its ID as you'll need it later.

Modify the access rights to this form so users of the widget can access it.  You may want to assign
"All Authenticated Users" the Initiator role.

The form has two fields: Form Name and Form URL.  For each form you want to
make available to the widget, create a submission with the name to be displayed and the URL to
that form.  The widget will query the FEB server for submissions based on this form.  It will display the results
filtered by whatever you type into the Form Name field in the widget.

### Engagement Center

A custom widget in Engagement Center has two parts: the first part is the JavaScript required to define
the three functions a widget has: render, edit, and save.  The second part is the registration of the
widget.  The first part can be in a separate file, but the second part must be in `custom.js`. In this sample,
the first part is found in `febWidget.js`, and the second in `febWidget_add_to_custom.js`.

Open the `febWidget.js` file in an editor.  Locate the URL in the Ajax call (around line 82). Edit
this URL to reflect the ID of the form you created above; you'll probably only need to change the ID.

Log on to Engagement Center as an administrator and click the Customize button. Upload the edited `febWidget.js`
file to the server.

Download the custom.js file from the server and open it in an editor.  You will need to paste in the
lines from `febWidget_add_to_custom.js` to it in the right spot, which is just after the `init` function.
You also want to add a line _in_ the `init` function to call the function you are pasting in.
It may look like this when you are done:

```
init : function() {
  XCC.require.s.contexts._.config.paths.embedded = "/xcc/rest/public/custom/CUSTOM-XCC-EE";			
  XCC.X.febWidget(); // this line is added to invoke the function below
},
// adding lines from febWidget_add_to_custom.js
febWidget: function() {

  function myCustomWidget(container$, widgetData) {
    ...

```

Upload your edited `custom.js` file to the server, and refresh the page. Click on Customize again
and then click Create Widget.  Find the new FEB Widget and add it as in the screen shot below.

![Add Widget](http://github.ibm.com/dcacy/dpc-febwidget/raw/master/images/add_widget.png)

The widget should be automatically added to the page. Hover your cursor over the top right corner
of the new widget and click on the hamburger menu which appears, as in the screen shot below.

![Edit Widget](http://github.ibm.com/dcacy/dpc-febwidget/raw/master/images/edit_widget.png)

If you did everything correctly, you should be able to configure the widget. Type a few characters
into the Form Name field (characters which you know are in at least one form name in FEB) and look
for results.  Provide a height for the form, and optionally customize the widget title. Click Save
when you are satisfied with your results, as in the screen shot below.

![Configure Widget](http://github.ibm.com/dcacy/dpc-febwidget/raw/master/images/configure_widget.png)

You should see your form render in the widget!

![Final result](http://github.ibm.com/dcacy/dpc-febwidget/raw/master/images/final.png)
