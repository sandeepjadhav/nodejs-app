def dockerImage
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
                    dockerImage = docker.build("nodejs-app:latest")
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        dockerImage.push("latest")
                    }
                }
            }
        }
        // stage('Build & Push Docker Image') {
        // steps {
        //     script {
        //         dockerImage = docker.build("sandeepdj11/nodejs-app:${env.BUILD_ID}")
        //         docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-cred') {
        //             dockerImage.push()
        //             dockerImage.push("latest")  // optional but useful
        //         }
        //         }
        //     }
        // }
        
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
    //     stage('Deploy to Kubernetes') {
    //          steps {
    //     withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
    //         sh 'kubectl config view'
    //         sh 'kubectl get nodes'
    //         sh 'kubectl apply -f kubernetes-deployment.yml'
    //     }
    // }
    //     }

    stage('Deploy to Kubernetes') {
    steps {
        withKubeConfig(credentialsId: 'kubeconfig-minikube') {
            sh 'kubectl apply -f kubernetes-deployment.yml'
            sh 'kubectl rollout restart deployment nodejs-app'
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
