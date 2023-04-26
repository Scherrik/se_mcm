# Code Refactoring Sumary - Clean Code

## Introduction
In this sumary we document what has been done so our code follow the lean code principles. This document will be expanded over time. 
The document is divided into the parts: HTML, CSS, JS and C++ (old MC backend)

## HTML
- Our HTML is kept pretty simple and straight forward and consists of 76 lines. 
## CSS
- CSS is divided into different files
-
## Frontend-JS
- Our JS ist devided into different files to increase readability: The main files are: main, user, messsage. The names automativally explain the porpuse of the file
- Renaming of the functions with more expressive names. Example: print() => addMessageToChatBox()
- Comments added
- YAGNI: You Aren't Gonna Need It - Removed unnecessary code 
- DRY: Don't Repeat Yourself - Repeated code has been cleared
## Backend node.js
- Comments added
- KISS: Keep It Simple Stupid - The fonctions are coded as simple as possible  
- YAGNI: You Aren't Gonna Need It - Removed unnecessary code 
- DRY: Don't Repeat Yourself - Repeated code has been cleared
## C++
on hold due to the move to node.js
