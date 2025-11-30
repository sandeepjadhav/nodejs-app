pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nodejs-app"
        REGISTRY = "local" // optional for future registry push
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'eval $(minikube -p minikube docker-env)'
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }

        
        stage('Run Tests Inside Container') {
            steps {
                script {
                    dockerImage.inside {
                        sh 'npm install'
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
             steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
            sh 'kubectl config view'
            sh 'kubectl get nodes'
            sh 'kubectl apply -f kubernetes-deployment.yml'
        }
    }
        }
    }

    post {
        always {
            echo "Cleaning up dangling Docker images..."
            sh "docker system prune -f"
        }
        success {
            echo "Build successful: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo "Build failed. Check logs."
        }
    }
}
