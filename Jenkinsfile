pipeline {
    agent any

    stages {

        stage('Docker Compose Up') {
            steps {
                sh '''
                docker compose down || true
                docker compose up -d --build
                '''
            }
        }
    }
}