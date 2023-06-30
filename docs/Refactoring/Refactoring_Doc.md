# Code Refactoring Sumary - Clean Code

## Introduction
In this sumary we document what has been done so our code follow the lean code principles. This document will be expanded over time. 
The document is divided into the parts: HTML, CSS, JS and C++ (old MC backend)

## HTML
- Our HTML is kept pretty simple and straight forward and consists of 76 lines.
- Frontend redesign: cleanup of the page and buttons up, fixed bugs (wrapping text) ä implemented the logo. 
## CSS
- CSS is divided into different files
- color themes that the user can chose from. We as developers can easily add more. We just have to create a new .css file, fill it with a template, change the colors and add the new file into a switch case statement.

## Frontend-JS
- Our JS ist devided into different files to increase readability: The main files are: main, user, messsage. The names automativally explain the porpuse of the file
- Renaming of the functions with more expressive names. Example: print() => addMessageToChatBox()
- Comments added
- YAGNI: You Aren't Gonna Need It - Removed unnecessary code 
- DRY: Don't Repeat Yourself - Repeated code has been cleared
- Problem: high coupling, low cohesion of the functions =>  functions untangled, Helper functions moved to extra js file)
## Backend node.js
- Comments added
- KISS: Keep It Simple Stupid - The fonctions are coded as simple as possible  
- YAGNI: You Aren't Gonna Need It - Removed unnecessary code 
- DRY: Don't Repeat Yourself - Repeated code has been cleared
## C++
on hold due to the move to node.js
