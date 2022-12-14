/*generated file message.hpp*/
#ifndef MESSAGE_HPP
#define MESSAGE_HPP


class Message 
{
private:
protected:
public:
	enum {
		HELLO_CLIENT = 1,
		HELLO_WORLD = 2,
		DB_SYNC = 3,
		SERVER_POLL = 4,
		CHAT_MESSAGE = 128,
		META_INFO,
		POLL,
		FILE
	};
    //ctor
    Message();
    //dtor
    ~Message();
        
    //inherited functions

};
#endif //MESSAGE_HPP
