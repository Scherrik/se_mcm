def approvalMap
def version = ""

pipeline {
    agent any

    triggers {
        upstream(upstreamProjects: "../MCM_Deploy/dev_nmcm", threshold: hudson.model.Result.SUCCESS)
    }
    options {
        disableConcurrentBuilds abortPrevious: true
    }
    stages {
        stage ('Get latest from dev'){
            steps {
                print "Merge dev_nmcm..."
                
                sh 'git config pull.rebase false && git pull origin dev_nmcm'
            }
        }
        stage('Start npm livetest session'){
            steps {
                npm command: 'install', workspaceSubdirectory: 'Mc_Messenger'
                dir('Mc_Messenger'){
                    script {
                        pid = sh ( script: 'npm start 8080 livetest & echo \$!;', returnStdout: true).trim() ;
                    }
                }
            }
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
                // Cleanup and shutdown test server
                script {
                    if(pid){
                        sh "kill -9 ${pid} || echo Process not found"
                    }
                }   
            }
        }
        stage ('Deploy'){
            steps {
                timeout(60) {                // timeout waiting for input after 60 minutes
                    script {
                        // capture the approval details in approvalMap. 
                         versionUpdate = input id: 'version', 
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
                script {
                    if(versionUpdate == "NONE"){
                        echo "No release for this build"
                        currentBuild.result = 'ABORTED'
                        error('Stopping early…')
                    }
                }
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
            
            script {
                echo "This build gets a ${versionUpdate} update"
                pjson = readJSON file: 'Mc_Messenger/package.json'
                print pjson["version"];
                vers = pjson["version"].split('.');
                print vers;
                if(versionUpdate == "MAJOR"){
                    vers[0] = vers[0].toInteger()+1;
                } else if(versionUpdate == "MINOR"){
                    vers[1] = vers[1].toInteger()+1;
                } else if(versionUpdate == "PATCH"){
                    vers[2] = vers[2].toInteger()+1;
                }
                
                versionStr = "${vers[0]}.${vers[1]}.${vers[2]}"
                pjson["version"] = versionStr
                writeJSON file: 'Mc_Messenger/package.json', json: pjson
                //Push to release branch and create a new version tag
                print "Push tag to github repo and release new version"
                
                echo "git push origin rel_nmcm"
                //sh "git push origin rel_nmcm"
                echo "git tag -a v${versionStr} -m \"New ${versionUpdate} update to ${versionStr}\""
                //sh "git tag -a v${versionStr} -m \"New ${versionUpdate} update to ${versionStr}\""
                //sh "git push --tags"
            }   
            
        }
        
    }
}
