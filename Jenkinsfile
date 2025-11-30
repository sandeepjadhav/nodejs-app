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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    dockerImage.inside("--entrypoint=''") {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                script {
                    kubeconfig(
                        credentialsId: 'kubeconfig', 
                        serverUrl: 'https://127.0.0.1:32769'
                    ) {
                        sh """
                        kubectl apply -f kubernetes-deployment.yml
                        kubectl rollout status deployment/nodejs-app --timeout=60s
                        """
                    }
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
