/*generated file messagehandler.hpp*/
#ifndef MESSAGEHANDLER_HPP
#define MESSAGEHANDLER_HPP

#include "message.hpp"

class MessageHandler 
{
private:
	static MessageHandler* m_instance;
	
	//ctor
    MessageHandler();
    //dtor
    ~MessageHandler();
    
    const char* createDBMessage();    
protected:
public:
    
    static MessageHandler* const instance(){
		if(m_instance == nullptr) m_instance = new MessageHandler();
		return m_instance;
	}
    
    
    template <class MessageEnum>
    const char* createMessage(MessageEnum e)
    {
		switch(e)
		{
			case Message::CHAT:
			return "CHAT MESSAGE";
			case Message::POLL:
			return "POLL MESSAGE";
			case Message::DATABASE:
			return createDBMessage();
		}
	}

};
#endif //MESSAGEHANDLER_HPP
