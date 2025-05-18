pipeline {
	agent any

	stages {
		stage('Checkout') {
			steps {
				echo "🔎 Pulling source code..."
				git branch: 'production', 
					url: 'https://github.com/Kennex666/iDevForum-KTPM.git',
					credentialsId: 'token'  // RẤT QUAN TRỌNG!
			}
		}

		stage('Deploy with Docker Compose') {
			steps {
				script {
					if (isUnix()) {
						echo "🚀 Deploying app via docker-compose..."
						sh '''
							docker-compose down || echo "Nothing to stop"
							docker-compose up -d --build
						'''
					} else {
						echo "🚀 Deploying app via docker-compose..."
						bat '''
							docker-compose down || echo "Nothing to stop"
							docker-compose up -d --build
						'''
					}
				}
			}
		}
	}
}
