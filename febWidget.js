/**
  Sample Forms Experience Builder widget
  *********************** IBM COPYRIGHT START  *********************************
 // @copyright(disclaimer)
 //
 // Licensed Materials - Property of IBM
 // 5724-L31
 // (C) Copyright IBM Corp. 2017. All Rights Reserved.
 //
 // US Government Users Restricted Rights
 // Use, duplication or disclosure restricted by GSA ADP Schedule
 // Contract with IBM Corp.
 //
 // DISCLAIMER OF WARRANTIES :
 //
 // Permission is granted to copy and modify this Sample code, and to
 // distribute modified versions provided that both the copyright
 // notice, and this permission notice and warranty disclaimer appear
 // in all copies and modified versions.
 //
 // THIS SAMPLE CODE IS LICENSED TO YOU "AS-IS".
 // IBM  AND ITS SUPPLIERS AND LICENSORS  DISCLAIM
 // ALL WARRANTIES, EITHER EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE,
 // INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES
 // OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT
 // WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR ANY DAMAGES ARISING
 // OUT OF THE USE OF  OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF
 // THE SAMPLE CODE, OR COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE.
 // IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE FOR ANY
 // LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL,
 // CONSEQUENTIAL,INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS
 // OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS
 // HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 //
 // @endCopyright
 //*********************** IBM COPYRIGHT END  ***********************************
  *
  * @author Darren Cacy (dcacy@us.ibm.com)
  * @depends jQuery
 *****************************************************************************/
(function ($, W) {
    "use strict";

		/**
			* called when the Widget is rendered.
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
  	  * @param  {[Object]} widgetData [The widget data]
			**/
    function myCustomWidget(container$, widgetData){
			var contents = 'Please edit this widget to select a Form.';
			// savedSettings will hold the configuration data
			var savedSettings = XCC.T.getXccPropertyByName(widgetData, "febWidgetConfig");
			// if savedSettings does not exist, use default values
			var febSettings = savedSettings ? JSON.parse(savedSettings.propValue) : {form:'',href:'',formHeight:''};
			if ( febSettings.href && febSettings.href.length > 0 ) {
				contents = '<iframe src="'
					+ febSettings.href
					+ '" height="' + febSettings.formHeight + '"'
					+ ' width="99%" style="border:none;"></iframe>';
			}
			container$.html(contents);
    }

		/**
			* Function which is called when the user edits the widget
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
			* @param  {[Object]} widgetData [The widget data]
			**/
    function myCustomEditor(container$, widgetData) {
			// get the saved settings, if any
			var savedSettings = XCC.T.getXccPropertyByName(widgetData, "febWidgetConfig");
			var febSettings = savedSettings ? JSON.parse(savedSettings.propValue) : {form:'',href:'',formHeight:''};
			// most of the work here is in fitting in to the jQuery-ui autocomplete which is all ready for us
			function autoCompleteForm(node$) {
				// options will be passed to the jQuery UI autocomplete function
				var options = {
					source: function(request, responseCallback) {
							var result = [];
							$.ajax({
									method: 'GET',
									// TODO: this url must be modified to point to the right form on your server
									url: '/forms/secure/org/data/4a7cf00d-1b8d-4b7d-89a3-f49b7fdd1a0f/F_Form1?F_SingleLine1__contains=' + request.term,
									headers: {
										'Accept': 'application/json'
									},
									dataType: "json"
								})
								.done(function( data ) {
									for (var i = 0; i < data.items.length; i++ ) {
											result.push({
												label: data.items[i].F_SingleLine1,
												href: data.items[i].F_SingleLine2,
												uuid: 1,
												pos: 1
											});
									}
									responseCallback(result);
							})
							.fail(function(err) {
								console.log('error getting list of forms:', err);
									responseCallback([]);
							});
					},
					select: function select(ignore, ui) {
						$('#formHref').val(ui.item.href);
					}
				};
					// act on the given input field
					node$.autocomplete(options);
			}

			// create some jQuery objects to render in the edit form
			var formLabel$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Form Name' +
							'</span></span>' +
							'<input value="' + febSettings.form + '" type="text" id="formName" class="form-control xccEllipsis ui-autocomplete-input formInput" autocomplete="off"></div></label>'),
					href$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">HREF' +
							'</span></span>' +
							'<input value="' + febSettings.href + '" type="hidden" name="formHref" id="formHref" class="form-control xccEllipsis" autocomplete="off"></div></label>').hide(),
					formHeight$ = $('<label><div class="input-group"><span class="input-group-addon"><span class="xccEllipsis" style="float: left;">Form Height' +
							'</span></span>' +
							'<input value="' + febSettings.formHeight + '" type="text" name="formHeight" id="formHeight" class="form-control xccEllipsis" autocomplete="off"></div></label>');

			var inputForForm$ = formLabel$.find(".formInput");


			// function bindEvents() {
			// 		autoCompleteForm(inputForForm$);
			// }
			(function callAutoComplete() {
					// bindEvents();
					autoCompleteForm(inputForForm$);
			}());


			var editFields = [XCC.U.createTextInputOnTheFly("Widget Title ", widgetData.title, "title"),
					$('<div class="input-group input-group-sm input-group-xs glue-prev"><span class="input-group-addon">ID / Type </span><span class="form-control xccEllipsis" title="' +
							widgetData.contentType +
							'">' +
							widgetData.name +
							' / ' +
							XCC.W.getLabel(widgetData.contentType) +
							'</span></div>'),
					XCC.U.createTextInputOnTheFly("Height", widgetData.height, "height"),
					formLabel$,
					href$,
					formHeight$
			];

			// convert array to object
			editFields = $($.map(editFields, function(el){return $.makeArray(el)}));

			// wait until the element with the class AdminUI exists, THEN render the edit fields
			container$.waitUntilExists(".AdminUI", function () {
					$(this).prepend(editFields);
			}, false);

    }

		/**
			* Called when the user clicks the Save button in edit mode
			* @param  {[jQuery Object]} container$ [the HTML container in the Widget.. ]
			* @param  {[Object]} widgetData [The widget data]
			**/
    function save(container$, widgetData) {
			// find the new values in the container and save them
			widgetData.title = container$.find("input[name=title]").val();
			widgetData.height = container$.find("input[name=height]").val();
			var theform = container$.find("input[id=formName]").val();
			var theHref = container$.find("input[id=formHref]").val();
			var formHeight = container$.find("input[id=formHeight]").val();
			var febWidgetConfig = {
				form: theform,
				href: theHref,
				formHeight: formHeight
			};
			// persist the values as a property of this widget
			XCC.T.setXccPropertyString(widgetData, "febWidgetConfig", JSON.stringify(febWidgetConfig));
    }

		/**
		 * Wait until a selector exists
		 */
    $.fn.waitUntilExists = function (selector, handler, shouldRunHandlerOnce, isChild) {
        var found = 'found',
            $this = $(selector),
            $elements = $this.not(function () {
                return $(this).data(found);
            }).each(handler).data(found, true);

        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[selector] =
                window.setInterval(function () {
                    $this.waitUntilExists(selector, handler, shouldRunHandlerOnce, true);
                }, 50);
        } else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[selector]);
        }
        return $this;
    };


		// this defines the above functions so they can be called from custom.js
    XCC.define([], function () {
      return {
          editor: myCustomEditor,
          widget: myCustomWidget,
          save: save
      };
    });

} (XCC.jQuery || jQuery, window));
