/*generated file messagehandler.cpp*/
#include "messagehandler.hpp"
#include "userdatabase.hpp"
#include <ArduinoJson.h>



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
	/*
	if(type == 0){	
		StaticJsonDocument<JSON_BUF_LEN> doc;
		deserializeJson(doc, buf);
		uint8_t keybuf[PUBKEY_LEN];
		for(uint8_t u = 0; u < PUBKEY_LEN; u++){
			keybuf[u] = doc["da"][u];
		}
		UserDatabase::instance()->updateCurrentResponsible(doc["sid"], keybuf);
		return true;
	} else if(type == 1){
	    MessageHandler::instance()->createMessage(Message::DB_REQ, tmp, client->id());
        ws.text(client->id(), tmp.c_str());
        log_d("TEXT SEND %s", tmp.c_str());
	}
	*/ 
	return false;
}


bool MessageHandler::extractHeader(uint8_t* buf, header_t& header)
{
	uint8_t tmp_buf[128];
	memcpy(tmp_buf, buf, 128);
	
	StaticJsonDocument<128> filter;
	filter["sid"] = true;
	filter["rid"] = true;
	filter["typ"] = true;
	
	StaticJsonDocument<128> doc;
	
	deserializeJson(doc, tmp_buf, DeserializationOption::Filter(filter));
	
	header.sid = doc["sid"];
	header.type = doc["typ"];
	
	JsonArray array = doc["rid"].as<JsonArray>();
	for(JsonVariant v : array) {
		header.rid.push_back(v.as<uint32_t>());
		//log_d("VARIANT %u | U32 %u", v.as<uint32_t>(), header.rid.back());	
	}
	
	//char tmp_buf[256];
	//tmp_buf[255] = 0;
	//serializeJson(doc, tmp_buf, 256);
	
	//log_d("%s", tmp_buf);
	return true;
}

uint8_t MessageHandler::getType(uint8_t* buf, size_t len){
	// Search only in first 
	if(len > TYPE_SEARCH_MAX) len = TYPE_SEARCH_MAX;
	
	for(int i = 0; i < len; i++){
		if(buf[i++] == 't' && buf[i++] == 'y' && buf[i++] == 'p'){
			i = i+2;
			uint8_t u = 0;
			const uint8_t tlen = 3;
			char t[tlen];
			do {
			t[u] = buf[i];
			} while(buf[++i] != ',' && (++u) < tlen); 
			
			return atoi(t);
		}
	}
	log_w("Could not identify type");
	return -1;
}

size_t MessageHandler::getReceiverList(uint8_t*buf, size_t len, uint8_t* receiver)
{
	for(int i = 0; i < len; i++){
		if(buf[i++] == 'r' && buf[i++] == 'i' && buf[i++] == 'd'){
			log_d("RID FOUND");
			uint8_t u = 0;
			while(buf[i++] != '['){
			}
			do {
				char a[3];
				uint8_t v = 0;
				do {
					a[v] = buf[i];
				} while(buf[++i] != ',' && buf[i] != ']' && (++v) < 3);
				receiver[u] = atoi(a);
			} while(buf[++i] != ']' && (++u) < 8); 
			return u;
		}
	}
	return 0;
}

size_t MessageHandler::createHelloMessage(uint8_t* buf, uint32_t requestId){
	auto udb = UserDatabase::instance();
	std::vector<uint32_t> ulist = udb->getList();
	StaticJsonDocument<100> doc;
	doc["typ"] = Message::HELLO_CLIENT;
	doc["yid"] = requestId;
	doc["dbs"] = udb->getList().size();
	return serializeJson(doc, (char*)buf, 100);
	
	/*
	if(ulist.size() != 0){
		JsonObject obj = doc.createNestedObject("cpa");	
		obj["id"] = udb->getCurrentResponsible()->id;
		obj["pk"] = udb->getCurrentResponsible()->pkey;
	}
	*/
	
	/*
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
	*/ 
}

void MessageHandler::createDBReqMessage(std::string& dest, uint32_t requestId, const char* pkey){	
	/* { "sid": requestId, "rid": currentResponsible, "pk": pkey } */
	//dest = "{'sid':" + std::to_string(requestId) + ",'rid':" + UserDatabase::instance()->getCurrentResponsible()->id + ",'pk':" + pkey + "}";
	//UserDatabase::instance()->updateCurrentResponsible(requestId, pkey);
}
//EOF
