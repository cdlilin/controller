package com.crec.controller.event.action;

import java.util.HashMap;
import java.util.Map;

/**
 * <event name="event1" parameter="userparam" start="action1" result="${result4}">
 *   <action next="action2" name="action1" url="/${userparam.d}" method="get" parameter="${userparam}" result="result1" description="">
 *    	<validate next="action2">
 *          <eq value="0" paramName="result1.code">
 *      </validate> 
 *   </action>
 *   <group name="action2">
 *      <action name="action3" result="result3">
 *          <validate>
 *             <eq value="0" paramName="result3.code" /> 
 *          </validate>
 *      </action>
 *      <action name="action4" result="result4"> 
 *         <validate next="error">
 *            <eq value="1" paramName="result3.code"> 
 *         </validate>
 *      </action> 
 *   </group>
 *   <action name="action5" result="result4"/> 
 * </event>
 * @author lilin
 * 
 * 用于事件描述的对象,保存事件的基本描述信息
 * 
 * 
 * 
 *
 */
public class Event{
	
	//事件名称
	private String name; 
	//用户名
	private String username; 
	//事件出发参数的资源KEY
	private String parameter;
	//开始的action名字
	private String startAction;
	//结果的字符串表达式 可使用￥${}
	private String result;
	//结果发送的路由值
	private String routingKey;
	//使用发送的对象模板
	private String amqpTemp;
	
	
	public String getRoutingKey() {
		return routingKey;
	}

	public void setRoutingKey(String routingKey) {
		this.routingKey = routingKey;
	}

	public String getAmqpTemp() {
		return amqpTemp;
	}

	public void setAmqpTemp(String amqpTemp) {
		this.amqpTemp = amqpTemp;
	} 
	
	private Map<String, AbstractAction> actionMap = new HashMap<String, AbstractAction>();
	
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	} 
	
    public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	 
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	} 
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	} 
 
	public AbstractAction getAction(String name){
		return  actionMap.get(name);
	} 
	
	public <T extends AbstractAction> void addAction(T action){
		System.out.println(this.getName() + "添加->" + action.getName());
		this.actionMap.put(action.getName(), action);
	}
	
	public String getStartAction() {
		return startAction;
	}

	public void setStartAction(String startAction) {
		this.startAction = startAction;
	}
 
}
