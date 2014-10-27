$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

function DataTableConfig(){
	var dataTableConfig = this,
		$columnInfoTemplate = $("#column-table-body-template fieldset"),
		output = {};

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
			output = {};
			$(this).find("fieldset.column-info").each(function(){
				output[$(this).attr("name")] = $(this).serializeObject();
			});
			$("#config-tool-output").html(JSON.stringify(output, undefined, 4));
		});

		$("#config-importer").click(function(event){
			event.preventDefault();
			var $jsonTextArea = $("#column-info-json-import");
			var jsonStr = $jsonTextArea.val(),
				json;

			try{
				json = $.parseJSON(jsonStr);
			}
			catch(e){
				alert("Bad JSON!");
			}

			if(json){
				createColumn(json);
				$("#config-tool-output").html(JSON.stringify(json, undefined, 4));
			}
			$jsonTextArea.val("");
		});
	}

	function createColumn(data){
		$("#config-tool-column-wrapper").html("");
		for(var columnName in data){
			var $newEntry = $columnInfoTemplate.clone();
			$newEntry.attr({name:columnName});
			$newEntry.find("legend").html(columnName);
			$("#config-tool-column-wrapper").append($newEntry);
			$newEntry.find("input[name='remove']").click(function(event){
				event.preventDefault();
				$newEntry.remove();
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