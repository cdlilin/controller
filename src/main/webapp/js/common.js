var timeout = true;
var userId = null;
var userName = null;
var roleType = null;
var currentRole = null;

var portal={
	common:{
		dialogmsg:{//portal.common.dialogmsg
			REQUESTSUCCESS:"操作成功",
			REQUESTFAIL:"请求发送失败",
			SYSYEMERROR:"系统发生异常",
			DATALOADFAIL:"数据加载失败",
			GETDATEFAIL:"获取当前日期失败",
			DATETIMEOVER:"你选择的时间跨度超过9周，请重新选择",
			DATEERROR:"请选择正确的时间范围"
		},
		tip:{//portal.common.tip
			APPNAMETEXT:" 应用名称不能为空，由中文、字母、数字、下划线组成，长度不能大于20",
			VERSIONTEXT:"版本不能为空，由数字和小数点组成，长度为3到10",
			APPDESCRIPIONTEXT:"应用描述长度不能大于500",
			SUBDOMAINTEXT:"二级域名仅允许由数字，字母组成，长度为4到18位."
		}
	},
	application:{//portal.application.dialogmsg
		dialogmsg:{
			ONLYONEAPP:"只能实施监控一个应用 !",
			CREATESUCESS:"创建应用基础信息成功",
			CREATEFAIL:"创建应用基础信息失败",
			UPLOADFAIL:"上传文件失败!",
			UPLOADERROR:"请先上传应用包,在编辑运行环境信息"
		},
		tip:{//portal.application.tip
			FILETEXT:"请上传应用包附件，且不能超过100M",
			VMSNUMVALIDATE:"虚拟机数量为必填项，输入为数字，范围：1~9",
			VMSNUMVALIDATE_2:"虚拟机数量为必填项，输入为数字，范围：1~9，必须小于弹性伸缩上限",
			UPLIMITVALIDATE:"弹性伸缩上限为必填项，输入为数字，范围：1~9",
			UPLIMITVALIDATE_2:"弹性伸缩上限必须大于弹性伸缩下限",
	
			MIGRATETEXT:"请选择需要迁移的应用."
		}
	},
	monitor:{
		dialogmsg:{//portal.monitor.dialogmsg
			SELECTSTRATEGY:"请选择监控策略!"
		},
		tip:{//portal.monitor.tip
			LABEL_STRATEGYEXPRESSION_T:"持续时间必须为正整数或0",
			LABEL_STRATEGYEXPRESSION_N:"阈值必须为正整数或0",
			LABEL_STRATEGYEXPRESSION:"请添加策略条件",
			LABEL_INPUT_STRATEGYDESCRIPT:"策略描述信息长度不能大于500",
			_LABEL_STRATEGYNAME:"策略名称由数字、字母、下划线组成长度不能大于100"
			
		}
	},
	resource:{
		dialogmsg:{//portal.resource.dialogmsg
			REQUESTSUCCESS:"创建安装包请求发送成功",
			REQUESTFAIL:"创建安装包请求发送失败",
			DELETEMIDDLESUCCESS:"删除安装包请求发送成功",
			DELETEMIDDLEFAIL:"删除安装包请求发送失败",
			MIDDLESTARTSUCCESS:"安装包启动请求发送成功",
			MIDDLESTARTFAIL:"安装包启动请求发送失败",
			MIDDLESTOPSUCCESS:"安装包启动请求发送成功",
			MIDDLESTOPFAIL:"安装包启动请求发送失败",
			VMSUCCESS:"创建虚拟机规格请求发送成功",
			VMFAIL:"创建虚拟机规格请求发送失败",
			DELETENETSUCCESS:"删除网络资源请求发送成功",
			DELETENETFAIL:"删除网络资源请求发送失败",
		},
		tip:{//portal.resource.tip
			FITEM:"只能选择一个",
		}
	}
	
};



String.prototype.endWith=function(s){
	  if(s==null||s==""||this.length==0||s.length>this.length)
	     return false;
	  if(this.substring(this.length-s.length)==s)
	     return true;
	  else
	     return false;
	  return true;
	 };

 String.prototype.startWith=function(s){
  if(s==null||s==""||this.length==0||s.length>this.length)
   return false;
  if(this.substr(0,s.length)==s)
     return true;
  else
     return false;
  return true;
 };
	 
function initInfo(path){
	jQuery.ajaxSetup ({cache:false,
		dataFilter:function (data, type) {
//			alert(data.toString());
			if(data.indexOf('"type":"login"') <= -1){
				$.ajax({
					url : path+"rest/login",
					type : 'GET',
					async: false,
					success : function(result){
//						alert(result.timeout);
						if(result.timeout=="true"){
							location.reload();
						}
					},
					error : function(error){
					}
				});	
			}
		    // 对Ajax返回的原始数据进行预处理
		    return data ; // 返回处理后的数据
		}});
	
	initSessionInfo(path);
	
	$("#login_popup_div").keydown(function(event){
		if(event.keyCode == 13){
			_login(path);
			return false;
		}
	});
	
	$("#login_popup_btn").click(function(){
		_login(path);
	});
	
	$("#choose_type_1").click(function(){
		_chooseRoleType(1,path);
	});
	
	$("#choose_type_0").click(function(){
		_chooseRoleType(0,path);
	});
}
//获取session信息
function initSessionInfo(path){
	$.ajax({
		url : path+"rest/login",
		type : 'GET',
		async: false,
		success : function(result){
//			alert("timeout:"+result.timeout);
			if(result.timeout=="true"){
				timeout = true;
				showLoginDiv(result.current_role);
			}else{ 
				timeout = false;
				userId = result.user_id;
				userName = result.user_name;
				roleType = result.role_type;
				currentRole = result.current_role;
			}
		},
		error : function(error){
		}
	});
}

$(function(){
	var common_message_modal_div_str="<!-- Error Button trigger modal -->"
		+"<a id='btn_common_errorMessageModal' data-toggle='modal' href='#commonErrorModal' class='btn btn-primary btn-lg' style='display:none'>Error</a>"
		+"<!-- Modal -->"
		+" <div class='modal fade' id='commonErrorModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
		+"    <div class='modal-dialog'>"
		+"      <div class='modal-content'>"
		+"      <div class='modal-header'>"
		+"        <button id='btn_common_errorMessageModal_close' type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
		+"        <h4 class='modal-title'>操作失败</h4>"
		+"      </div>"
		+"      <div class='modal-body'>"
		+"        <div class='alert alert-block alert-danger'>"
		+"      <h4>您有一个错误消息!</h4>"
		+"      <p><label id='common_errorModalMessage_text'></label></p>"
		+"    </div>"
		+"      </div>"
		+"    <div class='modal-footer'>"
		+"      <button type='button' id='btn_common_errorMessageModal_confirm' class='btn btn-warning' data-dismiss='modal'>确定</button>"
		+"    </div>"
		+"    </div><!-- /.modal-content -->"
		+"  </div><!-- /.modal-dialog -->"
		+"  </div><!-- /.modal -->"
		+"<!-- Success Button trigger modal -->"
		+"  <a id='btn_common_successMessageModal' data-toggle='modal' href='#commonSuccessMessageModal' class='btn btn-primary btn-lg' style='display:none'>Success</a>"
		+"<!-- Modal -->"
		+"  <div class='modal fade' id='commonSuccessMessageModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
		+"  <div class='modal-dialog'>"
		+"    <div class='modal-content'>"
		+"      <div class='modal-header'>"
		+"        <button id='btn_common_successMessageModal_close' type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
		+"        <h4 class='modal-title'>操作成功</h4>"
		+"      </div>"
		+"      <div class='modal-body'>"
		+"        <div class='alert alert-block alert-success'>"
		+"      <h4>您有一个成功消息!</h4>"
		+"      <p><label id='common_successModalMessage_text'></label></p>"
		+"    </div>"
		+"      </div>"
		+"    <div class='modal-footer'>"
		+"      <button type='button' id='btn_common_successMessageModal_confirm' class='btn btn-warning' data-dismiss='modal'>确定</button>"
		+"    </div>"
		+"    </div><!-- /.modal-content -->"
		+"  </div><!-- /.modal-dialog -->"
		+"</div><!-- /.modal -->      ";
	
	$("body").append(common_message_modal_div_str);
	
	var common_login_div_str = "<!-- 登录框 -->"
		+ "<div class='modal fade' id='login_popup_div' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
		+ "	<div class='modal-dialog' style='width:420px; margin-top:40px;'>"
		+ "		<div class='modal-content'>"
		+ "			<div class='modal-header' style='padding:10px 15px;'>"
		+ "				<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
		+ "				<h4 class='modal-title'><span id='_login_title'>您尚未登陆</span></h4>"
		+ "			</div>"
		+ "		<div class='panel-body row' style=' padding:20px 15px;'>"
		+ "		  <div id='_login_div'>"
		+ "			<div class='row'>"
		+ "				<div class='modal_login'>"
		+ "                 <p style='margin-bottom:5px;'>用户名:</p>"
		+ "					<input type='text' class='form-control'  placeholder='' id='_user_name' style='padding: 4px 30px 4px 12px;'>"
		+ "					<i class='fa fa-user modal_i'></i>"
		+ "				</div>"
		+ "			</div>"
		+ "			<div class='row' >"
		+ "				<div class='modal_login'>"
		+ "                 <p style='margin-bottom:5px;'>密码:</p>"
		+ "					<input type='password' class='form-control'  placeholder='' id='_password' style='padding: 4px 30px 4px 12px;'>"
		+ "					<i class='fa fa-unlock-alt modal_i' style='font-size:18px;'></i>"
		+ "				</div>"
		+ "			</div>"
		+ "			<div id='_msg_div' class='alert alert-danger' style='margin:10px auto;width:200px;height:26px;line-height:26px;font-size:10px;padding-top:0px;display:none; '></div>"	
		+ "			<div class='row'>"
		+ "				<div class='modal_login' style='margin:10px auto;'>"
		+ "					<a type='button' class='btn btn-primary' style='display:block;' id='login_popup_btn' >登&nbsp;&nbsp;&nbsp;录</a>"
		+ "				</div>"
		+ "			</div>"
		+ "		  </div>"
		+ "		  <div class='login_input2 btn-display' id='_chooserole_div' style='display:none'>"
		+ "         <div class='row'>"
		+ "			<div class='col-md-12 col-sm-12  col-xs-12' style='margin-bottom:20px;'> <a id='choose_type_1' type='button' class='btn btn-default btn-big2' ><i class='fa fa-user'></i>管理员</a></div>"	
		+ "			<div class='col-md-12 col-sm-12  col-xs-12' > <a id='choose_type_0' type='button' class='btn btn-primary btn-big2' ><i class='fa fa-user-md'></i>用&nbsp;&nbsp;户</a> </div>"		
        + "       </div>"
		+ "		  </div>"
		+ "		</div>"
		
		+ "	</div>"
		+ "</div>";
	
	$("body").append(common_login_div_str);
	
	var common_confirm_div_str = ""
		+ "<div class='modal fade' id='_confirm_div' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"
		+ "	<div class='modal-dialog'>"
		+ "		<div class='modal-content'>"
		+ "			<div class='modal-header'>"
		+ "				<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
		+ "				<h4 class='modal-title' id='_confirm_title'></h4>"
		+ "			</div>"
		+ "		<div class='panel-body row'>"
		+ "			<p class='blue' style='text-align:center; font-size:17px; margin:10px 0 0 0;' id='_confirm_content'></p>"
		+ "		</div>"
		+ "		<div class='modal-footer'>"
		+ "			<button type='button' class='btn btn-primary' data-dismiss='modal' id='_confirm_btn'>确定</button>"
		+ "			<a type='button' class='btn btn-warning' data-dismiss='modal'>取消</a> </div>"
		+ "		</div>"
		+ "	</div>"
		+ "</div>";
	
	$("body").append(common_confirm_div_str);
});


function showErrorDialog(errorMessage) {
	$("#common_errorModalMessage_text").text(errorMessage);
	$("#btn_common_errorMessageModal").click();
};



function showSuccessDialog(successMessage) {
	$("#common_successModalMessage_text").text(successMessage);
	$("#btn_common_successMessageModal").click();
};


function showSuccessDialogWithFunc(successMessage, methodName) {
	$("#btn_common_successMessageModal_confirm").bind("click",methodName);
	$("#btn_common_successMessageModal_close").bind("click",methodName);
	$("#common_successModalMessage_text").text(successMessage);
	$("#btn_common_successMessageModal").click();
};

function showErrorDialogWithFunc(successMessage, methodName) {
	$("#btn_common_errorMessageModal_confirm").bind("click",methodName);
	$("#btn_common_errorMessageModal_close").bind("click",methodName);
	
	$("#common_errorModalMessage_text").text(successMessage);
	$("#btn_common_errorMessageModal").click();
};

function showLoginDiv(current_role){
	if(current_role==2){
		$("#_login_div").hide();
		$("#_login_title").empty();
		$("#_login_title").append("请选择角色类型");
		$("#_chooserole_div").show();
	}
	
	$("#login_popup_div").modal("show");
}

function showConfirmDiv(title,content){
	$("#_confirm_title").empty();
	$("#_confirm_title").append(title);
	$("#_confirm_content").empty();
	$("#_confirm_content").append(content);
	
	$("#_confirm_div").modal('show');
}

function _login(path){
	var _userName = $("#_user_name").val();
	var _password = $("#_password").val();
	var json = '{'
			 + '"user_name":' + '"' + _userName +'",'
			 + '"password":' + '"' + _password +'"'
			 + '}';
//	alert("url:"+url);
	if(_checkInput(_userName,_password)){
		$.ajax({
			url : path+'rest/login',
			type : 'post',
			data : json,
			async: false,
			success : function(result){
//				alert(result.success);
				if(result.success){
					switch(result.role_type){
						case -1: 
							$("#_chooserole_div").hide();
							$("#_login_div").show();
							showDivById("msg_div",result.message);
							break;
						case 0:
							top.location.reload();
							break;
						case 1: 
							top.location.reload();
							break;
						case 2: 
							$("#_login_div").hide();
							$("#_login_title").empty();
							$("#_login_title").append("请选择角色类型");
							$("#_chooserole_div").show();
							break;
					}
				}else{
					showDivById("_msg_div",result.message);
					return;
				}
			},
			error : function(error){
				showDivById("_msg_div","登录出错，请稍后重试...");
			}
		});
	}
}

function _checkInput(userName,password){
	if(isEmpty(userName) || isEmpty(password)){
		showDivById("_msg_div","请输入用户名和密码");
		return false;
	}
	$("#_msg_div").hide();
	return true;
}

function _chooseRoleType(type,path){
	$.ajax({
		url : path+'rest/login/'+type,
		type : 'get',
		success : function(result){
			if(result.success){
				top.location.reload();
			}else{
				$("#_chooserole_div").hide();
				$("#_login_div").show();
				$("#_user_name").val("");
				$("#_password").val("");
				showDivById("msg_div",result.message);
			}
		},
		error : function(error){
			showDivById("msg_div","登录出错，请稍后重试...");
		}
	});
}
