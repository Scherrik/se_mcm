/*generated file userdatabase.cpp*/
#include "userdatabase.hpp"

UserDatabase* UserDatabase::m_instance = nullptr;
//ctor
UserDatabase::UserDatabase()
{
}

//dtor
UserDatabase::~UserDatabase()
{
}

void UserDatabase::add(uint32_t cid){
	client_list[cid][0] = 0;
}
void UserDatabase::remove(uint32_t cid){
	client_list.erase(cid);
}

void UserDatabase::update(uint32_t cid, uint8_t* pkey){
	if(!pkey) return;	
	for(uint8_t u = 0; u < PUBKEY_LEN; u++){
		client_list[cid][u] = pkey[u];
	}
}

//EOF
