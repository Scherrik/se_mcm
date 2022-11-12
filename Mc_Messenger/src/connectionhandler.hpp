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

	//AsyncWebServer server;
	//AsyncWebSocket ws;
	// Set these to your desired credentials.
	//static const char *password;     // Currently DISABLED
	
	ConnectionHandler();
	
	//void notFound(AsyncWebServerRequest *request);
	//void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *payload, size_t len);
	//void handleUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final);
	
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
    //ctor
    //
    //dtor
    //~ConnectionHandler();
    
    void init(const char* ssid = "map", const char* hostname = "mcm");
    
    //inherited functions

};
#endif //CONNECTIONHANDLER_HPP
