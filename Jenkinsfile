def dockerImage

pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = 'dockerHubCred'   // Jenkins credential ID for Docker Hub
    KUBECONFIG_CRED = 'kubeconfig'     // Jenkins secret file ID for kubeconfig
    DOCKER_REPO = 'sandeepdj11/nodejs-app'// replace with your Docker Hub repo
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_FULL = "${DOCKER_REPO}:${IMAGE_TAG}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build image') {
      steps {
        script {
          // If you want to build into Minikube's docker daemon (optional), uncomment:
          sh 'eval $(minikube -p minikube docker-env)'
          // build image on Jenkins agent
          dockerImage = docker.build("${IMAGE_FULL}")
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          // Use the stored credentials to push
          docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CRED}") {
            dockerImage.push("${IMAGE_TAG}")
            dockerImage.push("latest")
          }
        }
      }
    }

    stage('Create / update imagePullSecret in K8s') {
      steps {
        // Use kubeconfig credential file and Docker Hub username/password from Jenkins credentials
        withCredentials([
          file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG_FILE'),
          usernamePassword(credentialsId: "${DOCKERHUB_CRED}", usernameVariable: 'DH_USER', passwordVariable: 'DH_TOKEN')
        ]) {
          script {
            // create secret manifest (client-side) then apply (this avoids storing password on text)
            sh """
              kubectl --kubeconfig=$KUBECONFIG_FILE create secret docker-registry dockerhub-secret \
                --docker-username=${DH_USER} \
                --docker-password=${DH_TOKEN} \
                --docker-email=you@example.com \
                --dry-run=client -o yaml | kubectl --kubeconfig=$KUBECONFIG_FILE apply -f -
            """
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG_FILE')]) {
          sh """
            kubectl --kubeconfig=$KUBECONFIG_FILE set image deployment/nodejs-app nodejs-app=latest--record || true
            kubectl --kubeconfig=$KUBECONFIG_FILE apply -f kubernetes-deployment.yml
            kubectl --kubeconfig=$KUBECONFIG_FILE rollout status deployment/nodejs-app
          """
        }
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_FULL}"
    }
    failure {
      echo "Pipeline failed"
    }
    always {
      // lightweight cleanup if desired
      sh "docker rmi ${IMAGE_FULL} || true"
    }
  }
}
