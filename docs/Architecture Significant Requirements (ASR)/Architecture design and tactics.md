# Modifiability

## Tactics:

Which tactics do we wanna use to make sure our application has a high updatebility/modifiability?



### Data model:
adding of encryption changes a part of the data model (frontend ok, database of backend!)
=> data abstraction: database attributes (public key etc)
Theming:
change of name, colour etc by the user
change of web overlay theme colours
=> visibility of attributes and privileges
=> data abstraction: data strings and flags

==> number and severity of modifications to the minimum (small changes)

Tactics to get it working: 
simple structured and extendible backend database
frontend that provides the needed funtions to access the data

### Choice of Technology:
The backend is plain c++ code. 
=> Easy to implement if a plattform provides websocket funktionality
outsourcing of functions to the client frontend

### Mapping among architectural elements:
backend - frontend: where is which process running. Direct execution of js code (no compille/build time)
database destributed across front and backend


## Architectura design:
### Layered (open layers):
Frontend
Client-Backend: (scripts, js)
Backend

### Event-driven: (mediator in form of backend)
Event: user input (message, namechange, colour, etc)
Server manages flow, encapsulates header, checks the receivers, forwards to receivers 
