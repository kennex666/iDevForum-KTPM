pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "🔎 Pulling source code..."
                git branch: 'production', url: 'https://github.com/Kennex666/iDevForum-KTPM.git',
				credentialsId: 'token'  // RẤT QUAN TRỌNG!

            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo "🚀 Deploying app via docker-compose..."
                
                // Nếu container cũ đang chạy thì down trước

				if (isUnix()) {
					sh '''
					docker-compose down || echo "Nothing to stop"
					'''
					
					sh '''
					docker-compose up -d --build
					'''
				} else {
					bat '''
					docker-compose down || echo "Nothing to stop"
					'''
					
					bat '''
					docker-compose up -d --build
					'''
				}
                
                // Up lại từ source code mới pull
            }
        }
    }
}
