# Project: MC-Messenger - Finals: Handout
## Project name
## Members: Marcel Fischer, Erik Günther, Erik Schneider, Tim Nau
## Statistics of efforts
Erik Schneider
### Hours per person, and the major contributions per person
### Hours per workflow (requirement analysis, project management, …)
### Hours per phase (inception, elaboration, …)

## Highlights of your demo
- Angry Mode: The AngryMode can be used to show your emotions while chatting, sometimes when you're chatting you don't know how a message was meant by the other Person but with the implementation of the Angry Button everybody in the Chatroom knows that you are not happy right now.

- Theme Changer: The theme changer can be used to adapt the style of the application to the user's Preference. If someone wants a bright application the can just the Light Theme, if they want a more subtle dark application they use the dark Theme. For Special occasions there are more themes to choose from like the DHBW Theme. 

- Cookie Clicker: Every good Project needs a Cookie Clicker ;).

## Highlights of your project, such as:
### Architecture

A short snipped of our [ASR document](/docs/ArchitectureSignificantRequirements/Architecture-Design-and-Tactics.md)

### Tactics: Modifiability

### Data model:
Encryption changes the data model: (primarly the database of the backend! 
=> Data abstraction: database attributes (public key etc)

#### Theming of the GUI:
- Change of name, colour etc. by the user
- Change of web overlay theme colours

#### Data abstraction: 
Use of data strings and flags to exchange data and information between server and client.

### Tactics to achieve this goals: 
Simple structured and extendible backend database
Frontend that provides the needed funtions to access the data

### Architectural design:
#### Layered (open layers):
1. Frontend
2. Client-Backend: (scripts, js)
3. Backend (and from 3. back to 1. when data is send fro mthe server to a client)

### Highlight: Many functions of the backend are outsourced to the clients to reduce server load. For axample the management and distribution of ther user database. Only one user at the time is "master" and distributes the database to new connecting clients. After that each client maintains its own database

#### Event-driven:
- Event: user input (message, namechange, colour, etc)
- Server manages: flow, encapsulation of the header, check the database, forward to receivers


### Software tools/platforms/techniques used for your development

#### Backend:
- Hardware: ESP32 (ESP32 Wi-Fi & Bluetooth MCU I Espressif Systems)
- µC development: Arduino IDE with ESP SDK, Language: C++ Dialect (Arduino)

Setup without the specific MC:
- node.js
- Raspberry Pi

#### Frontend:
- HTML
- CSS
- JS

#### IDE:
- VisualStudio

#### Project Management:
- Jira
- GitHub
- Discord
- WordPress

#### Deployment:
- Web Browser

#### Testing:
- Jenskins /Jest : Unit- and Stress-Testing

### Database design
- Database per client: Each client maintains its own database
- Simple javascript map, with the id of the user as the identifier
- The user object contains the following attributes: id, name, color, public key

Due to the no-persistency approach in the application, there is no need for a more complex database.

### Testing
- Unittests are created with Jest (a nodejs testing module)
- Test report will be created for each build including the test coverage
- Manual tests embedded in jenkins pipeline
  
### Measurements
For measurement and metrics two webpage metrics and the function point methode have been used.
THis information can also be found in our Metrics plan here on GitHub:
[Metric Plan](/docs/Metrics/metric_plan.md)

The metrics show the following results:
 web metrics calculated with the Lighhouse Test:
- First Contentful Paint => 0.5s
- Largest Contentful Paint => 1s
The overall score is 99. These are very good result. You can find picture below or the  full report as HTML in [Lighthouse Test Results](/docs/Metrics)
![OUCD](/docs/Metrics/MCM_Lighthouse_Report_09_05_2023.png)

Function points: Gives an apporixmate value for costs and required work based on number of user inputs/ouptuts and complexity of the Software (400 - 1600 hours per 100 function points)
Our results: 31.1 fp

=> equates with the above approximation to: 124 - 492 hours.

=> This result seems plausible for our project with four people. This number does only account for the development time.

The remaining 500 hours to reach the hour time of 1000 hours for four people for this lecture are used for the documantation, testing, project management and more. This correlates with our experience. 

### CI/CD
Includes:
- Build pipeline (per branch)
- Unittests
- Test report creation (including coverage)
- Manual (stress-)tests
- Automatic release 
- Automatically notify development/devops team via discord about build status and failures 
- Strict separation of development and production code

Used components:
- Jenkins in connection with github and discord (Jira could be included as well)
- Runs on a raspberry pi 2B+ ...but it runs ;)
  
