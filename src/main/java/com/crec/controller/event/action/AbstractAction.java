package com.crec.controller.event.action;

import java.util.ArrayList;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.crec.controller.event.validate.Validate;

/**
 * 时间基础模板类
 * @author LILIN
 *
 */
public abstract class AbstractAction{
	
	private static Logger log = Logger.getLogger(AbstractAction.class);
	//执行结果保存到资源池的key值
	private String resultKey;   
	//时间名。用于唯一标示时间
	private String name;
	 //事件说明，用于日志等的描述使用
	private String description; 
	//用于本次事件提交的参数描述，可以使用${资源KEY}来获取资源池中的值
	private String parameter;  
	//储存所有的验证对象
	private ArrayList<Validate> validates = new ArrayList<Validate>(); 
	
	public AbstractAction(){
		
	}
	
	public AbstractAction(String name, String description) {
		super(); 
		this.name = name;
		this.description = description;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	} 
	 
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	} 
	
	public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}

	public void begin(Process work){
		//推送数据
		log.debug("begin[" + this.description + "]");
		
	}
	//模板函数，用于外部调用
	public JSONObject doAction(Process work){
		this.begin(work); 
		JSONObject result = this.excutor(work);
		this.end(result);
		return result;
	} 
	//用户实现函数
	public abstract JSONObject excutor(Process work);
	
	
	public void end(JSONObject result){
		log.debug("end[" + this.description + "]->[" + result + "]");
	}
	
	public String getResultKey() {
		return resultKey;
	}

	public void setResultKey(String resultKey) {
		this.resultKey = resultKey;
	} 
	
	public ArrayList<Validate> getValidates() {
		return validates;
	}

	public void setValidates(ArrayList<Validate> validates) {
		this.validates = validates;
	}

	public <T extends Validate> void addValidate(T validate){
		this.validates.add(validate);
	}
	
	public String getValidate(){
		StringBuffer sb = new StringBuffer();
		for(Validate v : this.validates){
			if(sb.length() > 0){
				sb.append("\n");
			}
			sb.append(v.getValidate());
		}  
		return sb.toString();
	}

}
