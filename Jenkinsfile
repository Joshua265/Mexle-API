pipeline {
    agent {
        docker {
            image 'node:12.20.1-buster'
            args '-p 5000:5000'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Deliver') {
            steps {
                sh 'npm start'
            }
        }
    }
}
