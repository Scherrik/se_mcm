# MCM - Testing Report

## Introduction
<!-- This section provides an overview of the software testing process and the scope of the testing activities. ### Marcel -->
The scope of this document will be to demonstrates the results of the testing campaign of the project MC-Messenger. 
The goal of testing is to assure the correct functionality of our code and to expose unnoticed errors after a new update has been pushed to the project.

The main focus of the testing will be automated unit tests with Jenkins.
The secondary focus are manuell Smoke and Stress Tests before public deployment of a new build


## Test Strategy
<!-- This section describes the overall approach to testing, including the testing methodology, testing types, and testing techniques used. Highlight which automatic testing tools/frameworks are used for your project -->

### Type of Tests
We want to focuse on the following tests:
- Unit Test: Testing of most of the implemented functions (js) 
- Smoke Test & Stress Test

### Target test coverage
Examples:
- message shown in the text box.
- Behaviour of the page without a websocket
- Check for empty string.
- Many test from the files:
- Message and user functions.
=> Planned coverage: 50%
=> Final coverage: 37%

### Testing tool
Our automatic testing tool will be Jenkins

### Manage of the test cases: 
In Jenkins: - We tag a test with the last git commit message
Every Build gets a downloadable test report

## Test Plan
<!-- This section outlines the specific testing tasks, timelines, and resources required to achieve the testing objectives. -->
<!-- ### Tim Nau-->
For the Testing in our Project we sat togehter and discussed which tool we wanted to use for our Project, we went with Jenkins to setup Testing and our CI/CD environment.
For the CI_CD setup we settled on the following functions that needed to be incluced:
- Build pipeline (per branch)
- Unittests
- Test report creation (including coverage)
- Manual (stress-)tests
- Automatic release
- Automatically notify development/devops team via discord about build status and failures
- Strict separation of development and production code

This setup allowed us to use two Branches in development the first one beeing the development branch and the other one the realease branch. To ensure that the code we added into the dev branch only gets pushed to the release Branch if everything works as intended we needed to add Unittest to ensure that, therefore we came up with our Testing Strategie.

We came up with the Test Cases we wanted to Test, to organize ourselfs we split the unittests into tasks that we could implement into Jira and assign to the Team Members. For the Tests themself we often set together and talked about how we can implement them in the best way, because some of us already had more knowledge then others this was helpful to make up for questions and ensure that each test actually works like the test case we defined it in. After everything was clear, the members that were responsible for writing the test could code and implement them into our code and track their Progress in Jira. After the Tests werre implemented we checked if they worke and them we used them in our CI/CD setup.

## Test Cases and Results
<!-- This section details the specific test cases that were executed, including their pass/fail status and any defects found during testing. (You may link to the repository of your use cases.) -->
<!-- ## Test Results -->
<!-- This section summarizes the results of the testing, including major defects found, their severity, and the steps taken to resolve them. (You may link to the test reports generated by your testing tool.) -->
<!-- ### Erik G -->
The code for Testing is stored in the unittest folder:

[Test folder](https://github.com/Scherrik/se_mcm/tree/dev_nmcm/Mc_Messenger/unittests)

The jenkins pipeline is configured in a jenkins file:

[Jenkins File](https://github.com/Scherrik/se_mcm/blob/dev_nmcm/Jenkinsfile)


![Test cases and results](../Finals/images/test_report.png?raw=true "Test cases and results")<br>
The whole document as html: [Test cases and results document](https://github.com/Scherrik/se_mcm/tree/rel_nmcm/Mc_Messenger/unittests/test-report.html)

### => The testing campaign did not reveal any big errors. (for more, see the chapter Recommendations)

## Metrics
<!-- This section provides quantitative data on the testing process, such as the number of defects found, the defect resolution time, and the test coverage achieved. -->

### The following image shows our test coverage. The planned coverage was not achieved but we got enough information from the achieved 37% of all functions.
![Code coverage](../Finals/images/Code_Coverage.png?raw=true "Code coverage")
The whole document as html: [Code coverage document](https://github.com/Scherrik/se_mcm/tree/rel_nmcm/Mc_Messenger/unittests/test-report.html)
<!-- ### Erik G -->

## Recommendations 
<!-- This section offers suggestions for improving the testing process and the quality of the software. ### Marcel -->

To improve the testing quality and progress the following recommendations should be followed for future projects: 

### Focus on clean code: 
Testing had to be posponed because of unsuitable funstions: high coupling, low cohesion of the functions 
=> functions needed to be untangled and Helper functions were moved to an extra js file
### Focus on testability and apropiate choice of tests:
Many of our send and receive functions are difficult to test with unit testing. Different test strategies would hneed to be chose nfor those functions. (manual tests/stress tests after deployment for example)

### Start the writing of the tests much earlier: 
When we started writing unit tests most of the development was finished. 
Because of that we did not have many new builds which could benefit of the automated testing and not many automatic test reports where created.
Also there were  no major errors detected because those have been found an fixed way before that.

## Conclusion
<!-- This section summarizes the key findings of the testing and the overall status of the software quality. -->
In conclusion, the testing campaign for the MC-Messenger project successfully demonstrated the functionality of the code and helped identify any errors. The overall software quality was assessed through the implemented testing strategy. The test results and metrics provided valuable insights into the effectiveness of the testing process and identified areas for improvement. In future projects we can enhance the testing process and achieve higher software quality standards by implementing the recommendations mentioned above.
