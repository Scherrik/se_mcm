def approvalMap

pipeline {
    agent any

    triggers {
        upstream(upstreamProjects: "../MCM_Deploy/dev_nmcm", threshold: hudson.model.Result.SUCCESS)
    }
    
    stages {
        stage ('Get latest from dev'){
            print "Merge dev_nmcm..."
        }
        stage ('Stresstest'){
            agent none
            steps {
                timeout(60) {                // timeout waiting for input after 60 minutes
                    script {
                        // capture the approval details in approvalMap. 
                         approvalMap = input id: 'test', 
                                        message: 'Hello', 
                                        ok: 'Proceed?', 
                                        parameters: [
                                            choice(
                                                choices: 'yes\nno', 
                                                description: 'Contrast in dark theme ok?', 
                                                name: 'DarkTheme'
                                            ),
                                            choice(
                                                choices: 'yes\nno', 
                                                description: 'Contrast in bright theme ok?', 
                                                name: 'BrightTheme'
                                            ),
                                            choice(
                                                choices: 'yes\nno', 
                                                description: 'Contrast in dhbw theme ok?', 
                                                name: 'DhbwTheme'
                                            ),
                                            choice(
                                                choices: 'yes\nno', 
                                                description: 'Angry mode works?', 
                                                name: 'AngryMode'
                                            ),
                                            string(
                                                defaultValue: '--', 
                                                description: 'Fails anything else?', 
                                                name: 'FailDescr'
                                            )
                                        ], 
                                        submitter: 'user1,user2,group1', 
                                        submitterParameter: 'APPROVER'
                                            
                    }
                }
            }
        }
        stage ('Deploy'){
            steps {
                timeout(60) {                // timeout waiting for input after 60 minutes
                    script {
                        // capture the approval details in approvalMap. 
                         approvalMap = input id: 'version', 
                                        message: 'Hello', 
                                        ok: 'Version update?', 
                                        parameters: [
                                            choice(
                                                choices: 'NONE\nMAJOR\nMINOR\nPATCH', 
                                                description: 'Choose version upgrade mode', 
                                                name: 'Version'
                                            )
                                        ]
                                            
                    }
                }
                if(approvalMap['Version'] == "NONE"){
                    echo "No release for this build"
                    currentBuild.result = 'ABORTED'
                    error('Stopping early…')
                } else {
                    echo "This build gets a ${approvalMap['Version']} update"
                }
                print "Push tag to github repo and release new version"
            }
        }
    }
    post {
        always {
            print "Send to discord"
            //discordSend description: "Jenkins Pipeline Build\nTest result: " + currentBuild.currentResult, footer: "Last commit: " + env.GIT_COMMIT, link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1101127810992578772/tJdKaSwMOIgfv07yWk6xdu9qR4yEFg2K48PNAW32kECnaZ_6oFSsz-DsJ_EHQoVD1j_s"
        }
        aborted {
            print ("ABORTED");
        }
        success {
            print ("SUCCESS");
            //Push to release branch and create a new version tag
            
        }
        
    }
}
