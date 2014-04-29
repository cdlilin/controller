package com.crec.controller.utile;

import java.io.IOException;
import java.util.UUID;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;


public class Test {  
	 
	public static void main(String[] args) throws InterruptedException, IOException {
//		org.springframework.amqp.rabbit.connection.SimpleConnectionFactory
//		ApplicationContext app = new ClassPathXmlApplicationContext("applicationContext.xml");  
//		 SpringBeanUtils.setSpringContext(app);
//		Map<String, String> map = new HashedMap();
//		
//		map.put("code", "404");
//		map.put("1313", "123123");
//		
//		JSONObject json = new JSONObject();
//		json.put("code", "200");
//		json.putAll(map); 
//		
//		System.out.println(json.toString());
		
 //		app.destroy();
		
	    ConnectionFactory factory = new ConnectionFactory();
	    
        //hostname of your rabbitmq server
        factory.setHost("localhost");
        factory.setVirtualHost("dnt_mq");
        factory.setUsername("crec");
        factory.setPassword("crec2014");
		
        //getting a connection
        Connection connection = factory.newConnection();
	    
        //creating a channel
        Channel channel = connection.createChannel();
	    
        //declaring a queue for this channel. If queue does not exist,
        //it will be created on the server.
        channel.exchangeDeclare("CREC-EVENT-EXCHANGE", "topic", true); 
       
         
        
        String  test = "{\"head\": {\"event\": \"trainlineEvent\",\"requestId\": \"af45" + UUID.randomUUID().toString() + "\",\"batch\":1,\"user\":\"lilin\"},\"param\":[{\"sourceEntityId\":\"942be8cd-7df1-42c9-a5e0-3aaa82561a97\",\"time\":\"2014-04-24\",\"source\":\"1\",\"action\":\"1\"},{\"sourceEntityId\":\"942be8cd-7df1-42c9-a5e0-3aaa82561a97\",\"time\":\"2014-04-24\",\"source\":\"1\",\"action\":\"1\"},{\"sourceEntityId\":\"942be8cd-7df1-42c9-a5e0-3aaa82561a97\",\"time\":\"2014-04-24\",\"source\":\"1\",\"action\":\"1\"},{\"sourceEntityId\":\"942be8cd-7df1-42c9-a5e0-3aaa82561a97\",\"time\":\"2014-04-24\",\"source\":\"1\",\"action\":\"1\"}]}";
        channel.basicPublish("CREC-EVENT-EXCHANGE", "crec.event.construction", null, test.getBytes());
        System.out.println("--------------------------------------");
		
//		String a = "你好";
//		System.out.println(a.getBytes());
	} 
	 
}