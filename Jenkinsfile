pipeline {
    agent {
        docker {
            image 'node:12.20.1-buster' 
            args '-p 3000:3000' 
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
        stage('Build') { 
            steps {
                sh 'npm run build' 
            }
        }
        stage('Deliver') { 
            steps {
                sh 'npm start' 
            }
        }
    }
}