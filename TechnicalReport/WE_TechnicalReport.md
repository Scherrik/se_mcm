# Web Engineering - Technical Report for Project nMCM

## Table of contents
- [Table of contents](#table-of-contents)
- [Basic Information](#basic-information)
    - [Definitions, Acronyms and Abbreviations](#definitions-acronyms-and-abbreviations)
    - [References](#references)
- [Project name and team members](#project-name-and-team-members)
    - [Project Name](#project-name)
    - [Team Members](#team-members)
    - [Tech stack](#tech-stack)
- [Major contributions](#major-contributions)

- [Supporting Information](#supporting-information)



## Basic Information
### Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                     |
| ----------- | --------------------------------|
| MC          | MicroController                 |
| nMCM        | no Micro Controller - Messenger |

### References

| Title                                                                                                        | Date       | Publishing organization   |
| -------------------------------------------------------------------------------------------------------------|:----------:| ------------------------- |
| [nMCM-GitHub](https://github.com/Scherrik/se_mcm/tree/we_nmcm)                                               | 29.05.2023 | MC-Messenger Team     |
| [Source Codeb](https://github.com/Scherrik/se_mcm/tree/we_nmcm/Mc_Messenger)                                 | 29.05.2023 | MC-Messenger Team     |
| [Technical Report](https://github.com/Scherrik/se_mcm/blob/we_nmcm/TechnicalReport/WE_TechnicalReport.md)    | 29.05.2023 | MC-Messenger Team     |
| [WordPress Blog](https://semcmessenger.wordpress.com)                                                        | 29.05.2023 | MC-Messenger Team         | 


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


## Structure of your website, i.e., navigation/routing structure
### Erik S

## Abstract layout of your Web pages
### Erik S

## Key functions implemented by your back-end program
### Erik G

## How did you organize your source code (functions/classes/files/folders), etc. – Which design pattern / state-ofthe-
art framework applied?
- singleton pattern: only one userdatabase (one object)
- Create Payload, Create Frame: Factory Pattern  


## Any highlights in your design/implementation, e.g., auto-scale web pages for various client devices?
### Marcel
- Colour
- 

## Supporting Information
For any further information you can contact the MC-Messenger Team or check our [Blog](https://semcmessenger.wordpress.com). 
The Team Members are:
- Marcel Fischer
- Erik Günther
- Erik Schneider
- Tim Nau
