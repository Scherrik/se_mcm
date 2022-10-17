
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

#define FS_FORMAT_ON_FAILURE true

// Set these to your desired credentials.
const char *ssid = "MC MAP";
const char *password = "admin123";     // Currently DISABLED
const char *hostname = "mc-messenger"; // To find website via mc-messenger.local

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");


void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}

void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *payload, size_t len){
	if(type == WS_EVT_CONNECT){
        log_d("Websocket client connection received");
    } else if(type == WS_EVT_DISCONNECT){
        log_d("Client disconnected");
    } else if(type == WS_EVT_DATA){
        AwsFrameInfo* info = (AwsFrameInfo*)arg;
        if(info->final && info->index == 0 && info->len == len){
            if(info->opcode == WS_TEXT){
                payload[len] = 0;
                log_d("%s", payload);
                ws.textAll((const char*)payload);
            }
        }
    }
}
void handleUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
  
}
void setup() {
	log_d("Init file system...");
    if(!LittleFS.begin(FS_FORMAT_ON_FAILURE)){
        log_v("An Error has occured while mounting LITTLEFS");
        ESP.restart();
    }
    log_d("Done! Total: %u |Used: %u |Free: %u", LittleFS.totalBytes(), LittleFS.usedBytes(), LittleFS.totalBytes()-LittleFS.usedBytes());
    
    
	log_d();
	log_d("Configuring access point...");

	// You can remove the password parameter if you want the AP to be open.
	WiFi.softAP(ssid/*, password*/);
	IPAddress myIP = WiFi.softAPIP();
	log_d("AP IP address: ");
	log_d("%s", myIP.toString().c_str());
	
	
	server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/index.html"), PSTR("text/html"));
		request->send(response);
	});
	
	server.on("/css/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/css/style.css"), PSTR("text/css"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/main.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/main.js"), PSTR("text/js"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});

	// Maybe to share (small) files with each other
  	server.onFileUpload(handleUpload);

    server.onNotFound(notFound);

    ws.onEvent(onWsEvent);
    server.addHandler(&ws);

	server.begin();

	if (!MDNS.begin(hostname)) {
		log_w("Error setting up MDNS responder!");
	}
	MDNS.addService("http", "tcp", 80);
	
    ArduinoOTA.setHostname(hostname);
    ArduinoOTA.begin();


	log_d("Server started");
}

void loop() {
}
