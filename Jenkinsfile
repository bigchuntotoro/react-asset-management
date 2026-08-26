pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    environment {
        DB_HOST     = 'localhost'
        DB_PORT     = '3306'
        DB_NAME     = 'reactdb'
        DB_USER     = 'totoro'
        DB_PASSWORD = credentials('mariadb-password')

        TARGET_DIR  = '/home/totoro/Reactproject/react-asset-management-app'
        APP_NAME    = 'react-asset-management'
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
                sh """
                    if [ -f "${TARGET_DIR}/app.pid" ]; then
                        PID=\$(cat "${TARGET_DIR}/app.pid")
                        if kill -0 \$PID 2>/dev/null; then
                            echo "기존 Spring Boot 서버 종료 중 (PID: \$PID)"
                            kill \$PID
                            sleep 5
                            # 5초 후에도 종료되지 않으면 강제 종료
                            if kill -0 \$PID 2>/dev/null; then
                                echo "강제 종료 진행 (PID: \$PID)"
                                kill -9 \$PID
                                sleep 2
                            fi
                        fi
                        rm -f "${TARGET_DIR}/app.pid"
                    fi
                """
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    # 1. Target 폴더 생성
                    mkdir -p "${TARGET_DIR}"

                    # 2. 빌드된 원본 JAR 파일 탐색
                    BUILD_JAR=\$(find "${WORKSPACE}/build/libs" -name "*.jar" ! -name "*-plain.jar" | head -n 1)
                    echo "빌드 완료된 JAR: \$BUILD_JAR"

                    if [ -z "\$BUILD_JAR" ]; then
                        echo "오류: JAR 파일을 찾을 수 없습니다."
                        exit 1
                    fi

                    # 3. Target 폴더로 복사
                    TARGET_JAR="${TARGET_DIR}/${APP_NAME}.jar"
                    cp -f "\$BUILD_JAR" "\$TARGET_JAR"
                    echo "서비스 폴더로 복사 완료: \$TARGET_JAR"

                    # 4. Jenkins가 프로세스를 강제 종료하지 않도록 설정 후 실행
                    cd "${TARGET_DIR}"
                    JENKINS_NODE_COOKIE=dontKillMe nohup java -jar "${APP_NAME}.jar" \
                        --spring.profiles.active=prod \
                        --spring.datasource.url="jdbc:mariadb://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&serverTimezone=UTC" \
                        --spring.datasource.username="${DB_USER}" \
                        --spring.datasource.password="${DB_PASSWORD}" \
                        > springboot.log 2>&1 &

                    # 5. PID 기록
                    echo \$! > app.pid
                    echo "신규 프로세스 시작 완료 (PID: \$(cat app.pid))"
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 15

                    PID_FILE="${TARGET_DIR}/app.pid"
                    LOG_FILE="${TARGET_DIR}/springboot.log"

                    if [ -f "\$PID_FILE" ] && ps -p \$(cat "\$PID_FILE") > /dev/null; then
                        echo "Spring Boot 정상 동작 확인 (PID: \$(cat \$PID_FILE))"
                    else
                        echo "Spring Boot 실행 실패! 최신 로그를 출력합니다:"
                        echo "=========================================="
                        if [ -f "\$LOG_FILE" ]; then
                            cat "\$LOG_FILE"
                        else
                            echo "springboot.log 파일이 존재하지 않습니다."
                        fi
                        echo "=========================================="
                        exit 1
                    fi
                """
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