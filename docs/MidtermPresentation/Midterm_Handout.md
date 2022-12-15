# Project: MC-Messenger - Midterm Handout
## Members: Marcel Fischer, Erik Günther, Erik Schneider, Tim Nau
## Statistics of efforts
### Hours per person, and the major contributions per person
![OUCD](/docs/JiraStatistics/time_required_per_person.png "Required time per person")
#### Major contributions per person
- Marcel Fischer: Use-Case-Design, Project manager
- Erik Günther: Back-End Design, Microcontroller-Setup
- Erik Schneider: Front-End Design, Web-Design & Development
- Tim Nau: Front-End-Development, Design-Review

### Hours per workflow

![OUCD](/docs/JiraStatistics/time_estimated_per_workflow.png  "Estimated time per workflow")

![OUCD](/docs/JiraStatistics/time_required_per_workflow.png  "Required time per workflow")

### Hours per phase

![OUCD](/docs/JiraStatistics/time_estimated_per_phase.png  "Estimated time per phase")

![OUCD](/docs/JiraStatistics/time_required_per_phase.png  "Required time per phase")

## Overall use case diagram

![OUCD](/docs/UseCases/UML_MCM_Use_Case_Diagram_2022_marked.drawio.png)

## Architecture style/decisions and major arguments for this choice

Our main goal and discussed tactics focuss on modifiability. 

We used the provided checklist and discussed how we need to implement certain features to achieve the desired goal. You can find the whole ASR document on github.

[ASR_Modifiability](./ArchitectureSignificantRequirements/Architecture-Design-and-Tactics.md)

We focused on the following points:

### Data model:
The addition of encryption changes a part of the data model (primarly the database of the backend! The frontend while be mostly unaffected)
=> data abstraction: database attributes (public key etc)
Theming:
change of name, colour etc. by the user
change of web overlay theme colours
=> visibility of attributes and privileges to the user
data abstraction: Use of data strings and flags to exchange data and information between server and client
==> keep number and severity of modifications to the minimum (small changes)
Tactics to achieve this goals:
Simple structured and extendible backend database
Frontend that provides the needed funtions to access the data

### Choice of Technology
The backend is plain c++ code.
=> Easy to implement on other hardware if a plattform provides websocket funktionality
=> outsourcing of functions to the client frontend

### Mapping among architectural elements:
Backend – Frontend: where is which process running. Direct execution of js code (no compile/build time).
The database destributed across front and backend.

### Architectural design choices:
Finaly we discussed what architectural designs would suit our project:

### Layered (open layers):
Our software consists of several layers that need to be passed while sending and receiving a message or data. (Similar to the ISO/OSI model)
1. Frontend
2. Client-Backend: (scripts, js)
3. Backend
(and from 3. back to 1. when data is send fro mthe server to a client)

### Event-driven: (mediator in form of backend)
Event: user input (message, namechange, colour, etc)
Server manages: flow, encapsulation of the header, check the database, forward to receivers


## Software tools/platforms/techniques used for your development

### Backend:
- Hardware: ESP32 (ESP32 Wi-Fi & Bluetooth MCU I Espressif Systems)
- µC development: Arduino IDE with ESP SDK, Language: C++ Dialect (Arduino)

### Frontend:
- HTML
- CSS
- JS

### IDE:
- VisualStudio

### Project Management:
- Jira
- GitHub
- Discord
- WordPress

### Deployment:
- Web Browser

### Testing:
- tbd
