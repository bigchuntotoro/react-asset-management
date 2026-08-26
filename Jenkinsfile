pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    environment {
        DB_HOST = 'localhost'
        DB_PORT = '3306'
        DB_NAME = 'reactdb'
        DB_USER = 'totoro'
        DB_PASSWORD = credentials('mariadb-password')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'GitHub 소스 다운로드'
                checkout scm
            }
        }

        stage('Java Version Check') {
            steps {
                sh '''
                    java -version
                    javac -version
                    echo "JAVA_HOME=$JAVA_HOME"
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    chmod +x gradlew
                    ./gradlew clean build -x test
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    ./gradlew test
                '''
            }
        }

        stage('Stop Existing Server') {
            steps {
                sh '''
                    if [ -f app.pid ]; then
                        PID=$(cat app.pid)
                        if kill -0 $PID 2>/dev/null; then
                            echo "기존 Spring Boot 서버 종료: $PID"
                            kill $PID
                            sleep 5
                        fi
                        rm -f app.pid
                    fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    JAR_FILE=$(find build/libs -name "*.jar" ! -name "*-plain.jar" | head -n 1)

                    echo "Deploying: $JAR_FILE"

                    nohup java -jar "$JAR_FILE" \
                        --spring.profiles.active=prod \
                        > springboot.log 2>&1 &

                    echo $! > app.pid
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 10

                    if ps -p $(cat app.pid) > /dev/null; then
                        echo "Spring Boot 실행 성공"
                    else
                        echo "Spring Boot 실행 실패"
                        cat springboot.log
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo 'Spring Boot 빌드 및 배포 성공'
        }

        failure {
            echo '빌드 또는 배포 실패'
        }

        always {
            archiveArtifacts artifacts: 'build/libs/*.jar', fingerprint: true
        }
    }
}