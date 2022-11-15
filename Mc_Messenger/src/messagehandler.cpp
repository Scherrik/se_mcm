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

const char* MessageHandler::createDBMessage(){
	std::map<uint32_t, std::string> udb = UserDatabase::instance()->get();
	StaticJsonDocument<UDB_DATA_LEN> doc;
	for (std::map<uint32_t,std::string>::iterator it=udb.begin(); it!=udb.end(); ++it){
		log_d("%d: %s", it->first, it->second);
		doc[std::to_string(it->first)] = it->second;
	}
	std::string str;
	serializeJson(doc, str);
	log_d("%s", str.c_str());
	
	return str.c_str();
}
//EOF
