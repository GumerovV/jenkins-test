pipeline {
    agent any

    environment {
        IMAGE_NAME = "gateway:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '/usr/local/bin/docker build -t gateway:latest .'
            }
        }

       stage('Deploy to Kubernetes') {
           steps {
               sh '''
               /usr/local/bin/kubectl apply -f k8s/
               /usr/local/bin/kubectl rollout restart deployment gateway
               '''
           }
       }
    }
}