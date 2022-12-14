/*generated file connectionhandler.hpp*/
#ifndef CONNECTIONHANDLER_HPP
#define CONNECTIONHANDLER_HPP

#include <Arduino.h>

#ifdef ARDUINO_ARCH_ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPmDNS.h>
#include <LittleFS.h>
#else
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESP8266mDNS.h>
#endif

#include <ArduinoOTA.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <queue>

struct buffer_t {
	size_t size;
	uint8_t* data;
};

class ConnectionHandler 
{
private:
	static ConnectionHandler* m_instance;

	ConnectionHandler();
	
	std::queue<buffer_t> message_queue;
	void pop();
	void flush();
	
	void initFS();
	void initAP(const char* ssid);
	void initServer(const char* hostname);	
	void initOTA(const char* hostname);
protected:
public:
	static ConnectionHandler* const instance(){
		if(m_instance == nullptr) m_instance = new ConnectionHandler();
		return m_instance;
	}
    
	void addMessageToQueue(uint8_t* buf, size_t len);
	
    void init(const char* ssid = "mcm", const char* hostname = "mcm");
    void update();
    
};
#endif //CONNECTIONHANDLER_HPP
