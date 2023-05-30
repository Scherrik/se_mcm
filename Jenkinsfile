def approvalMap
def version = ""

pipeline {
    agent any

    triggers {
        upstream(upstreamProjects: "../MCM_Deploy/dev_nmcm", threshold: hudson.model.Result.SUCCESS)
    }
    options {
        disableConcurrentBuilds abortPrevious: true
        skipDefaultCheckout true
    }
    stages {
        stage ('Get latest from dev'){
            steps {
                print "Merge dev_nmcm..."
                checkout scmGit(branches: [[name: 'origin/dev_nmcm']], extensions: [[$class: 'PreBuildMerge', options: [mergeStrategy: 'default', mergeRemote: 'origin', mergeTarget: 'rel_nmcm']]], userRemoteConfigs: [[credentialsId: 'b7c501a2-76b7-4f1c-bff0-10b91f0e03be', url: 'git@github.com:Scherrik/se_mcm', name: 'origin']])
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
                                        ok: 'All tests pass and no other findings?', 
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
                    if(approvalMap.containsValue('no') || approvalMap['FailDescr'] != '--'){
                        currentBuild.result = 'ABORTED';
                        error('Some test(s) fail');
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
                                        ok: 'Release?', 
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
                        error('No release build')
                    }
                }
            }
        }
    }
    post {
        always {
            print "Send to discord"
        }
        aborted {
            print ("ABORTED");
            discordSend description: "Aborted through tester\n", 
                        footer: "Last commit: " + env.GIT_COMMIT, 
                        link: env.BUILD_URL, 
                        result: currentBuild.currentResult, 
                        title: "Jenkins MCM Pipeline Release Build", 
                        webhookURL: "https://discord.com/api/webhooks/1101127810992578772/tJdKaSwMOIgfv07yWk6xdu9qR4yEFg2K48PNAW32kECnaZ_6oFSsz-DsJ_EHQoVD1j_s"
        }
        success {
            print ("SUCCESS");
            
            script {
                echo "This build gets a ${versionUpdate} update"
                def pjson = readJSON file: 'Mc_Messenger/package.json'
                def oldVersion = pjson["version"];
                def vers = '';
                print oldVersion
                if(oldVersion instanceof String) {
                    print ">> String"
                    vers = oldVersion.tokenize('.');
                }
                else {
                    print ">> ${oldVersion.getClass()}"
                    vers = oldVersion.toString().tokenize('.');
                }
                if(versionUpdate == "MAJOR"){
                    vers[0] = vers[0].toInteger()+1;
                    vers[1] = 0;
                    vers[2] = 0;
                } else if(versionUpdate == "MINOR"){
                    vers[1] = vers[1].toInteger()+1;
                    vers[2] = 0;
                } else if(versionUpdate == "PATCH"){
                    vers[2] = vers[2].toInteger()+1;
                }
                
                
                sshagent(['b7c501a2-76b7-4f1c-bff0-10b91f0e03be']) {
                    //echo "git push origin rel_nmcm"
                    sh "git branch -a"
                    sh "git checkout rel_nmcm && git pull origin rel_nmcm"
                    
                    def newVersion = "${vers[0]}.${vers[1]}.${vers[2]}"
                    pjson["version"] = newVersion.toString();
                    writeJSON file: 'Mc_Messenger/package.json', json: pjson, pretty: 4;
                    
                    //Push to release branch and create a new version tag
                    print "Push tag to github repo and release new version ${newVersion}"
                    sh "git commit -am \"${versionUpdate} Version update from ${oldVersion} to ${newVersion}\" || true"
                    sh "git push origin rel_nmcm"
                    //echo "git tag -a v${newVersion} -m \"New ${versionUpdate} update to ${newVersion}\""
                    sh "git tag -a v${newVersion} -m \"New ${versionUpdate} release ${newVersion}\""
                    sh "git push --tags"
                    sh "git checkout dev_nmcm && git pull origin dev_nmcm && yes | git checkout --patch rel_nmcm Mc_Messenger/package.json && git push origin dev_nmcm || true"
                }
                
                
                discordSend description: "New ${versionUpdate} update released\nVersion: ${newVersion}\nOld: ${oldVersion}", 
                        footer: "Last commit: " + env.GIT_COMMIT, 
                        link: env.BUILD_URL, 
                        result: currentBuild.currentResult, 
                        title: "Jenkins MCM Pipeline Release Build", 
                        webhookURL: "https://discord.com/api/webhooks/1101127810992578772/tJdKaSwMOIgfv07yWk6xdu9qR4yEFg2K48PNAW32kECnaZ_6oFSsz-DsJ_EHQoVD1j_s"
            }
        }
        /*
        cleanup {
            script {
                sh "git clean -fdx"
            }
        }
        */
        
    }
}
