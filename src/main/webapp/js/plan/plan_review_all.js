/**
 * 路局审核界面
 * 
 * @author denglj 
 */
var PlanReViewAllPage = function(){
	
	this.initPage = function() {
		_plan_review_all_selectdate.datepicker();
		_plan_review_all_selectdate.val(this.currdate());
		
		//加载路局开行计划统计信息
		this.loadFullStationTrains();
	};
	
	
	//获取当期系统日期
	this.currdate =function(){
		var d = new Date();
		var year = d.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = d.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var days = d.getDate(); 
		return year+"-"+month+"-"+days;
	};
	
	
	

	//加载路局开行计划统计信息
	this.loadFullStationTrains = function() {
		_plan_review_all_table_tjxx.find("tr:gt(1)").remove();//清除路局开行计划统计信息
		$.ajax({
			url : "../../plancheck/getFullStationTrains",
			cache : false,
			type : "POST",
			dataType : "json",
			contentType : "application/json",
			data :JSON.stringify({
				runDate : _plan_review_all_selectdate.val()
			}),
			success : function(result) {
				console.log("2222222222222");
				console.dir(result);
				
				if (result != null && result != "undefind" && result.code == "0") {
					if (result.data !=null) {

						var index = 1;
						$.each(result.data,function(n,trainObj){
							var tr = $("<tr/>");
							tr.append("<td>"+index+"</td>");
							tr.append("<td>"+trainObj.ljjc+"</td>");
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
							_plan_review_all_table_tjxx.append(tr);
							
							index =index+1;
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
	
	
	
};

var _PlanReViewAllPage = null;
var _plan_review_all_selectdate = $("#plan_review_all_selectdate");
var _plan_review_all_btnQuery_ljtjxx = $("#plan_review_all_btnQuery_ljtjxx");
var _plan_review_all_table_tjxx = $("#plan_review_all_table_tjxx");


$(function(){
	_PlanReViewAllPage = new PlanReViewAllPage();
	_PlanReViewAllPage.initPage();
	
	_plan_review_all_btnQuery_ljtjxx.click(function(){
		_PlanReViewAllPage.loadFullStationTrains();
	});
	
	

});



