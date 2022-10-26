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

### 1.1 Purpose (Marcel)
This Software Requirements Specification (SRS) describes all specifications for our Project "MC-Messenger". 
It includes an overview about this project, its vision, requirements and their specific use-cases. 


### 1.2 Scope (Erik G)


### 1.3 Definitions, Acronyms and Abbreviations (Erik S)
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UC          | Use Case                               |


### 1.4 References

| Title                                                              | Date       | Publishing organization   |
| -------------------------------------------------------------------|:----------:| ------------------------- |
| [WordPress Blog](https://semcmessenger.wordpress.com)    | 06.10.2022 | MC-Messenger Team    |
| [GitHub](https://github.com/Scherrik/se_mcm)              | 06.10.2022 | MC-Messenger Team    |


### 1.5 Overview (Marcel)
The following chapter provides an overview of this project with vision and Overall Use Case Diagram. The third chapter (Requirements Specification) delivers more details about the specific requirements in terms of functionality, usability and design parameters. Finally there is a chapter with supporting information. 
    
## 2. Overall Description

### 2.1 Vision (Erik G)
Humans have the need to communicate. Today most of the communication is done via messenging services on the internet. If we can’t directly communicate verbaly we heavily dependent on good and fast internet services.
But: We also find ourselfes in environments where we are not allowed to speak or the situation makes it very difficult to communciate in private (e.g. school, university, library, industrial fairs, plane/train/bus, disco, loud bar).
In these situations communication gets impossible if there is no stable internet connection.
We want to provide an from the internet infrastructure independent and fast local bound Messenger-Service.

Our goal is to implement this vison with a browser accessible webserver and the help of a microcontroller.
This allows a portable and in almost every environment implementable chat server for everyone at that specific location. The users can use any device they want, it only needs a wifi connectibiliy and a browser. We want to provide a broadcast and private chat and the possibility for the user to select a costum username.

### 2.2 Use Case Diagram (all)

![OUCD](./UseCaseDiagramMCM.png)


### 2.3 Technology Stack (Marcel)

#### Backend:
-Hardware: ESP32 (ESP32 Wi-Fi & Bluetooth MCU I Espressif Systems)
-µC development: Arduino IDE with ESP SDK, Language: C++ Dialect (Arduino)

#### Frontend:
-HTML
-CSS
-JS

#### IDE:
-VisualStudio

#### Project Management:
-Jira
-GitHub
-Discord
-WordPress

#### Deployment:
-Browser

#### Testing:
-

## 3. Specific Requirements

### 3.1 Functionality (all)
This section will explain the different use cases, you could see in the Use Case Diagram, and their functionality.  

#### 3.1.1 Temp1
DESCRIPTION
#####Precondition:
##### Postcondition
##### Effort estimation / story points

[TEMP: Link zum Mockup oder direkt einfügen](./use_cases/temp1.md)

## 4. Supporting Information
For any further information you can contact the MC-Messenger Team or check our [Blog](https://semcmessenger.wordpress.com). 
The Team Members are:
- Marcel Fischer
- Erik Günther
- Erik Schneider
- Tim Nau

<!-- Picture-Link definitions: -->
[OUCD]: https://github.com/IB-KA/CommonPlayground/blob/master/UseCaseDiagramCP.png "Overall Use Case Diagram"
