/*generated file userdatabase.cpp*/
#include "userdatabase.hpp"

UserDatabase* UserDatabase::m_instance = nullptr;
//ctor
UserDatabase::UserDatabase()
: client_list(std::vector<uint32_t>())
{
}

//dtor
UserDatabase::~UserDatabase()
{
}

bool UserDatabase::add(uint32_t cid){
	if ( std::find(client_list.begin(), client_list.end(), cid) != client_list.end() )
		return false;
	client_list.push_back(cid);
	return true;
}

void UserDatabase::updateCurrentResponsible(uint32_t cid, const std::string &pkey){	
	currentResponsible.id = cid;
	currentResponsible.pkey = pkey;
}

bool UserDatabase::remove(uint32_t cid){
	for (std::vector<uint32_t>::iterator it = client_list.begin(); it != client_list.end();)
    {
        if (*it == cid){
            it = client_list.erase(it);
            return true;
        }   
        ++it;
    }
    return false;
}


//EOF
