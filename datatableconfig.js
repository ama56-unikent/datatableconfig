function DataTableConfig(){
	var dataTableConfig = this,
		$columnInfoTemplate = $("#column-table-body-template fieldset"),
		output = {};

	hljs.highlightBlock($("#config-tool-output")[0]);
	listen();

	function listen(){
		$("#column-creator").click(function(event){
			event.preventDefault();
			var columnName = $("#column-field").val();
			if(columnName!==""){
				var $newEntry = $columnInfoTemplate.clone();
				$newEntry.attr({name:columnName});
				$newEntry.find("legend").html(columnName);
				$("#config-tool-column-wrapper").append($newEntry);
				$newEntry.find("input[name='remove']").click(function(event){
					event.preventDefault();
					$newEntry.remove();
				});
				$("#column-field").val("");
			}
		});

		$("#config-tool-form").submit(function(event){
			event.preventDefault();
			console.log($(this).serializeObject());
			output = {};
			$(this).find("fieldset.column-info").each(function(){
				output[$(this).attr("name")] = $(this).serializeObject();
			});
			var outputElem = $("#config-tool-output");
			outputElem.html(JSON.stringify(output, undefined, 4));
			hljs.highlightBlock(outputElem[0]);
		});

		$("#config-importer").click(function(event){
			event.preventDefault();
			var $darkScreen = $("#dark-screen");			
			var $importerForm = $("#config-importer-template").clone();
			$darkScreen.find("#pop-up").append($importerForm);
			$importerForm.show();
			$importerForm.submit(function(event){
				event.preventDefault();
				var $jsonTextArea = $(this).find("#column-info-json-import");
				var jsonStr = $jsonTextArea.val(),
					json;

				try{
					json = $.parseJSON(jsonStr);
				}
				catch(e){
					alert("Bad JSON!");
				}

				$darkScreen.fadeOut({
					complete: function(){
						if(json){
							createColumn(json);
							$("#config-tool-output").html(JSON.stringify(json, undefined, 4));
							hljs.highlightBlock($("#config-tool-output")[0]);
						}
						$importerForm.remove();
					}					
				});
			});
			$importerForm.find(".cancel").click(function(){
				$darkScreen.fadeOut({
					complete: function(){
						$importerForm.remove();
					}
				});
			});
			$darkScreen.fadeIn();
		});
	}

	function createColumn(data){
		$("#config-tool-column-wrapper").html("<legend>Columns</legend>");
		for(var columnName in data){
			var $newEntry = $columnInfoTemplate.clone();
			$newEntry.attr({name:columnName});
			$newEntry.find("legend").html(columnName);
			$("#config-tool-column-wrapper").append($newEntry);
			$newEntry.find("input[name='remove']")
				.click({columnEntry:$newEntry},function(event){
				event.preventDefault();
				event.data.columnEntry.remove();
			});
			var columnProps = data[columnName];
			for(var propName in columnProps){
				var propValue = columnProps[propName];
				$newEntry.find("input[name='"+propName+"']").each(function(){
					var type = $(this).attr("type");
					if(propValue==="true" && (type==="radio" || type==="checkbox"))
						$(this).prop({checked:true});
				});				
			}
		}
	}
}