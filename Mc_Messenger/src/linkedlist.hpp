/*generated file linkedlist.hpp*/
#ifndef LINKEDLIST_HPP
#define LINKEDLIST_HPP

#include <cstddef>

template <class T>
class Node
{
private:
	T* _data;
	Node<T> *_next;
public:
	Node(){
		_next = nullptr;
		_data = nullptr;
	}
	~Node(){
		delete _data;
	}
	
	Node<T>* next(){ return _next; }
	T* data(){ return _data; }
	
	void next(Node<T>* next) { _next = next; }
	void data(T* data) { _data = data; }
};

template <class T>
class LinkedList
{
private:
	 Node<T> *_head;
public:
	LinkedList();
	~LinkedList();
	
	void add(T* d);
	void remove(T* d);
	void clear();
	
	Node<T>* head() { return _head; }
	
	size_t len();
	
};
#endif //LINKEDLIST_HPP
