/*generated file userdatabase.hpp*/
#ifndef USERDATABASE_HPP
#define USERDATABASE_HPP

#include "Arduino.h"
#include <string>
#include <map>
//#include "linkedlist.hpp"

#define UDB_DATA_LEN 256

struct User {
	int client_id;
	std::string pk;
	std::string name;
	
	/*
	union {
		uint8_t flags;
		struct {
			uint8_t isActive:1;
			uint8_t isAngry:1;
			uint8_t isHungry:1;
		};
	};
	*/ 	
};

class UserDatabase 
{
private:
	static UserDatabase* m_instance;

	//LinkedList<User> users;
    std::map<uint32_t, std::string> client_list;
    //ctor
    UserDatabase();
    //dtor
    ~UserDatabase();
protected:
public:
	static UserDatabase* const instance(){
		if(m_instance == nullptr){
			m_instance = new UserDatabase();
		}
		return m_instance;
	}
    
    inline const std::map<uint32_t, std::string>& get() { return client_list; }
    
    void add(uint32_t cid, const char* data);
    void remove(uint32_t cid);
    
    //void add(const User& user);
    //void update(const User& user);
};
#endif //USERDATABASE_HPP
