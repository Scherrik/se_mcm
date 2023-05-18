def approvalMap

pipeline {
    agent any

    triggers {
        upstream(upstreamProjects: "../MCM_Deploy/dev_nmcm", threshold: hudson.model.Result.SUCCESS)
    }
    
    stages {
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
                                                choices: 'apple\npear\norange', 
                                                description: 'Select a fruit for this build', 
                                                name: 'FRUIT'
                                            ), 
                                            string(
                                                defaultValue: '', 
                                                description: '', 
                                                name: 'myparam'
                                            )
                                        ], 
                                        submitter: 'user1,user2,group1', 
                                        submitterParameter: 'APPROVER'
                                            
                    }
                }
            
                input message: "Is text readable in all color schemes? (Contrast)"
                input message: "Angry mode works?"
                input message: "UTF-8 support enabled? (Emoticons, ...)"
                input message: "
            }
        }
        stage ('Deploy'){
            steps {
                // print the details gathered from the approval
                echo "This build was approved by: ${approvalMap['APPROVER']}"
                echo "This build is brought to you today by the fruit: ${approvalMap['FRUIT']}"
                echo "This is myparam: ${approvalMap['myparam']}"
                print "Push tag to github repo and release new version"
            }
        }
    }
    post {
        always {
            print "Send to discord"
            //discordSend description: "Jenkins Pipeline Build\nTest result: " + currentBuild.currentResult, footer: "Last commit: " + env.GIT_COMMIT, link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1101127810992578772/tJdKaSwMOIgfv07yWk6xdu9qR4yEFg2K48PNAW32kECnaZ_6oFSsz-DsJ_EHQoVD1j_s"
        }
        success {
            print ("SUCCESS");
            
        }
        
    }
}
