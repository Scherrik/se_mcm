# Web Engineering - Technical Report for Project nMCM

## Table of contents
- [Table of contents](#table-of-contents)
- [Basic Information](#basic-information)
    - [Definitions, Acronyms and Abbreviations](#definitions-acronyms-and-abbreviations)
    - [References](#references)
- [Project name and team members](#project-name-and-team-members)
    - [Organisation](#organisation)
    - [Team Members](#team-members)
    - [Tech stack](#tech-stack)
- [Major contributions](#major-contributions)
- [Overall Structure](#overall-structure)
- [Abstract layout of the Webpage](#abstract-layout-of-the-webpage)
- [Key functions implemented by your backend program](#key-functions-implemented-by-your-backend-program)
- [Source Code Organisation and Design patterns](#source-code-organisation-and-design-patterns)
    - [Project Name](#project-name)
    - [Design Patterns and Clean Code](#design-patterns-and-clean-code)
    - [Tech stack](#tech-stack)
- [Highlights](#highlights)
    - [Adaptive Layout](#adaptive-layout)
    - [Color Schemes](#color-schemes)
    - [CI/CD Pipeline and Self hosted Web Server](#ci-cd-pipeline-and-self-hosted-web-server)


- [Supporting Information](#supporting-information)



## Basic Information
### Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                     |
| ----------- | --------------------------------|
| MC          | MicroController                 |
| nMCM        | no Micro Controller - Messenger |
| img         | image                           |


### References

| Title                                                                                                        | Date       | Publishing organization   |
| -------------------------------------------------------------------------------------------------------------|------------| --------------------------|
| [nMCM-GitHub](https://github.com/Scherrik/se_mcm/tree/we_nmcm)                                               | 29.05.2023 | MC-Messenger Team         |
| [Source Codeb](https://github.com/Scherrik/se_mcm/tree/we_nmcm/Mc_Messenger)                                 | 29.05.2023 | MC-Messenger Team         |
| [Technical Report](https://github.com/Scherrik/se_mcm/blob/we_nmcm/TechnicalReport/WE_TechnicalReport.md)    | 29.05.2023 | MC-Messenger Team         |
| [WordPress Dev-Blog from Software Engineering](https://semcmessenger.wordpress.com)                          | 29.05.2023 | MC-Messenger Team         | 

### Where can our applciation be found
The Webpage is currently deployment o nthe following URL:
https://mcm.servebeer.com/live/

## Project name and team members

### Project Name
nMCM - no Micro Controller - Messenger

### Team Members 
Marcel Fischer, Erik Günther, Tim Nau, Erik Schneider

### Tech stack
Frontend: HTML, CSS, Java-Script
Backend: Websocket (node.js), Java-Script, Webserver

## Major contributions

| Person           | Contributions       |
| -----------------|---------------------------------------------------------------------------------|
| Marcel Fischer   | Frontend: HTML, CSS, Color Scheme, JS: Color implementation, documentation |
| Erik Günther     | Backend: nodejs setup, CI/CD Pipeline, Server set up, websocket coding and message handling |
| Erik Schneider   | Frontend: HTML, CSS, reactive layout, JS: Message handling  |
| Tim Nau          | Logo, Logo Color Scheme, websocket coding and message handling |


## Introduction of your website – what is it for?
Our Project began as MCM- Microcontroller Messenger where we used a Microcontroller to host a Messaging Service that is independent of the Web and works in every Environment even if there is no Internet Connection. With that we wanted to solve our need to communicate with each other, especially in Situations where you can't directly talk to each other, e.g. we are not allowed to speak, or the situation makes it very difficult(school, university, library, industrial fairs, plane/train/bus, disco, loud bar).

But another Situation where you can't talk to each other directly is when you are far away from each other or need to chat quickly. Because we couldn't provide our Messenger in that Situation we came up with No Microcontroller Messenger. NCMC solves that Problem because it's now hosted on a Server that is accessible from the WWW so you don't need to be in range of the MC's Wi-Fi Signal.

Our Websites provides an Easy, fast and reliable Messaging-Service that everyone can access from their Devices to Chat with each other. You don't need to create an Account or Sign up, you just connect to the Messenger and choose a name that should be displayed with your Message, and you're ready to go. We also implemented some Features to make the chatting more alive and exciting e.g. the Angry Mode that lets others know you're angry when sending a specific Message.



## Overall Structure
(i.e., navigation/routing structure)
### Erik S

## Abstract layout of the Webpage
### Erik S

## Key functions implemented by your backend program
In order to accommodate the limited resources on the microcontroller, we have made the decision to offload a significant portion of the backend logic to the client side. This entails that all tasks related to the user database are performed by the clients themselves. They are responsible for tasks such as database synchronization between clients, as well as adding and removing clients. Consequently, the clients also assume the responsibility of storing the database.
The client-side backend logic encompasses the generation of outgoing messages based on the specified type to be sent by the client, as well as the processing of incoming messages.

On the server side, the tasks can be divided into two main parts. Firstly, the web server component handles the provision of various web files, including HTML, CSS, and JavaScript files. Secondly, the server manages the different states of a websocket connection for each client. When a new connection is established, the server generates a unique identifier for the client and sends it back as a response. Additionally, the server is responsible for routing incoming messages to their intended destinations, similar to the routing mechanism employed by a Layer 2 switch. Lastly, in the event of a client disconnection, the server is responsible for notifying the remaining clients so that they can update their respective user databases.

## Source Code Organisation and Design Patterns

### Organisation
Our hole project is maintained via GitHub. We make use of different branches for the development, deployment and the delivery of the WE source code and Technical Report for assesment.
The different elements of our project have also been divided and structured in different section. 
First we seperated the source code and the documentation (for WE this technical report) into different folders. These are called Mc_Messenger and TechnicalReport.
In the Mc_Messenger folder the source code can be found. In the root folder are all the node.js files stored.
The frontend files are stored in a separate subfolder called data. The data folder contains more subfolders to store css, fonts, img (images) and js-code and it also contains the main index.html file. 

### Design Patterns and Clean Code
We used different design patterns and clean code principles for our project. 
One of these patterns is the "singleton pattern". This spezifies that an object can only exists once. The database of conneccted users will always only be one object and there do not exist any duplicats of itself 

The second design pattern which was used is the principle of "Factory pattern". This principle states that every object is created with the help of an function and not directly with an constructor call. 
Examples for this pattern are the functions are "Create Payload" and "Create Frame"form the file message.js.

Clean code principles can also be found in our project. These show themselfs throughout the project in different ways:
#### CSS
Our CSS is divided into different files depending on their task. Especially the declaration of the color variables in a seperate file plays a vital role in the maintainability and scalability of the layout.
#### Frontend-JS
Our JS is also divided into different files to increase readability and maintainability: The main files are: main.js, user.js and messsage.js. The names make the purpose of the files clear automatically.
The functions have expressive names to showcase their task. Example: addMessageToChatBox()
Further Principles:
YAGNI: You Aren’t Gonna Need It – unnecessary code has been removed (exeption code for testing of features during the ongoing development) 
DRY: Don’t Repeat Yourself – Repeated code has been cleared

#### Backend node.js
Our nodejs files are also following some vital clean code principles
KISS: Keep It Simple Stupid – The functions are coded as simple as possible
YAGNI: You Aren’t Gonna Need It – unnecessary code has been removed (exeption code for testing of features during the ongoing development) 
DRY: Don’t Repeat Yourself – Repeated code has been cleared

## Highlights
Beside our main feature of chatting with other connected users we implemented some highlights to enhace the experience of our application

### Adaptive Layout 
Our first hightlight is the adaptive layout depending of the screen size. The UI  is adapting for different screen sizes and below a window width of 500px the layout is changed more dramatically.
The list of connected users is moved from the left side of the screen into the expandable menu on the right side. The menu user is added in there and can be expanded to show the user list. 
This allows for a cleaner look and allows for the chatbox to be reasonable sized on smaller screens. The feature can be tested on our currently deployed application (https://mcm.servebeer.com/live/)

### Color Schemes 
The second highlight is the implementation of different color themes the user can chose from. The separation the color variables into a different filer allows us as developes to easilie add more color schemes. 
We just have to create a new .css file and place it into the css/color_themes folder. 
Then the only things left to do are to copy the template, fill it out with the colors and finally add a new line into the switch case statement located in the function "change_color_theme" in js/ui.js. 
The color schemes can than be selected by the user in the settings window, selectable from the right side menu + click settings.
Very easy to maintain and a huge enhancement for the users. Currently three color schemes are implemented. Dark, Light and DHBW-Theme (red, white, grey)
The follwowing pictures show an example of the color schema and the settings window wich allows the user the change of the scheme.

<p align="center" border="10px">
  <img src="https://github.com/Scherrik/se_mcm/blob/ecb60ee9e819484eebf24b1fe94782c6fcf791b5/TechnicalReport/images/DHBW_color.png" alt="DHBW_theme" />
  <br>
  <br>
  <img src="https://github.com/Scherrik/se_mcm/blob/ecb60ee9e819484eebf24b1fe94782c6fcf791b5/TechnicalReport/images/Settings_menu.png" alt="Settings_menu" />
</p>


### CI CD Pipeline and Self hosted Web Server

For CI/CD our Environment we use Jenkins. Our Pipeline is shown in the picture below.

<p align="center" border="10px">
  <img src="https://github.com/Scherrik/se_mcm/blob/main/docs/CI_CD/git_jenkins_CI_CD_workflow.jpg" alt="Jenkins Workflow" />
</p>

We use two branches for the deployment. The first is called dev_nmcm, the second test_nmcm (because of the ongoing development in the meantime refactored to "dev_nmcm").
The picture shows the three most possible paths our pipline could go through. One path is a sucessfull deploy, the other two are failures on the different points.

#### Path 1 – sucessfull release:
1. The MCM development team comits new changes to the dev_nmcm branche.
2. Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
3. If sucessful: The new commits are transfered to the test_nmcm (rel_nmcm) branch.
4. The webpage is deployed to the livetest server (hosted on a Raspberry Pi) (https://mcm.servebeer.com/livetest/ ; only online during a new deployment cicle)
5. The developer executes live- and stresstests and sets a version tag (major, minor, patch)
6. The developer triggers the release. The application is deployed on the release server (also hosted on a Raspberry Pi) (https://mcm.servebeer.com/live/)

#### Path 2 – Failure during unit tests
1. The MCM development team comits new changes to the dev_nmcm branche.
2. Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
3. Not sucessful: Abort => developers are notified via discord (seperate channel on the dev-team-server


#### Path 3 – Failure or abort during live testing
1. The MCM development team commits new changes to the dev_nmcm branche.
2. Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
3. If sucessful: The new commits are transfered to the test_nmcm (rel_nmcm) branch.
4. he webpage is deployed to the livetest server (hosted on a Raspberry Pi)
5. The developer executes live- and stresstests and sets a version tag (major, minor, patch)
6. Release abort is triggered due to failure or wish to abort. => developers are notified via discord (seperate channel on the dev-team-server

The code for jenkins can be found in the main folders of the two deployment branches and are different for each branche.

(https://github.com/Scherrik/se_mcm/blob/dev_nmcm/Jenkinsfile)

(https://github.com/Scherrik/se_mcm/blob/rel_nmcm/Jenkinsfile)


## Supporting Information
For any further information you can contact the MC-Messenger Team or check our [Blog](https://semcmessenger.wordpress.com). 
The Team Members are:
- Marcel Fischer
- Erik Günther
- Erik Schneider
- Tim Nau
