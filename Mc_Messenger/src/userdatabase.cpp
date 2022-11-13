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

void UserDatabase::add(uint32_t cid, const char* data){
	client_list[cid] = data;
}

void UserDatabase::remove(uint32_t cid){
	client_list.erase(cid);
}


//EOF
