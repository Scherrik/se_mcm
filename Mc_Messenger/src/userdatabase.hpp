/*generated file userdatabase.hpp*/
#ifndef USERDATABASE_HPP
#define USERDATABASE_HPP

#include "Arduino.h"
#include <string>
#include "linkedlist.hpp"

struct User {
	int client_id;
	std::string pk;
	std::string name;
	
	union {
		uint8_t flags;
		struct {
			uint8_t isActive:1;
			uint8_t isAngry:1;
			uint8_t isHungry:1;
		};
	};	
};

class UserDatabase 
{
private:
	LinkedList<User> users;
protected:
public:
    //ctor
    UserDatabase();
    //dtor
    ~UserDatabase();
    
    void add(const User& user);
    void update(const User& user);
    void remove(int cid);
};
#endif //USERDATABASE_HPP
