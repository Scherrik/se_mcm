# MC-Messenger - Software Requirements Specification 

## Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#1-introduction)
    - [Purpose](#11-purpose)
    - [Scope](#12-scope)
    - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    - [References](#14-references)
    - [Overview](#15-overview)
- [Overall Description](#2-overall-description)
    - [Vision](#21-vision)
    - [Use Case Diagram](#22-use-case-diagram)
	- [Technology Stack](#23-technology-stack)
- [Specific Requirements](#3-specific-requirements)
    - [Functionality](#31-functionality)
- [Supporting Information](#4-supporting-information)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes all requirements specifications for our Project "MC-Messenger". 
It includes an overview about this project, its vision, requirements and their specific use-cases. 

### 1.2 Scope

The main goal of this project is to connect people in the nearby environment on-the-fly and in a non-binding context. Everybody should be able to easily connect and be part of the Mc_Messenger community without a complicated registration process.

The project is split into two main paths, frontend and backend development. State-of-the-art web technologies like html and javascript are used in the frontend in contrast to the backend where c++ is used.

#### Planned services provided by the application are:

* Exchange (text) messages:
	Of course it's the essential part for a messenger project.
* Provide a list of chat participants for each user
* Set own username on-the-fly
* Get information about the health status of the µC


### 1.3 Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| AP          | Access Point (Wifi)                    |
| MC          | MicroController                        |
| SRS         | Software Requirements Specification    |
| tbd         | to be decided                          |
| UC          | Use Case                               |


### 1.4 References

| Title                                                              | Date       | Publishing organization   |
| -------------------------------------------------------------------|:----------:| ------------------------- |
| [WordPress Blog](https://semcmessenger.wordpress.com)              | 06.10.2022 | MC-Messenger Team         | 
| [GitHub](https://github.com/Scherrik/se_mcm)                       | 06.10.2022 | MC-Messenger Team         |


### 1.5 Overview
THehe following chapter gives an overview of this project with its vision and the Use Case Diagram. The third chapter (Specific Requirements) gives more details about the specific requirements in terms of functionality, (and later) usability and design parameters. The last chapter provides support information. 
    
## 2. Overall Description

### 2.1 Vision
Humans have the need to communicate. Today most of the communication is done via messenging services on the internet. If we can’t directly communicate verbaly we heavily dependent on good and fast internet services.
But: We also find ourselfes in environments where we are not allowed to speak or the situation makes it very difficult to communciate in private (e.g. school, university, library, industrial fairs, plane/train/bus, disco, loud bar).
In these situations communication gets impossible if there is no stable internet connection.
We want to provide an from the internet infrastructure independent and fast local bound Messenger-Service.

Our goal is to implement this vison with a browser accessible webserver and the help of a microcontroller.
This allows a portable and in almost every environment implementable chat server for everyone at that specific location. The users can use any device they want, it only needs a wifi connectibiliy and a browser. We want to provide a broadcast and private chat and the possibility for the user to select a custom username.

### 2.2 Use Case Diagram

![OUCD](./UseCases/UML_MCM_Use_Case_Diagram.png)

### 2.3 Technology Stack

#### Backend:
- Hardware: ESP32 (ESP32 Wi-Fi & Bluetooth MCU I Espressif Systems)
- µC development: Arduino IDE with ESP SDK, Language: C++ Dialect (Arduino)

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
- tbd

## 3. Specific Requirements

### 3.1 Functionality
This section will explain the different use cases, you could see in the Use Case Diagram, and their functionality.  

#### 3.1.1 Connect to AP
This function is fundamental for the user to use the application. The user needs to connect to the wifi network without having a technical background or special skills. This should happen as automatically as possible. For mobile phones a QR-Code will be provided which can be scanned to add the wifi to the users phone. As an alternative the user needs to select the wifi manually. The wifi can be configured to be private (with password) or public depending of the purpose and location.
##### Postcondition
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 1

[Mockup: Connect to AP](./UseCases/mockups/Connect_to_AP_MOC.png)

#### 3.1.2 Join chatroom/Open website
After connecting to the wifi the user needs to be guided to the webpage of the messenger. This can happen automatically on mobile devices. On laptops or other devices the user may need to open the pange manually. A short and easy to remember url needs to be individually configured on the MC. 
##### Precondition:
- Connect to AP
#### Postcondition:
- Choose/Change username
##### Story points: 1

[Mockup: Join chatroom/Open Website](./UseCases/mockups/Open_Website_MOC.png)

#### 3.1.3 Leave chatroom
The user can leave/close a specific chat chatroom by pressing the (X) Button on the top right of the chat window or by closing the browser window.
##### Precondition:
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 1

[Mockup: Leave chatroom](./UseCases/mockups/Leave_chatroom_MOC.png)

#### 3.1.4 Choose/Change username
After opening the application page the user needs to select a username which will be displayed to other users. The user can also change his username during the session. A carefull evaluation to avoid abuse of this feature may be needed.
##### Precondition:
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 2

[Mockup: Choose/Change username](./UseCases/mockups/See_Users_MOC.png)

#### 3.1.5 Reset session
THe user will be able to reset his session with a dedicated button or by reloading the page. Resetting means all the chats will be reloaded and the local chatlog will be cleared
##### Precondition:
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 1

[No Mockup available yet]

#### 3.1.6 See online users
On the top (or costumizable on the left) of the screen the user can see a list of all the currently online users and their usernames. The list can be minimized with a button.
##### Precondition:
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 3

[Mockup: See online users](./UseCases/mockups/See_Users_MOC.png)

#### 3.1.7 Send message
After opening the page and selecting a username the user joins the public chat automatically. The User can type a message in a text box on the buttom and send the message with the "Send" button next or below the chat box. The sender gets his message displayed with a @you in front of it.
##### Precondition:
- Join chatroom/Open website
- Choose/Change username
##### Postcondition:
Send private message
##### Story points: 5

[Mockup: Send message](./UseCases/mockups/Send_MOC.png)
##### Activity Diagram:
![OUCD](./ActivityDiagrams/ActivitySendMessage.png)


#### 3.1.8 Send private message
The user can also send private messages by selecting an online user in the described list. A new chat opens on the right side. The window can also be opened in a seperate browser tab. The user can jump between chats by selecting a user or global chat on the left.
##### Precondition: 
- Join chatroom/Open website
- Choose/Change username
- Send message
- See online users
##### Postcondition
/
##### Story points: 5

[Mockup: Send private message](./UseCases/mockups/Send_Private_Message_MOC.png)

#### 3.1.9 Receive message
The user can receive messages which are displayed in the correct chatroom. The username of the sending user and a time stamp will be shown next to the message. A chatroom (the list next to the chat window) which has unread messages will be marked with a colored marking.
##### Precondition:
- Join chatroom/Open website
- Choose/Change username
- See online users
##### Story points: 6
##### Activity Diagram:
![OUCD](./ActivityDiagrams/ActivityReceiveMessage.png)

[Mockup: Receive message](./UseCases/mockups/Receive_Messages_MOC.png)

#### 3.1.10 Vote ban 
In case of bad behaviour users have the ability to vote ban a misbehaving user. The user can rightclick a name and select "vote to ban". Other users in tis chatroom get a notification and can vote between "yes" and "no".
##### Precondition:
- Join chatroom/Open website
##### Postcondition
/
##### Story points: 3

[No mockup available yet]

##### Activity Diagram:
![OUCD](./ActivityDiagrams/Activity_diagram_voteban.png)

#### 3.1.11 Customize interface
The user gets the ability to customize his user interface. They can select different modes and colors under the settings tab. The settings can be accessed with the gear button on the top right.  
##### Precondition:
- Join chatroom/Open website
- Select username
##### Postcondition
/
##### Story points: 2

[No Mockup available yet]

#### 3.1.12 Portable chat-host
The deliver the independent portable feature the entire services will run on a MicroController (MC). The MC is equipt with a strong portable battery. This battery needs to be monitored and charged regularly.
##### Precondition:
/
##### Postcondition
- Battery-status monitoring
##### Story points: 2

#### 3.1.13 Battery-status monitoring
This is an administration use case. The battery needs to be monitored. There are many options available. A seperat admin gui with password security or information emails in regular intervalls would be possible. A solution is tbd.
##### Precondition:
Portable chat-host
##### Postcondition
/
##### Story points: 3

[No mockup available yet]

## 4. Supporting Information
For any further information you can contact the MC-Messenger Team or check our [Blog](https://semcmessenger.wordpress.com). 
The Team Members are:
- Marcel Fischer
- Erik Günther
- Erik Schneider
- Tim Nau
