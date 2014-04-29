package com.crec.controller.event.action;

import net.sf.json.JSONObject;

import org.apache.bcel.classfile.Constant;
import org.apache.log4j.Logger;

import com.crec.controller.utile.CRECRestException;
import com.crec.controller.utile.Constants;
import com.crec.controller.utile.ParameterHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class RestAction extends AbstractAction{
	
	private static Logger log = Logger.getLogger(RestAction.class); 
	
	public RestAction(){
		
	}
	
	public RestAction(String name, String description) {
		super(name, description);
		// TODO Auto-generated constructor stub
	} 

	private String url;
	private String parameter;
	private String method;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}
	
	public String getPostUrl(JSONObject resource){ 
		return ParameterHelper.getReplacement(this.url, resource);
	}
	
	public JSONObject getPostParameter(JSONObject resource){ 
		//处理提供URL 
		return JSONObject.fromObject(ParameterHelper.getReplacement(this.parameter, resource));
	} 
	
	@Override
	public JSONObject excutor(Process work) {  
		
		log.debug(work.hashCode() + "-------------------调用rest接口----------------" + work.getResource()); 
		String url = getPostUrl(work.getResource());
		JSONObject postParameter =  getPostParameter(work.getResource()); 
		log.debug("-------------------提交URL：" + url); 
		log.debug("-------------------提交parameter：" + postParameter);  
		JSONObject obj = new JSONObject();
		obj.put("code", "200");
		try { 
			
			Client client = Client.create();
			
			client.setConnectTimeout(Constants.CONNECT_TIME_OUT);

			WebResource webResource = client.resource(url); 
			
//			webResource.method(this.method, GenericType)
			
			ClientResponse response = webResource.type("application/json")
					.accept("application/json").method(this.method.toUpperCase(), ClientResponse.class, postParameter.toString());
			 
		    if (response.getStatus() >= 300) {
				log.error("调用接口失败，状态码="+response.getStatus() +"  接口返回信息=" + response.getEntity(String.class));
				throw new CRECRestException(response.getStatus());
			}
			//将返回结果转换为指定对象 
			String resp = response.getEntity(String.class); 
			log.debug("调用接口请求发送成功    接口返回信息:" + resp); 
			
			obj = JSONObject.fromObject(resp);

			 
		} catch (CRECRestException e) {
			// TODO Auto-generated catch block
			log.warn("调用rest返回错误码", e);
			e.printStackTrace(); 
			obj.put("code", e.getCode());
			obj.put("message", e.getMessage()); 
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			log.error("调用rest结构出错", e);
			obj.put("code", "-1");
			obj.put("message", e.getMessage()); 
		} 
		return obj; 
	}
	
	public static void main(String[] args) {
		
	}
} 