/**
 * Swap to input field function
 */
function swapToInputHandler(){	
	return function(event) {
		if(jQuery(this).closest(".editing").length == 0) {
			jQuery(".icon-remove").click();

			//Clean up
			jQuery(".tooltip").remove();
			jQuery(this).find(".tooltip-icon").remove();
			jQuery("#backup").remove()

			var editItem = jQuery(this);
			
			var value = jQuery.trim(escapeQuotes(editItem.text()));
						
			var checkValue = value.replace(/\t/g,"");
			checkValue = checkValue.replace(/\n/g,"");
			checkValue = checkValue.replace(/\r/g,"");
			checkValue = checkValue.replace(" ","");
			if(checkValue=="none" || checkValue=="null"){
				value="";
				jQuery("body").append('<div id="backup"></div>')
			} else {
				//Make back up info			
				jQuery("body").append('<div id="backup">'+editItem.html()+'</div>')
			}

			if(editItem.hasClass("textarea")) {
				//Text Areas
				editItem.replaceWith('<div id="'+editItem.attr("id")+'" class="editing textarea"><textarea class="field" textarea">'+value+'</textarea><br /><i class="icon-remove" title="cancel"></i>&nbsp<i class="icon-ok" title="commit"></i></div>');
				
			} else if(editItem.hasClass("select")) {
				//Select Drop Downs
				var selectCode = '<div id="'+editItem.attr("id")+'" class="editing select">';
				selectCode += jQuery("#"+editItem.attr("id")+"Options").html();
				selectCode += '<br /><i class="icon-remove" title="cancel"></i>&nbsp<i class="icon-ok" title="commit"></i></div>';
				editItem.replaceWith(selectCode);
				jQuery("#"+editItem.attr("id")+" .field option").each(function(){
					if(jQuery(this).text()==value){
						jQuery(this).attr("selected","selected");
					}
				})
				
			} else if(editItem.hasClass("autocomplete")) { 
				// Autocomplete fields
				var selectCode = '<div id="'+editItem.attr("id")+'" class="editing autocomplete">';
				selectCode += jQuery("#"+editItem.attr("id")+"Options").html();
				selectCode += '<br /><i class="icon-remove" title="cancel"></i>&nbsp<i class="icon-ok" title="commit"></i></div>';
				editItem.replaceWith(selectCode);
				
				jQuery("#"+editItem.attr("id")+" .field").val(value);
				
			} else {
				//Input Fields
				editItem.replaceWith('<div id="'+editItem.attr("id")+'" class="editing"><input class="field" type="text" value="'+value+'" /><br /><i class="icon-remove" title="cancel"></i>&nbsp<i class="icon-ok" title="commit"></i></div>');
			}			

			event.stopPropagation();
		}
	}
}

/**
 * This function swaps the committee member content
 * into editable fields.
 */
function editCommitteeMemberHandler(){	
	return function(event){
		if(jQuery(this).closest(".editing").length == 0) {
			jQuery(".icon-remove").click();

			//Clean up
			jQuery(".tooltip").remove();
			jQuery(this).find(".tooltip-icon").remove();
			jQuery("#backup").remove();

			//Backup
			jQuery("body").append('<div id="backup">'+jQuery(this).html()+'</div>');

			var memberId = jQuery(this).parent("li").attr("class");		
			var firstName = jQuery.trim(escapeQuotes(jQuery(this).find(".firstName").text()));
			var lastName = jQuery.trim(escapeQuotes(jQuery(this).find(".lastName").text()));
			var middleName = jQuery.trim(escapeQuotes(jQuery(this).find(".middleName").text()));

			var chair = (jQuery(this).find(".chair").text()=="chair");
			var checked = "";
			if(chair){
				checked = 'checked="checked"';
			}

			var markup = '<div class="editing"><table>';
			markup += '<tr><td><b>Last Name</b></td><td><b>First Name</b></td><td><b>Middle Name</b></td><td></td></tr>'
				markup += '<tr>'
					markup += '<td><input id="memberId" class="hidden" type="hidden" value="'+memberId+'" />';
			markup += '<input id="cmLastName" class="span2" type="text" value="'+lastName+'" /></td>';
			markup += '<td><input id="cmFirstName" class="span2" type="text" value="'+firstName+'" /></td>';
			markup += '<td><input id="cmMiddleName" class="span2" type="text" value="'+middleName+'" /></td>';
			markup += '<td><input id="chair" type="checkbox" class="checkbox" '+checked+' > chair</input></td>';
			markup += '</tr>';
			markup += '</table><div style="padding:5px;"><a class="btn btn-danger btn-mini remove-committee-member" style="margin-right:10px;">delete</a>&nbsp;<i class="icon-remove" title="cancel"></i>&nbsp;<i class="icon-ok" title="commit"></i></div></div>';

			jQuery(this).replaceWith(markup);

			event.stopPropagation();
		}
	}
}

/**
 * This function adds fields to add a new committee member.
 */
function addCommitteeMemberHandler(){
	return function(event) {
		if(jQuery(this).closest(".editing").length == 0) {
			jQuery(".icon-remove").click();

			//Clean up
			jQuery(".tooltip").remove();
			jQuery(this).find(".tooltip-icon").remove();
			jQuery("#backup").remove();

			var markup = '<li class="add"><div class="editing"><table>';
			markup += '<tr><td><b>Last Name</b></td><td><b>First Name</b></td><td><b>Middle Name</b></td><td></td></tr>'
				markup += '<tr>'
					markup += '<td><input id="cmLastName" class="span2" type="text" /></td>';
			markup += '<td><input id="cmFirstName" class="span2" type="text" /></td>';
			markup += '<td><input id="cmMiddleName" class="span2" type="text" /></td>';
			markup += '<td><input id="chair" type="checkbox" class="checkbox"> chair</input></td>';
			markup += '</tr>';
			markup += '</table><i class="icon-remove" title="cancel"></i>&nbsp<i class="icon-ok" title="commit"></i></div></li>';

			jQuery(markup).insertBefore('#add_new_member');

			event.stopPropagation();
		}
	}
}

/**
 * This function commits changes for the currently
 * edited field.
 * 
 * @param eventTarget (The reference element)
 * @param jsonURL (The method to update generic items)
 * @param graduationURL (The method to update graduation semester)
 * @param committeeURL (The method to update committee members)
 * @param subId (The submission id)
 */
function commitChangesHandler(eventTarget, jsonURL, committeeURL, subId){
	var classValue = '';
	var fieldItem;
	var parent = eventTarget.parent();
	
	if(jQuery(".editing").hasClass("textarea")){
		classValue = classValue + 'textarea ';
		fieldItem = jQuery(".editing textarea");
	} else if(jQuery(".editing").hasClass("select")){
		classValue = classValue + 'select ';
		fieldItem = jQuery(".editing select");
	} else if(jQuery(".editing").hasClass("autocomplete")){
		classValue = classValue + 'autocomplete ';
		fieldItem = jQuery(".editing input");
	} else {
		fieldItem = jQuery(".editing input");
	}
	var id=jQuery(".editing").attr("id");
	var theValue;
	if(fieldItem.val()){
		theValue = fieldItem.val();
	}
	
	var committeeMember;
	var committeeFirstName;
	var committeeLastName;
	var committeeMiddleName;
	var committeeChair;
	var committeeId;
	
	if(eventTarget.closest("#committeeMembers").length){
		committeeMember = true;
		committeeFirstName = jQuery("#cmFirstName").val();
		committeeLastName = jQuery("#cmLastName").val();
		committeeMiddleName = jQuery("#cmMiddleName").val();
		committeeChair = jQuery("#chair").is(':checked');
		committeeId = jQuery("#memberId").val();
	}
	
	jQuery(".editing").replaceWith('<div class="'+id+' progress progress-striped active"><div class="bar" style="width:100%"></div></div>');
	
	if(committeeMember) {
		jQuery.ajax({
			url:committeeURL,
			data:{
				id:committeeId,
				firstName:committeeFirstName,
				lastName:committeeLastName,
				middleName:committeeMiddleName,
				chair:committeeChair
			},
			dataType:'json',
			type:'POST',
			success:function(data){	
				if(data.success){
					markup = '<div class="editCommitteeMember">';
					markup += '<span class="lastName">'+data.lastName+'</span><span class="seperator">,&nbsp;</span>';
					markup += '<span class="firstName">'+data.firstName+'&nbsp;</span>';
					markup += '<span class="middleName">'+data.middleName+'&nbsp;</span>';						
					if(data.chair=="true"){
						markup += '<span class="chair label label-info">';
						markup += 'chair';
						markup += '</span>';
					}
					markup += '</div>';
					
					jQuery("li."+data.id).html(markup);
				} else {
					markup = '<div class="editCommitteeMember">';
					markup += '<span class="lastName">'+data.lastName+'</span><span class="seperator">,&nbsp;</span>';
					markup += '<span class="firstName">'+data.firstName+'&nbsp;</span>';
					markup += '<span class="middleName">'+data.middleName+'&nbsp;</span>';						
					if(data.chair=="true"){
						markup += '<span class="chair label label-info">';
						markup += 'chair';
						markup += '</span>';
					}
					markup += '<span><a href="#" class="tooltip-icon" rel="tooltip" title="'+data.message+'"><span class="badge badge-important"><i class="icon-warning-sign icon-white"></i></span></a></span>';
					markup += '</div>';
					
					jQuery("li."+data.id).html(markup);
					jQuery('.tooltip-icon').tooltip();
				}
			},
			error:function(){
				jQuery("div."+id).replaceWith('<span id="'+id+'" class="error '+classValue+'">'+jQuery("#backup").html()+' <a href="#" class="tooltip-icon" rel="tooltip" title="There was an error with your request."><div class="badge badge-important"><i class="icon-warning-sign icon-white"></i></div></a></span>');
				jQuery('.tooltip-icon').tooltip();
			}
			
		});
	} else {
		jQuery.ajax({
			url:jsonURL,
			data:{
				subId:subId,
				field:id,
				value:theValue
			},
			dataType:'json',
			type:'POST',
			success:function(data){
				var currentValue;
				if(data.value){
					currentValue = nl2br(data.value);
				} else {
					currentValue = "none";
					classValue = classValue + 'empty ';
				}
				
				if(data.success){
					jQuery("div."+id).replaceWith('<span id="'+id+'" class="'+classValue+'"><i class="icon-pencil"></i> '+currentValue+'</span>');
					if(data.degreeLevel != null){
						jQuery("#degreeLevel").text(data.degreeLevel);
						jQuery("#degreeLevel").removeClass("empty");
					}
				} else {
					jQuery("div."+id).replaceWith('<span id="'+id+'" class="error '+classValue+'"><i class="icon-pencil"></i> '+currentValue+' <a href="#" class="tooltip-icon" rel="tooltip" title="'+data.message+'"><div class="badge badge-important"><i class="icon-warning-sign icon-white"></i></div></a></span>');
					jQuery('.tooltip-icon').tooltip();
				}
			},
			error:function(){
				jQuery("div."+id).replaceWith('<span id="'+id+'" class="error '+classValue+'">'+jQuery("#backup").html()+' <a href="#" class="tooltip-icon" rel="tooltip" title="There was an error with your request."><div class="badge badge-important"><i class="icon-warning-sign icon-white"></i></div></a></span>');
				jQuery('.tooltip-icon').tooltip();
			}
			
		});
	}	
	jQuery("#backup").remove();
}

/**
 * This function commits adding a new committee member.
 */
function commitNewCommitteeMemberHandler(id, jsonURL) {

	var committeeFirstName = jQuery("#cmFirstName").val();
	var committeeLastName = jQuery("#cmLastName").val();
	var committeeMiddleName = jQuery("#cmMiddleName").val();
	var committeeChair = jQuery("#chair").is(':checked');

	jQuery(".editing").replaceWith('<div class="progress progress-striped active"><div class="bar" style="width:100%"></div></div>');

	jQuery.ajax({
		url:jsonURL,
		data:{
			subId:id,
			firstName:committeeFirstName,
			lastName:committeeLastName,
			middleName:committeeMiddleName,
			chair:committeeChair
		},
		dataType:'json',
		type:'POST',
		success:function(data){	
			if(data.success){
				var markup = '<div class="editCommitteeMember">';
				markup += '<span class="lastName">'+data.lastName+'</span><span class="seperator">,&nbsp;</span>';
				markup += '<span class="firstName">'+data.firstName+'&nbsp;</span>';
				markup += '<span class="middleName">'+data.middleName+'&nbsp;</span>';						
				if(data.chair=="true"){
					markup += '<span class="chair label label-info">';
					markup += 'chair';
					markup += '</span>';
				}
				markup += '</div>';

				jQuery("li.add").html(markup);
				jQuery("li.add").addClass(data.id);
				jQuery("li.add").removeClass("add");					
			} else {
				var markup = '<div class="editing"><table>';
				markup += '<tr><td><b>Last Name</b></td><td><b>First Name</b></td><td><b>Middle Name</b></td><td></td></tr>'
					markup += '<tr>'
						markup += '<td><input id="cmLastName" class="span2" type="text" value="'+data.lastName+'" /></td>';
				markup += '<td><input id="cmFirstName" class="span2" type="text" value="'+data.firstName+'" /></td>';
				markup += '<td><input id="cmMiddleName" class="span2" type="text" value="'+data.middleName+'" /></td>';
				markup += '<td><input id="chair" type="checkbox" class="checkbox"';
				if(data.chair=="true"){
					markup += ' checked="true"';
				}
				markup += '> chair</input></td>';
				markup += '</tr>';
				markup += '</table><i class="icon-remove"></i>&nbsp<i class="icon-ok"></i>';					
				markup += '<span><a href="#" class="tooltip-icon" rel="tooltip" title="'+data.message+'"><span class="badge badge-important"><i class="icon-warning-sign icon-white"></i></span></a></span>';
				markup += '</div>';

				jQuery("li.add").html(markup);
				jQuery('.tooltip-icon').tooltip();
			}
		},
		error:function(){
			jQuery("li.add").replaceWith('<span class="error"><a href="#" class="tooltip-icon" rel="tooltip" title="There was an error with your request."><div class="badge badge-important"><i class="icon-warning-sign icon-white"></i></div></a></span>');
			jQuery('.tooltip-icon').tooltip();
		}

	});
}

/**
 * This function calls the method to delete
 * a committee member.
 */
function removeCommitteeMemberHandler(jsonURL, element){

	var id = element.closest("li").attr("class");
	
	jQuery(".editing").replaceWith('<div class="progress progress-striped active"><div class="bar" style="width:100%"></div></div>');

	jQuery.ajax({
		url:jsonURL,
		data:{
			id:id
		},
		dataType:'json',
		type:'POST',
		success:function(data){	
			if(data.success){				
				jQuery("li."+data.id).remove();					
			} else {
				
			}
		},
		error:function(){			
			jQuery("li."+id).html('<span class="error"><a href="#" class="tooltip-icon" rel="tooltip" title="There was an error with your request."><div class="badge badge-important"><i class="icon-warning-sign icon-white"></i></div></a></span>');
			jQuery('.tooltip-icon').tooltip();
		}
	});
}

/**
 * This function cancels the currently edited field
 * and replaces the content with a backup stored in 
 * a hidden div (#backup)
 */
function cancelEditingHandler(){
	return function() {
		$this = jQuery(".icon-remove");
		if($this.closest(".add").length){
			jQuery(".add").remove();
		}else if($this.closest("#committeeMembers").length){

			var oldValue = jQuery("#backup").html();			
			var swap = jQuery(".editing");
			swap.removeClass("editing");
			swap.addClass("editCommitteeMember")
			swap.html(oldValue);			
		} else {
			var classValue = '';
			var fieldItem;
			if(jQuery(".editing").hasClass("textarea")){
				classValue = classValue + 'textarea ';
				fieldItem = jQuery(".editing textarea");
			} else if(jQuery(".editing").hasClass("select")){
				classValue = classValue + 'select ';
				fieldItem = jQuery(".editing select");
			} else if(jQuery(".editing").hasClass("autocomplete")) { 
				classValue = classValue + 'autocomplete';
				fieldItem = jQuery(".editing autocomplete");
			} else {
				fieldItem = jQuery(".editing input");
			}
			var id=jQuery(".editing").attr("id");
			
			var currentValue = jQuery("#backup").html();
			
			if(!currentValue){
				currentValue = '<i class="icon-pencil"></i> none';
				classValue += "empty ";
			}
			
			jQuery(".editing").replaceWith('<span id="'+id+'" class="'+classValue+'">'+currentValue+'</span>');
		}
		
		jQuery("#backup").remove();
	}
}

/**
 * Function to update custom actions.
 * 
 * @param url (The method to update custom actions)
 * @param id (The submission id)
 * @param action (The name of the input field)
 * @param value (The value of the input field)
 */
function updateCustomActionsHandler(url, id, action, value) {
	
	jQuery.ajax({
		url:url,
		data:{
			id:id,
			action:action,
			value:value
		},
		dataType:'json',
		type:'POST',
		success:function(data){
			
		},
		error:function(){
			alert("Error updating custom action.");
		}
	});
	
}

/**
 * Function to update Action Log table on the view page
 * after a change has been made to the submission object.
 * 
 * @param url (The method to update the Action Log Table)
 * @param id (The submission id)
 */
function updateActionLog(url, id){
	
	jQuery("#actionLog").addClass("waiting");
	
	jQuery.ajax({
		url:url,
		data:{
			id:id
		},
		dataType:'html',
		type:'POST',
		success:function(data){
			jQuery("#actionLog tbody").replaceWith(data);
			jQuery("#actionLog").removeClass("waiting");
		},
		error:function(){
			alert("Error refreshing Action Log Table.");
		}
		
	});
	
}

/**
 * Function to update the Left Column on the view page
 * after a change has been made to the submission object.
 * 
 * @param url (The method to update the Left Column)
 * @param id (The submission id)
 */
function updateLeftColumn(url, id){
	
	jQuery(".side-box").addClass("waiting");
	
	jQuery.ajax({
		url:url,
		data:{
			id:id
		},
		dataType:'html',
		type:'POST',
		success:function(data){
			jQuery("#left-column").html(data);
			jQuery(".side-box").removeClass("waiting");
		},
		error:function(){
			alert("Error refreshing Left Column.");
		}
		
	});
	
}

/**
 * Function to update the Header on the view page
 * after a change has been made to the submission object.
 * 
 * @param url (The method to update the Header)
 * @param id (The submission id)
 */
function updateHeader(url, id){
	jQuery("#mainHeader").addClass("waiting");
	
	jQuery.ajax({
		url:url,
		data:{
			id:id
		},
		dataType:'html',
		type:'POST',
		success:function(data){
			jQuery("#mainHeader").html(data);
			jQuery("#mainHeader").removeClass("waiting");
		},
		error:function(){
			alert("Error refreshing the Header");
		}
	})
}

/**
 * Function to set the value of the hidden input "special_value"
 * to the id of the button clicked. Then the parent form will be submitted.
 *
 * @param form (The form object to submit)
 * @param value (The value tied to the button clicked. Stored in the buttons Id attribute.)
 *
 */
function assignSpecialValueAndSubmit(form, value){
		form.find("input[name='special_value']").val(value);
		form.submit();	
}

/**
 * Function to toggle subject/comment fields when "email student" is selected
 * in the "add file" dialog box.
 */
function toggleAddFileEmailOptions(){
	if(jQuery("#add-file-modal input[name='email_student']:checked").length){
		jQuery("#add-file-email-options").slideDown(500);
	} else {
		jQuery("#add-file-email-options").slideUp(500);
	}
}

/**
 * Function to toggle the add file options.
 */
function toggleFileOptions(){
	return function(){
		var value = jQuery("#add-file-modal input[name='uploadType']:checked").val();
		var container = jQuery(this).next(".fileContainer");
		jQuery(".fileContainer").slideUp(500);		
		container.slideDown(500);				
	}
}