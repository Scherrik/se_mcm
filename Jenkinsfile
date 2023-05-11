pipeline {
    agent any

    stages {
        /*
        stage('Build') {
            steps {
                print "BUILD BUILD"
            }
        }
        */
        stage('Setup npm'){
            steps {
                npm install
            }
        }
        stage('Unit test') {
            steps {
                print "Executing..."
                dir('/Mc_Messenger'){
                   npm test
                }
            }
        
        }
        stage ('Stress test'){
            steps {
                print "Waiting for user input..."
                input message: 'Stresstest passed and ready to release?'
            }
        
        }
        stage ('Collect test results'){
            steps {
                print "Collecting test results..."
            }
        }
        stage ('Deploy'){
            steps {
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
