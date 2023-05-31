# MCM Technical Review Meeting - 25.05.2023

## Date and Time
### 25.05.2023

### 15.30 Uhr - 16.30 Uhr

---
## Participants 
Marcel Fischer - Notes

Erik Günther - Moderator/Time keeper

Tim Nau 

Erik Schneider

---
## Goal/Focus of the review meeting

- Code review of components of the main.js + message.js + ui.js files - To verify the quality of the most important functions to communicate between front and backend.
- Addition of Content to the chat box

---
## Components for Review
### main.js: 
- addMessagetoChatBox()
### message.js:
- sendMessage()
### ui.js:
-	checkUserName()

---
## Criteria of review
- code quality 
- scalability
- maintainability

---
## Review methodology
- code review
- walkthroughs

---
## Outcome from the meeting, 
Findings for each component:
### sendMessage():
#### Problems:
- missing feature: extract usernames and determine their id (for private messages) 
- Flag for the message type is missing
#### Solutions:

#### => add: name -> id mapping - Person: Erik Günther - deadline: 01.06.2023

#### => add: Message type flag - Person: Erik Günther - deadline: 01.06.2023

#### Positive:
Coded after the principles of clean code



### addMessagetoChatBox():
#### Problems:
- dynamic creation of the layout is bad to maintain and scale: every new message is build completly new every time instead of a template which gets filled.
- no differentiation between types of messages
#### Solutions:
Advantage of Templates: Use of different message types (votes, text, picture, video)

#### => Create Templates on how to fill the chat window - Person: Erik Schneider - deadline: Do. 01.06.2023

#### => filter for type flag (set in the sendMessage() function) - Person: Erik Schneider - deadline: Do. 01.06.2023


### checkUserName()
#### Problems:
- username duplications are possible
#### Solutions

#### => compare user input with userlist - Person: Tim Nau - deadline: 01.06.2023
