# Architecture Design and Tactics: Modifiability

# Tactics:

Following tactics have been evaluated:

## Data model:
The addition of encryption changes a part of the data model (primarly the database of the backend! The frontend while be mostly unaffected)

=> Data abstraction: database attributes (public key etc)

### Theming of the GUI:
- Change of name, colour etc. by the user
- Change of web overlay theme colours

=> visibility of attributes and privileges to the user

### Data abstraction: 
Use of data strings and flags to exchange data and information between server and client.

==> keep number and severity of modifications to the minimum (small changes)

## Tactics to achieve this goals: 
Simple structured and extendible backend database
Frontend that provides the needed funtions to access the data

## Choice of Technology:
The backend is plain c++ code. 
=> Easy to implement if a plattform provides websocket funktionality
outsourcing of functions to the client frontend

## Mapping among architectural elements:
Backend - Frontend: where is which process running. Direct execution of js code (no compile/build time).
The database destributed across front and backend.


# Architectural design:
## Layered (open layers):
Our software consists of several layers that need to be passed while sending and receiving a message or data. (Similar to the ISO/OSI model)

1. Frontend
2. Client-Backend: (scripts, js)
3. Backend (and from 3. back to 1. when data is send fro mthe server to a client)

## Event-driven: (mediator in form of backend)
Event: user input (message, namechange, colour, etc)
Server manages: flow, encapsulation of the header, check the database, forward to receivers
