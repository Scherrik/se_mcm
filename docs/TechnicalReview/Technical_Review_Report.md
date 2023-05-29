# Technical Review Report
1. Select a part of your source code for review, and document the reasoning behind 
-- why do you choose this part for review?

2. Perform a technical review meeting with your project team, ideally, also invite someone outside your team.

3. Document review meeting report. Suggested template:
## Date (start time and ending time)
25.05.2023

15.30 Uhr

16.30 Uhr

## Participants 
(roles, e.g., who make notes, who moderates/time keeper)
Marcel Fischer - Notes
Erik Günther - Moderator/Time keeper
Tim Nau 
Erik Schneider

## Goal/Focus of the review meeting (including why do you choose this part for review)

- Code review of components of the main.js + message.js + ui.js files - To verify the quality of the most important functions to communicate between front and backend.
- Addition of Content to the chat box


## Components for Review
main.js: 
- addMessagetoChatBox()
message.js:
- sendMessage()

ui.js:
-	checkUserName()
## Criteria of review (per component, if each component has different criteria), e.g., code quality, performance, security, scalability, maintainability, or any other relevant factors.
- code quality 
- scalability
- maintainability

---
## Review methodology, e.g. formal inspections, walkthroughs, code reviews, etc.
- code review
- walkthroughs

---
## Outcome from the meeting, 
e.g., action items (with responsible person and deadline), best practices, lessons learned.
- sendMessage():
Problems:
missing feature: extract usernames and determine their id (for private messages) 
(encryption currently disabled)
Flag for the message type is missing
Solutions:

### => add: name -> id mapping - Person: Erik Günther - deadline: 01.06.2023

### (=> add: encryption (tbd) )

### => add: Message type flag - Person: Erik Günther - deadline: 01.06.2023

Positive:
Coded after the principles of clean code



- addMessagetoChatBox():
Problems:
- dynamic creation of the layout is bad to maintain and scale: every new message is build completly new every time instead of a template which gets filled.
- no differentiation between types of messages
Solutions:
Advantage of Templates: Use of different message types (votes, text, picture, video)

### => Create Templates on how to fill the chat window - Person: Erik Schneider - deadline: Do. 01.06.2023

### => filter for type flag (set in the sendMessage() function) - Person: Erik Schneider - deadline: Do. 01.06.2023


- checkUserName()
Problems:
- username duplications are possible
Solutions

### => compare user input with userlist - Person: Tim Nau - deadline: 01.06.2023
