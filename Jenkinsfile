pipeline {
  agent any

  tools {
    nodejs '24.x'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Validate') {
      parallel {
        stage('Lint') {
          steps {
            sh 'npm run lint'
          }
        }
        stage('Test') {
          steps {
            sh 'npm test'
          }
        }
      }
    }

    stage('Package') {
      steps {
        sh 'task package'
      }
    }

    stage('Inspect') {
      steps {
        sh 'task inspect'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/*.tar.gz, appinspect.json', allowEmptyArchive: true
    }
  }
}
