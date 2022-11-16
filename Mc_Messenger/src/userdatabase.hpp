/*generated file userdatabase.hpp*/
#ifndef USERDATABASE_HPP
#define USERDATABASE_HPP

#include "Arduino.h"
#include <string>
#include <map>
//#include "linkedlist.hpp"

#define UDB_DATA_LEN 1024
#define PUBKEY_LEN	32

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

typedef uint8_t t_pkey[PUBKEY_LEN];

class UserDatabase 
{
private:
	static UserDatabase* m_instance;

	//LinkedList<User> users;
    std::map<uint32_t, t_pkey> client_list;
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
    
    inline const std::map<uint32_t, t_pkey>& get() { return client_list; }
    
    void add(uint32_t cid);
    void remove(uint32_t cid);
    void update(uint32_t cid, uint8_t* pkey);
    
};
#endif //USERDATABASE_HPP
