/*generated file connectionhandler.cpp*/
#include "connectionhandler.hpp"
#include "messagehandler.hpp"

#define FS_FORMAT_ON_FAILURE true

ConnectionHandler* ConnectionHandler::m_instance = nullptr;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

ConnectionHandler::ConnectionHandler()
{
	
}

void /*ConnectionHandler::*/notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}

void /*ConnectionHandler::*/onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *payload, size_t len){
	if(type == WS_EVT_CONNECT){
        log_d("Websocket client connection received");
        ws.text(client->id(), MessageHandler::instance()->createMessage(Message::DATABASE));
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

void /*ConnectionHandler::*/handleUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
  
}

void ConnectionHandler::initFS()
{
	log_d("Init file system...");
    if(!LittleFS.begin(FS_FORMAT_ON_FAILURE)){
        log_v("An Error has occured while mounting LITTLEFS");
        ESP.restart();
    }
    log_d("Done! Total: %u |Used: %u |Free: %u", LittleFS.totalBytes(), LittleFS.usedBytes(), LittleFS.totalBytes()-LittleFS.usedBytes());
}

void ConnectionHandler::initAP(const char* ssid)
{
	log_d("Configuring access point...");
	// You can remove the password parameter if you want the AP to be open.
	WiFi.softAP(ssid/*, password*/);
	IPAddress myIP = WiFi.softAPIP();
	log_d("AP IP address: ");
	log_d("%s", myIP.toString().c_str());
}

void ConnectionHandler::initServer(const char* hostname)
{
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
	log_d("Server started");
}

void ConnectionHandler::initOTA(const char* hostname){
    ArduinoOTA.setHostname(hostname);
    ArduinoOTA.begin();
}

void ConnectionHandler::init(const char* ssid, const char* hostname)
{
	initFS();
	initAP(ssid);
	initServer(hostname);
	initOTA(hostname);
}

//EOF
