$.extend(FormSerializer.patterns, {
  validate: /^[a-z][a-z0-9_-]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
  key:      /[a-z0-9_-]+|(?=\[\])/gi,
  named:    /^[a-z0-9_-]+$/i
});

function DataTableConfig(){
	var self = this,		
		$columnEntryTemplate = $("#column-entry-template fieldset"),
		$configImporterTemplate = $("#config-importer-template"),
		$dataTableConfigForm = $("#data-table-config-form"),
		$configImporterButton = $("#config-importer"),
		$columnNameField = $("#column-name-field"),
		$columnEntryCreateButton = $("#column-entry-creator"),
		$columnEntryContainer = $("#column-entry-container"),
		$configOutput = $("#config-output"),	
		output = {},
		columns = {},
		columnCreationIndex = 0;

	hljs.highlightBlock($configOutput[0]);
	listen();

	function listen(){
		$dataTableConfigForm.submit(generateConfiguration);
		$columnEntryCreateButton.click(generateColumnEntry);
	}

	function generateConfiguration(event){
		event.preventDefault();
		output = $dataTableConfigForm.serializeObject();
		output = runOnEachKey(output, extractLabel);
		updateOutputView();
	}

	function runOnEachKey(object, callback){
		var copy = {};
		for(var key in object){
			var value = object[key];
			if(value !== null && typeof value === 'object')
				value = runOnEachKey(value, callback);

			copy[callback(key)] = value;
		}
		return copy;
	}

	function extractLabel(name){
		var label = $("fieldset[name='"+name+"'] legend").html();
		if(label)
			return label;
		else
			return name;
	}

	function updateOutputView(){
		$configOutput.html(JSON.stringify(output,undefined,4));
		hljs.highlightBlock($configOutput[0]);
	}

	function generateColumnEntry(event){
		event.preventDefault();

		var columnName = $columnNameField.val();
		$columnNameField.val("");
		if(columnName==="" || columns[columnName]!==undefined)			
			return;

		var order = Object.keys(columns).length + 1,
			$columnElement = $columnEntryTemplate.clone(),
			identifier = "columnentry"+columnCreationIndex;

		$columnElement.attr({name:identifier});
		$columnElement.addClass(identifier);
		columnCreationIndex++;

		$columnElement.find("legend").html(columnName);
		$columnElement.find("input").not("input[type='button']").each(function(){
			var inputName = $(this).attr("name");
			if(inputName==="[order]")
				$(this).val(order);

			inputName = "columns[" + identifier +"]" + inputName;
			$(this).attr({name:inputName});
		});

		$columnEntryContainer.append($columnElement);
		$columnElement.find("input[name='remove']").click(removeColumn);
		$columnElement.find("input[name='moveUp']").click({"type":"up"}, moveColumn);
		$columnElement.find("input[name='moveDown']").click({"type":"down"}, moveColumn);

		columns[columnName] = {
			order: order,
			element: $columnElement[0]
		};
	}

	function removeColumn(event){

	}

	function moveColumn(event){
		
	}

	// function listen(){
	// 	$("#column-creator").click(function(event){
	// 		event.preventDefault();
	// 		var columnName = $("#column-field").val();
	// 		if(columnName!==""){
	// 			var $newEntry = $columnInfoTemplate.clone();
	// 			$newEntry.attr({name:columnName});
	// 			$newEntry.find("legend").html(columnName);
	// 			$("#config-tool-column-wrapper").append($newEntry);
	// 			$newEntry.find("input[name='remove']").click(function(event){
	// 				event.preventDefault();
	// 				$newEntry.remove();
	// 			});
	// 			$("#column-field").val("");
	// 		}
	// 	});

	// 	$("#config-tool-form").submit(function(event){
	// 		event.preventDefault();
	// 		console.log($(this).serializeObject());
	// 		output = {};
	// 		$(this).find("fieldset.column-info").each(function(){
	// 			output[$(this).attr("name")] = $(this).serializeObject();
	// 		});
	// 		var outputElem = $("#config-tool-output");
	// 		outputElem.html(JSON.stringify(output, undefined, 4));
	// 		hljs.highlightBlock(outputElem[0]);
	// 	});

	// 	$("#config-importer").click(function(event){
	// 		event.preventDefault();
	// 		var $darkScreen = $("#dark-screen");			
	// 		var $importerForm = $("#config-importer-template").clone();
	// 		$darkScreen.find("#pop-up").append($importerForm);
	// 		$importerForm.show();
	// 		$importerForm.submit(function(event){
	// 			event.preventDefault();
	// 			var $jsonTextArea = $(this).find("#column-info-json-import");
	// 			var jsonStr = $jsonTextArea.val(),
	// 				json;

	// 			try{
	// 				json = $.parseJSON(jsonStr);
	// 			}
	// 			catch(e){
	// 				alert("Bad JSON!");
	// 			}

	// 			$darkScreen.fadeOut({
	// 				complete: function(){
	// 					if(json){
	// 						createColumn(json);
	// 						$("#config-tool-output").html(JSON.stringify(json, undefined, 4));
	// 						hljs.highlightBlock($("#config-tool-output")[0]);
	// 					}
	// 					$importerForm.remove();
	// 				}					
	// 			});
	// 		});
	// 		$importerForm.find(".cancel").click(function(){
	// 			$darkScreen.fadeOut({
	// 				complete: function(){
	// 					$importerForm.remove();
	// 				}
	// 			});
	// 		});
	// 		$darkScreen.fadeIn();
	// 	});
	// }

	// function createColumn(data){
	// 	$("#config-tool-column-wrapper").html("<legend>Columns</legend>");
	// 	for(var columnName in data){
	// 		var $newEntry = $columnInfoTemplate.clone();
	// 		$newEntry.attr({name:columnName});
	// 		$newEntry.find("legend").html(columnName);
	// 		$("#config-tool-column-wrapper").append($newEntry);
	// 		$newEntry.find("input[name='remove']")
	// 			.click({columnEntry:$newEntry},function(event){
	// 			event.preventDefault();
	// 			event.data.columnEntry.remove();
	// 		});
	// 		var columnProps = data[columnName];
	// 		for(var propName in columnProps){
	// 			var propValue = columnProps[propName];
	// 			$newEntry.find("input[name='"+propName+"']").each(function(){
	// 				var type = $(this).attr("type");
	// 				if(propValue==="true" && (type==="radio" || type==="checkbox"))
	// 					$(this).prop({checked:true});
	// 			});				
	// 		}
	// 	}
	// }
}