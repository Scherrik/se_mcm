/*generated file messagehandler.hpp*/
#ifndef MESSAGEHANDLER_HPP
#define MESSAGEHANDLER_HPP
#include <Arduino.h>
#include <string>
#include <vector>
#include "message.hpp"

#define JSON_BUF_LEN	1200
#define TYPE_SEARCH_MAX 100

#define BROADC_ADDR	0xFFFF

struct header_t {
	uint32_t sid;
	std::vector<uint32_t> rid;
	uint8_t type;
};

class MessageHandler 
{
private:
	static MessageHandler* m_instance;
	
	uint32_t dbReqId;
	
	//ctor
    MessageHandler();
    //dtor
    ~MessageHandler();
    
    size_t createHelloMessage(uint8_t* buf, uint32_t requestId);
    void createDBReqMessage(std::string& dest, uint32_t requestId, const char* pkey = "");
protected:
public:
    
    static MessageHandler* const instance(){
		if(m_instance == nullptr) m_instance = new MessageHandler();
		return m_instance;
	}
    
    
    bool handleFrame(uint8_t *buf);
    uint8_t  getType(uint8_t *buf, size_t len);
    size_t getReceiverList(uint8_t*buf, size_t len, uint8_t* receiver);
    
    inline uint32_t getDBRequester() { return dbReqId; }
    
    bool extractHeader(uint8_t* buf, header_t& header);
    
    template <class MessageEnum>
    size_t createMessage(MessageEnum e, uint8_t* buf, uint32_t requestId = 0)
    {
		switch(e)
		{
			case Message::HELLO_CLIENT:
			return createHelloMessage(buf, requestId);
			break;
			/*
			case Message::POLL:
			dest = "POLL MESSAGE";
			break;
			case Message::DB_SYNC:
			dbReqId = requestId;
			createHelloMessage(dest, requestId);
			break;
			*/
			default:
			
			break; 
		}
	}

};
#endif //MESSAGEHANDLER_HPP
