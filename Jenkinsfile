pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                print "BUILD BUILD"
            }
        }
        stage('Test') {
            steps {
                print "TEST TEST"
            }
        
        }
        stage ('Deploy'){
            steps {
                print "DEPLOY DEPLOY"
            }
        }
    }
    post {
        always {
            discordSend description: "Jenkins Pipeline Build", footer: "Test result: " + currentBuild.currentResult, link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1101127810992578772/tJdKaSwMOIgfv07yWk6xdu9qR4yEFg2K48PNAW32kECnaZ_6oFSsz-DsJ_EHQoVD1j_s"
        }
        success {
            print ("SUCCESS");
        }
        
    }
}
