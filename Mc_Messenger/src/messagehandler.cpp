/*generated file messagehandler.cpp*/
#include "messagehandler.hpp"
#include "userdatabase.hpp"
#include <ArduinoJson.h>

#include <map>


MessageHandler* MessageHandler::m_instance = nullptr;

//ctor
MessageHandler::MessageHandler()
{
}

//dtor
MessageHandler::~MessageHandler()
{
}

bool MessageHandler::handleFrame(uint8_t *buf){
	std::string s = (char*)buf;
	std::size_t foundPos = s.find("typ");
	log_d("Found at pos %zu", foundPos);
	if(foundPos == std::string::npos){
		log_w("Type could not be determined/found");
		return false;
	}
	uint8_t type = buf[foundPos+5]-48;
	log_d("Type %u", type);
	if(type == 0){	
		StaticJsonDocument<JSON_BUF_LEN> doc;
		deserializeJson(doc, buf);
		uint8_t keybuf[PUBKEY_LEN];
		for(uint8_t u = 0; u < PUBKEY_LEN; u++){
			keybuf[u] = doc["da"][u];
		}
		UserDatabase::instance()->update(doc["sid"], keybuf);
		return true;
	}
	return false;
}

void MessageHandler::createDBMessage(std::string& dest, uint32_t requestId){
	std::map<uint32_t, t_pkey> udb = UserDatabase::instance()->get();
	StaticJsonDocument<UDB_DATA_LEN> doc;
	doc["typ"] = 0;
	doc["yid"] = requestId;
	for (std::map<uint32_t,t_pkey>::iterator it=udb.begin(); it!=udb.end(); ++it){
		log_d("%d", it->first);
		//JsonArray array = doc.to<JsonArray>();
		JsonArray array = doc.createNestedArray(std::to_string(it->first));
		for(uint8_t u = 0; u < PUBKEY_LEN; u++){
			log_d("COUNT %d: ADD %d", u, it->second[u]);
			array.add((int)it->second[u]);
		}
		//doc[std::to_string(it->first)] = it->second;
	}
	serializeJson(doc, dest);
	log_d("JSON String: %s", dest.c_str());
}
//EOF
