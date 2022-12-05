/*generated file userdatabase.hpp*/
#ifndef USERDATABASE_HPP
#define USERDATABASE_HPP

#include "Arduino.h"
#include <string>
#include <vector>
//#include "linkedlist.hpp"

#define UDB_DATA_LEN 1024
#define MAX_CLIENTS	32
#define PUBKEY_LEN	32

struct User {
	uint32_t id = 0xFFFFFFFF;
	std::string pkey = "";
};

typedef uint8_t t_pkey[PUBKEY_LEN];

class UserDatabase 
{
private:
	static UserDatabase* m_instance;

	//LinkedList<User> users;
    //std::map<uint32_t, t_pkey> client_list;
    
    //uint32_t client_list[MAX_CLIENTS];
    std::vector<uint32_t> client_list;
    User currentResponsible;
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
    
    inline const std::vector<uint32_t>& getList() { return client_list; }
    
    bool add(uint32_t cid);
    void updateCurrentResponsible(uint32_t cid, const std::string &pkey);
    bool remove(uint32_t cid);
    
    inline const User* getCurrentResponsible(){ return &currentResponsible; }
    
};
#endif //USERDATABASE_HPP
