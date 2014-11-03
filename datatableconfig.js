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
		$configImporterForm = $("#config-importer-form"),
		$configImporterCancelButton = $configImporterForm.find("input.cancel"),
		$configHolder = $("#config-holder"),
		$dataSourceImportButton = $("#dataSourceImporter"),
		$columnNameField = $("#column-name-field"),
		$columnEntryContainer = $("#column-entry-container"),
		$darkScreen = $("#dark-screen"),
		$configOutput = $("#config-output"),	
		output = {},
		columns = [],
		columnCreationIndex = 0;

	hljs.highlightBlock($configOutput[0]);
	listen();

	function listen(){
		$dataTableConfigForm.submit(generateConfiguration);
		$dataSourceImportButton.click(dataSourceImporter);
		$configImporterButton.click(showConfigImportForm);
		$configImporterCancelButton.click(hideConfigImportForm);
		$configImporterForm.submit(importConfig);
	}

	function generateConfiguration(event){
		event.preventDefault();
		output = $dataTableConfigForm.serializeObject();
		updateOutputView();
	}

	function updateOutputView(){
		$configOutput.html(JSON.stringify(output,undefined,4));
		hljs.highlightBlock($configOutput[0]);
	}

	function dataSourceImporter(){
		event.preventDefault();
		var dataSourceConfig = $("fieldset[name='dataSource']").serializeObject();
		if(dataSourceConfig.dataSource.type==="sharepoint")
			importFromSharePoint(dataSourceConfig.dataSource.sharepoint);
	}

	function importFromSharePoint(config){
		for(var item in config){
			if(config[item]==="")
				return;
		}
		$.support.cors = true;
		$.getJSON("http://pantheon.app.www-dev.kent.ac.uk/ama56/api.kent/public/v1/sharepointlists?jsonp=?",
		config, extractColumns);
	}

	function extractColumns(data){
		data = $.parseJSON(data);
		columns = [];
		for(var columnName in data[0]){
			columns.push(columnName);
		}
		fillSelectFields();
	}

	function fillSelectFields(){
		var options = "";
		for(var i=0; i<columns.length; i++){
			options += "<option>" + columns[i] + "</option>";
		}
		$("fieldset[name='columns'] select").each(function(){
			$(this).html(options);
		});
	}

	function showConfigImportForm(){
		$darkScreen.fadeIn();
	}

	function hideConfigImportForm(){
		$configHolder.html("")
		$darkScreen.fadeOut();
	}

	function importConfig(event){
		event.preventDefault();
		var input = $configHolder.val(), json;
		try{
			json = $.parseJSON(input);			
			hideConfigImportForm();
			populateForm(json);
		}
		catch(e){
			alert("Bad input!");
			return;
		}		
	}

	function populateForm(inputData, keyString){
		keyString = keyString || "";
		var keyStringBackup;

		for(var key in inputData){
			var value = inputData[key];
			var keyStringBackup = keyString;
			if(keyString==="")
				keyString = key;					
			else
				keyString += "[" + key + "]";
			if(Array.isArray(value)){
				keyString += "[]";
				fillValues(keyString, value);
			}
			else if(typeof value === "string"){
				fillValues(keyString, value);
			}
			else if(typeof value === "object" && value!==null){
				populateForm(value, keyString);				
			}
			keyString = keyStringBackup;
		}
	}

	function fillValues(name, value){
		$("input[name='"+name+"'], select[name='"+name+"']").each(function(){
			fillFieldByType(this, value);
		});
	}

	function fillFieldByType(field, value){
		var $field = $(field);
		if($field.is("input")){
			var type = $field.attr("type");
			if(type==="checkbox" || type==="radio"){				
				if(Array.isArray(value)){
					$field.attr({checked:true});
					for(var i=0; i<value.length; i++){
						if($field.val()===value[i])
							break;
					}
					$field.attr({checked:false});
				}
				else
					$field.attr({checked:true});
			}
			else if(type==="text"){
				$field.val(value);
			}
		}
		else if($field.is("select")){
			$field.val(value);
		}
	}
}