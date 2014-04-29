package com.crec.controller.event.action;

/**
 * 暂时未使用
 * @author Administrator
 *
 */
public class GroupInfo {
	
	private Process process; 
	
	private String requestId;
	private int eventCount;
	private int errNum;
	private int successNum;
	private int currentNum;
	
	public Process getProcess() {
		return process;
	}
	public void setProcess(Process process) {
		this.process = process;
	}
	public String getRequestId() {
		return requestId;
	}
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}
	public int getEventCount() {
		return eventCount;
	}
	public void setEventCount(int eventCount) {
		this.eventCount = eventCount;
	}
	public int getErrNum() { 
		return errNum;
	}
	public void setErrNum() {
		this.setCurrentNum();
		this.errNum++;
	}
	public int getSuccessNum() {
		
		return successNum;
	}
	public void setSuccessNum() {
		this.setCurrentNum();
		this.successNum++;
	}
	public int getCurrentNum() {
		return currentNum;
	}
	public void setCurrentNum() {
		this.currentNum++;
	}


}
