/*generated file linkedlist.cpp*/
#include "linkedlist.hpp"

//ctor
template <class T>
LinkedList<T>::LinkedList()
{
	_head = nullptr;
}

//dtor
template <class T>
LinkedList<T>::~LinkedList()
{
	Node<T> *p, *q;
	p = _head;
	if(p == nullptr) return;
	while(p){
		q = p->next();
		delete p;
		p = q;
	}
}

template <class T>
void LinkedList<T>::add(T* d)
{
	Node<T> *p, *q;
	if(_head == nullptr) {
		_head = new Node<T>;
		_head->setData(d);
		return;
	}
	p = _head;
	while(p->next()){
		p = p->next();
	}
	q = new Node<T>;
	q->setData(d);
	p->setNext(q);
}

template <class T>
void LinkedList<T>::remove(T* d)
{
	Node<T> *p, *q = nullptr;
	if(_head == nullptr) {
		return;
	}
	p = _head;
	while(p){
		if(p->data() == d){
			if(q)
				q->setNext(p->next());
			else
				_head = p->next();
			delete p;
			return;
		}
		q = p;
		p = p->next();
	}
}

template <class T>
void LinkedList<T>::clear()
{
	Node<T> *p, *q;
	if(_head == nullptr) {
		return;
	}
	p = _head;
	while(p){
		q = p->next();
		delete p;
		p = q;
	}
}

template <class T>
size_t LinkedList<T>::len()
{
	size_t l = 0;
	Node<T> *p = _head;
	while(p){
		++l;
		p = p->next();
	}
	return l;
}
//EOF
