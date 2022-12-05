/*generated file connectionhandler.cpp*/
#include "connectionhandler.hpp"
#include "messagehandler.hpp"
#include "userdatabase.hpp"

#define FS_FORMAT_ON_FAILURE true

ConnectionHandler* ConnectionHandler::m_instance = nullptr;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

ConnectionHandler::ConnectionHandler()
{
	
}

void /*ConnectionHandler::*/notFound(AsyncWebServerRequest *request) {
    request->redirect("/");
}

void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *payload, size_t len){
	auto msgHandler = MessageHandler::instance();
	
	
	if(type == WS_EVT_CONNECT){
        log_d("Websocket client connection received");
        uint8_t outbuf[100];
        size_t resp_len = msgHandler->createMessage(Message::HELLO_CLIENT, outbuf, client->id());
        ws.text(client->id(), outbuf, resp_len);
        log_d("TEXT SEND %s", outbuf);
        UserDatabase::instance()->add(client->id());
    } else if(type == WS_EVT_DISCONNECT){
        log_d("Client disconnected");
        UserDatabase::instance()->remove(client->id());
    } else if(type == WS_EVT_DATA){
        AwsFrameInfo* info = (AwsFrameInfo*)arg;
        if(info->final && info->index == 0 && info->len == len){
            if(info->opcode == WS_TEXT){
                payload[len] = 0;
                //TODO Execute message type dependent tasks
                //int msgType = msgHandler->getType(payload, len);
                //uint32_t rid;
                //uint8_t rcvr[8];
                //size_t rlen = 0;
                //log_d("MSG_TYPE: %d", msgType);
                //std::string tmp;
                header_t header;
                
                if(!msgHandler->extractHeader(payload, header)) { 
					log_w("Something went wrong, couldn't extract header");
					return;
				}
                log_d("%s", payload);
                
                if(header.rid.size() == 0){
					log_w("NO RECEIVER SET, RETURN...");
					return;
				}
                
				if(header.rid.size() == 1 && header.rid[0] == BROADC_ADDR)
				{
					ws.textAll(payload, len);
				}
				else {
					for (std::vector<uint32_t>::iterator i = header.rid.begin(); i != header.rid.end(); ++i){
						ws.text((*i), payload, len);
					}
				}
                /*
                switch(header.type){
					case Message::HELLO_WORLD:
						
						if(header.rid.size() == 1 && header.rid[0] == BROADC_ADDR)
						{
							ws.textAll(payload, len);
						}
						else {
							for (std::vector<uint32_t>::iterator i = header.rid.begin(); i != header.rid.end(); ++i){
								ws.text((*i), payload, len);
							}
						}
						break;
					case Message::DB_SYNC:
						// Nothing to do
						//log_d("RLEN %d | RC[0] %d", len, rcvr[0]);
						//rlen = msgHandler->getReceiverList(payload, len, rcvr);
						//ws.text(rcvr[0], (char*)payload);
						break;
					case Message::CHAT_MESSAGE:
						// TODO Forward chat messages, identify receiver
						if(header.rid[0] == BROADC_ADDR)
						{
							ws.textAll(payload, len);
						} 
						else {
							for (std::vector<uint32_t>::iterator i = header.rid.begin(); i != header.rid.end(); ++i){
								ws.text((*i), payload, len);
							}
						}
						break;
					default:
						break;
				}
                */
                /*
				MessageHandler::instance()->handleFrame(payload)){
					log_d("ROUTE MESSAGE");
					ws.textAll((const char*)payload);
				}
                */
                //ws.textAll((const char*)payload);
                
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
	
	server.on("/css/regular.css", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/css/regular.css"), PSTR("text/css"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/fonts/fa-regular-400.woff2", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/fonts/fa-regular-400.woff2"), PSTR("font/woff2"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/main.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/main.js"), PSTR("text/javascript"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/nacl.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/nacl.js"), PSTR("text/javascript"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/nacl-util.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/nacl-util.js"), PSTR("text/javascript"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/message.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/message.js"), PSTR("text/javascript"));
		//response->addHeader(PSTR("Content-Encoding"), PSTR("gzip"));
		request->send(response);
	});
	
	server.on("/js/user.js", HTTP_GET, [](AsyncWebServerRequest *request){
		auto response = request->beginResponse(LittleFS, PSTR("/js/user.js"), PSTR("text/javascript"));
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

void ConnectionHandler::update(){
	ArduinoOTA.handle();
}

//EOF
