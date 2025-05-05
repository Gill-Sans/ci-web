import groovy.transform.Field

@Field String TARGET_REPO = ''
@Field String GHCR_CREDENTIALS = 'ghcr-credentials'
@Field String SERVICE_NAME = 'capit-gateway'
@Field String KUBE_CREDENTIALS = 'kubeconfig-dev'

pipeline {
  agent any
  environment {
    GHCR_CREDENTIALS = 'ghcr-credentials'
    KUBE_CREDENTIALS = 'kubeconfig-dev'
    SERVICE_NAME = 'ci-web'
    IMAGE_NAME = "ghcr.io/gill-sans/ci-api/${SERVICE_NAME}"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/dev']],
            userRemoteConfigs: [[url: 'https://github.com/Gill-Sans/ci-web.git']]
        ])
      }
    }
    stage('Install & Build') {
      steps {
        dir('ci-web') {
          sh 'npm ci'
          sh 'npm run build -- --configuration development'
        }
      }
    }
    stage('Build Image') {
      steps {
        script {
          sh "podman build -t ${IMAGE_NAME}:${BUILD_NUMBER} -f ci-web/Dockerfile ."
        }
      }
    }
    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(
            credentialsId: GHCR_CREDENTIALS,
            usernameVariable: 'GHCR_USER',
            passwordVariable: 'GHCR_TOKEN'
        )]) {
            sh """
            echo "${GHCR_TOKEN}" | podman login ghcr.io --username="${GHCR_USER}" --password-stdin
            podman push ${IMAGE_NAME}:${BUILD_NUMBER}
            podman tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
            podman push ${IMAGE_NAME}:latest
            """
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
          sh 'kubectl --kubeconfig=$KUBECONFIG apply -f ci-web/k8s-deployment.yaml'
          sh 'kubectl --kubeconfig=$KUBECONFIG rollout status deployment/${SERVICE_NAME} --timeout=300s'
        }
      }
    }
  }
  post {
    success {
      echo "Frontend deployed successfully"
    }
    failure {
      echo "Frontend deployment failed"
    }
  }
} 