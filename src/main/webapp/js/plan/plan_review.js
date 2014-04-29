/**
 * 路局审核界面
 * 
 * @author denglj 
 */
var PlanReViewPage = function(){
	var _self = this;
	
	//获取当期系统日期
	this.currdate =function(){
		var d = new Date();
		var year = d.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = d.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var days = d.getDate(); 
		return year+"-"+month+"-"+days;
	};
	
	
	this.initPage = function() {
		//1.初始化日期控件值
		_plan_review_selectdate.datepicker();
		_plan_review_selectdate.val(this.currdate());//获取当期系统日期
		
		//2.初始化路局下拉控件值
		this.initLjSelectValue();
		
	};
	
	
	//2.初始化路局下拉控件值
	this.initLjSelectValue = function() {
		_plan_review_select_lj.empty();//清除路局下拉控件值
		$.ajax({
			url : "../../plan/getFullStationInfo",
			cache : false,
			type : "GET",
			dataType : "json",
			contentType : "application/json",
			success : function(result) {
				if (result != null && result != "undefind" && result.code == "0") {
					if (result.data !=null) {
						$.each(result.data,function(n,ljObj){
							if (n==0) {
								_plan_review_select_lj.append('<option selected="selected" value="'+ljObj.ljqc+'">'+ljObj.ljjc+'</option>');
							} else {
								_plan_review_select_lj.append('<option value="'+ljObj.ljqc+'">'+ljObj.ljjc+'</option>');
							}
						});
						
						
						//2.加载路局汇总统计信息
						_self.loadFullStationTrains();
						
						//3.加载当天路局列车信息
						_self.loadTrainInfo(1);
					}
				} else {
					alert("接口调用返回错误，code="+result.code+"   message:"+result.message);
				}

			},
			error : function() {
				alert("接口调用失败");
//				showErrorDialog("请求发送失败");
//				showErrorDialog(portal.common.dialogmsg.REQUESTFAIL);
			}
		});
	};
	
	
	//加载路局开行计划统计信息
	this.loadFullStationTrains = function() {
		_plan_review_table_ljtjxx.find("tr:gt(1)").remove();//清除路局开行计划统计信息
		$.ajax({
			url : "../../plancheck/getOneStationTrains",
			cache : false,
			type : "POST",
			dataType : "json",
			contentType : "application/json",
			data :JSON.stringify({
				runDate : _plan_review_selectdate.val(),
				startBureauFull:_plan_review_select_lj.val()
			}),
			success : function(result) {
				console.log("111111111111111111111");
				console.dir(result);
				
				if (result != null && result != "undefind" && result.code == "0") {
					if (result.data !=null) {
						$.each(result.data,function(n,trainObj){
//							tr = $('<tr/>');
							var tr = $("<tr/>");
							tr.append("<td>"+trainObj.TOTAL+"</td>");
							
							tr.append("<td>"+trainObj.TOTAL+"</td>");
							tr.append("<td>"+trainObj.COUNTBEGIN+"</td>");
							tr.append("<td>"+trainObj.COUNTEND+"</td>");
							
							tr.append("<td></td>");
							tr.append("<td></td>");
							tr.append("<td></td>");

							tr.append("<td></td>");
							tr.append("<td></td>");
							tr.append("<td></td>");

							tr.append("<td></td>");
							tr.append("<td></td>");
							tr.append("<td></td>");

							tr.append("<td></td>");

							tr.append("<td></td>");
							_plan_review_table_ljtjxx.append(tr);
						});
					}
				} else {
					alert("接口调用返回错误，code="+result.code+"   message:"+result.message);
				}

			},
			error : function() {
				alert("接口调用失败");
//				showErrorDialog("请求发送失败");
//				showErrorDialog(portal.common.dialogmsg.REQUESTFAIL);
			}
		});
	};
	
	
	//查询xx日列车开行计划信息
	this.loadTrainInfo = function(_currentPage) {
		_plan_review_table_trainInfo.find("tr:gt(1)").remove();//清除车次详细信息列表所有数据
		_plan_review_table_trainDetail.find("tr:gt(0)").remove();//清除车次详细信息列表所有数据
		$.ajax({
			url : "../../plancheck/getPlanTrainByStartBureau",
			cache : false,
			type : "POST",
			dataType : "json",
			contentType : "application/json",
			data :JSON.stringify({
				runDate : _plan_review_selectdate.val(),
				trainNbr:_plan_review_input_trainNbr.val(),
				startBureau:_plan_review_select_lj.val(),
				currentPage:_currentPage,
				pageSize : _param_pageSize
			}),
			success : function(result) {
				if (result != null && result != "undefind" && result.code == "0") {
					if (result.data !=null) {
						var index=1;
						$.each(result.data.data,function(n,trainObj){
//							tr = $('<tr/>');
							var tr = $("<tr onclick=showTrainTimeDetail('"+trainObj.trainNbr+"')/>");
							tr.append("<td>"+index+"</td>");
							tr.append("<td>"+trainObj.trainNbr+"</td>");
							tr.append("<td>"+trainObj.startStn+"</td>");
							tr.append("<td>"+trainObj.startBureau+"</td>");
							tr.append("<td>"+trainObj.startTimeStr+"</td>");
							tr.append("<td>"+trainObj.endStn+"</td>");
							tr.append("<td>"+trainObj.endBureau+"</td>");
							tr.append("<td>"+trainObj.endTimeStr+"</td>");
							tr.append("<td></td>");
							_plan_review_table_trainInfo.append(tr);
							index = index+1;
						});
					}
				} else {
					alert("接口调用返回错误，code="+result.code+"   message:"+result.message);
				}

			},
			error : function() {
				alert("接口调用失败");
//				showErrorDialog("请求发送失败");
//				showErrorDialog(portal.common.dialogmsg.REQUESTFAIL);
			}
		});
	};
	
	
	
	
	/**
	 * 车次列表行点击事件
	 * 显示xx日车次详细信息
	 * @author 邓柳江
	 */
	self.showTrainTimeDetail = function (_trainNbr) {
		_plan_review_table_trainDetail.find("tr:gt(0)").remove();//清除车次详细信息列表所有数据
		$.ajax({
			url : "../../plancheck/showTrainTimeDetail",
			cache : false,
			type : "POST",
			dataType : "json",
			contentType : "application/json",
			data :JSON.stringify({
				runDate : _plan_review_selectdate.val(),
				trainNbr : _trainNbr
			}),
			success : function(result) {
				console.log("****************");
				console.dir(result);
				console.log("****************");
				
				if (result != null && result != "undefind" && result.code == "0") {
					if (result.data !=null) {
						var index=1;
						$.each(result.data,function(n,trainObj){
							var tr = $("<tr/>");
							tr.append("<td>"+index+"</td>");
							tr.append("<td>"+trainObj.STN_NAME+"</td>");
							tr.append("<td>"+trainObj.ARR_TIME+"</td>");
							tr.append("<td>"+trainObj.DPT_TIME+"</td>");
							tr.append("<td></td>");
							tr.append("<td>"+trainObj.TRACK_NBR+"</td>");
							tr.append("<td>"+trainObj.RUN_DAYS+"</td>");
							_plan_review_table_trainDetail.append(tr);
							
							index = index+1;
						});
					}
				} else {
					alert("接口调用返回错误，code="+result.code+"   message:"+result.message);
				}

			},
			error : function() {
				alert("接口调用失败");
//				showErrorDialog("请求发送失败");
//				showErrorDialog(portal.common.dialogmsg.REQUESTFAIL);
			}
		});
	};
	
	
	
	
	
	
	
	
	
	//生成运行线
	this.createRunLine = function() {
		$.ajax({
			url : "../../plan/handleTrainLines",
			cache : false,
			type : "POST",
			dataType : "json",
			contentType : "application/json",
			data :JSON.stringify({
				runDate : _plan_review_selectdate.val()
			}),
			success : function(result) {
				console.dir(result);
				if (result != null && result != "undefind" && result.code == "0") {
					alert("请求发送成功");
				} else {
					alert("接口调用返回错误，code="+result.code+"   message:"+result.message);
				}

			},
			error : function() {
				alert("接口调用失败");
//				showErrorDialog("请求发送失败");
//				showErrorDialog(portal.common.dialogmsg.REQUESTFAIL);
			}
		});
	};
	
	
	
};

var _PlanReViewPage = null;
//分页对象
var _plan_review_paging_total = $("#plan_review_paging_total");

var _plan_review_btnQuery_ljtjxx = $("#plan_review_btnQuery_ljtjxx");
var _plan_review_input_search2 = $("#plan_review_input_search2");
var _plan_review_btnQuery2 = $("#plan_review_btnQuery2");


var _plan_review_select_lj = $("#plan_review_select_lj");//路局下拉框
var _param_startBureau = "Q";//路局编码
var _param_pageSize = 20;
var _plan_review_selectdate = $("#plan_review_selectdate");
var _plan_review_table_ljtjxx = $("#plan_review_table_ljtjxx");
var _plan_review_table_trainInfo = $("#plan_review_table_trainInfo");
var _plan_review_table_trainDetail = $("#plan_review_table_trainDetail");
var _plan_review_input_trainNbr = $("#plan_review_input_trainNbr");



$(function(){
	_PlanReViewPage = new PlanReViewPage();
	
	//车次详情div 车次查询按钮增加事件
	_plan_review_btnQuery_ljtjxx.click(function(){
		_PlanReViewPage.loadFullStationTrains();
		_PlanReViewPage.loadTrainInfo(1);
	});
	//车次详情div 车次号input 增加回车事件
//	_plan_review_selectdate.keypress(function(event){
//	    var keycode = (event.keyCode ? event.keyCode : event.which);
//	    if(keycode == '13'){
//	    	_PlanReViewPage.loadTrainInfo(1);
//	    }
//	});
	//车次详情div 车次查询按钮增加事件
	$("#plan_review_btnQuery2").click(function(){
		_PlanReViewPage.loadTrainInfo(1);
	});
	//车次详情div 车次号input 增加回车事件
//	_plan_review_input_trainNbr.keypress(function(event){
//	    var keycode = (event.keyCode ? event.keyCode : event.which);
//	    if(keycode == '13'){
//	    	_PlanReViewPage.loadTrainInfo(1);
//	    }
//	});
	
	
	
	
	_PlanReViewPage.initPage();
	
	
	
	
	
	
	
	/////////////////////////////////test////////////////
	$("#plan_review_btn_createRunLine").click(function(){
		_PlanReViewPage.createRunLine();
	});
	

});



