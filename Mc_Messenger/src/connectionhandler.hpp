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

class ConnectionHandler 
{
private:
	static ConnectionHandler* m_instance;

	ConnectionHandler();
	
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
    
    void init(const char* ssid = "mcm", const char* hostname = "mcm");
    void update();
    
};
#endif //CONNECTIONHANDLER_HPP
