/*generated file messagehandler.hpp*/
#ifndef MESSAGEHANDLER_HPP
#define MESSAGEHANDLER_HPP
#include <Arduino.h>
#include <string>
#include "message.hpp"

#define JSON_BUF_LEN	1200

class MessageHandler 
{
private:
	static MessageHandler* m_instance;
	
	//ctor
    MessageHandler();
    //dtor
    ~MessageHandler();
    
    void createDBMessage(std::string& dest, uint32_t requestId);    
protected:
public:
    
    static MessageHandler* const instance(){
		if(m_instance == nullptr) m_instance = new MessageHandler();
		return m_instance;
	}
    
    
    bool handleFrame(uint8_t *buf);
    
    template <class MessageEnum>
    void createMessage(MessageEnum e, std::string& dest, uint32_t requestId = 0)
    {
		switch(e)
		{
			/*
			case Message::CHAT:
			dest = "CHAT MESSAGE";
			*/ 
			case Message::POLL:
			dest = "POLL MESSAGE";
			case Message::DATABASE:
			createDBMessage(dest, requestId);
		}
	}

};
#endif //MESSAGEHANDLER_HPP
