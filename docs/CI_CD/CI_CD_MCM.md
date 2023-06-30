# CI/CD Setup for the project MC-Messenger
## Includes:
- Build pipeline (per branch)
- Unittests
- Test report creation (including coverage)
- Manual (stress-)tests
- Automatic release 
- Automatically notify development/devops team via discord about build status and failures 
- Strict separation of development and production code

## Used components:
- Jenkins in connection with github and discord (Jira could be included as well)
- Runs on a raspberry pi 2B+ ...but it runs ;)

## Summary:
We use Jenkins for CI/CD Environment. Our Pipeline is shown in the picture below. Below the picture you can find a explanation regarding this process.

![OUCD](/docs/CI_CD/git_jenkins_CI_CD_workflow.jpg)

CI/CD Pipeline, also view on GitHub
We use two branches for the deployment. The first is called dev_nmcm, the second test_nmcm and got renamed to rel_nmcm. Don’t be confused, the picture still shows the old name!
The picture shows the three most possible paths our pipline could go through. One path is a sucessfull deploy, the other two are failures on the different points.

### Path 1 – sucessfull release:

- The MCM development team comits new changes to the dev_nmcm branche.
- Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
- If sucessful: The new commits are transfered to the test_nmcm (rel_nmcm) branch.
- The webpage is deployed to the livetest server (hosted on a Raspberry Pi)
- The developer executes live- and stresstests and sets a version tag (major, minor, patch)
- The developer triggers the release. The application is deployed on the release server (also hosted on a Raspberry Pi)

### Path 2 – Failure during unit tests

- The MCM development team comits new changes to the dev_nmcm branche.
- Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
- Not sucessful: Abort => developers are notified via discord (seperate channel on the dev-team-server

### Path 3 – Failure or abort during live testing

- The MCM development team commits new changes to the dev_nmcm branche.
- Jenkins starts a automatic build and executes the unit tests. An automatic test report is created and stored on the branche in the folder MC_Messenger/unittests in the form of a html file
- If sucessful: The new commits are transfered to the test_nmcm (rel_nmcm) branch.
- The webpage is deployed to the livetest server (hosted on a Raspberry Pi)
- The developer executes live- and stresstests and sets a version tag (major, minor, patch)
- Release abort is triggered due to failure or wish to abort. => developers are notified via discord (seperate channel on the dev-team-server
