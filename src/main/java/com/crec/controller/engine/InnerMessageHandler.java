package com.crec.controller.engine;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.log4j.Logger;

import com.crec.controller.event.action.Process;
import com.crec.controller.utile.Constants;

public class InnerMessageHandler extends MessageHandler{
	 private static Logger log = Logger.getLogger(InnerMessageHandler.class);
	 private static ExecutorService innerPool = null;
	 static{
		 PropertiesConfiguration config;
			int poolNum = Constants.EVENT_POOL_NUM_DEFAULT;
			try {
				config = new PropertiesConfiguration(Constants.CONFIG_FILE);
				poolNum = config.getInt(Constants.EVENT_INNER_POOL_NUM_KEY, Constants.EVENT_POOL_NUM_DEFAULT);
			} catch (ConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			innerPool = Executors.newFixedThreadPool(poolNum);
	 }
	/**
	 * {head:{user:"test", evnet: "testevent"}, url:"", params:""}
	 * @param message
	 */
	public static void fireEvent(Process work){  
		log.debug("-----------------------innerhandle--------------------------"); 
		 // 创建一个执行任务的服务    
       try {   
    	   //把当前处理流程放到预处理池中
    	   innerPool.submit(work);    
       } catch (Exception e){  
    	   log.error(e.toString()); 
       }   
	}

}
