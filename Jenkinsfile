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

        TARGET_DIR  = '/home/totoro/Reactproject/app'
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
                // Groovy 변수를 쉘에 전달하기 위해 큰따옴표("") 사용
                sh """
                    if [ -f "${TARGET_DIR}/app.pid" ]; then
                        PID=\$(cat "${TARGET_DIR}/app.pid")
                        if kill -0 \$PID 2>/dev/null; then
                            echo "기존 Spring Boot 서버 종료 (PID: \$PID)"
                            kill \$PID
                            sleep 5
                        fi
                        rm -f "${TARGET_DIR}/app.pid"
                    fi
                """
            }
        }

        stage('Deploy') {
            steps {
                // Groovy 변수를 쉘에 전달하기 위해 큰따옴표("") 사용
                sh """
                    # 1. 대상 폴더 생성 확인
                    mkdir -p "${TARGET_DIR}"

                    # 2. 빌드된 원본 JAR 파일 절대경로 탐색
                    BUILD_JAR=\$(find "${WORKSPACE}/build/libs" -name "*.jar" ! -name "*-plain.jar" | head -n 1)
                    echo "빌드 완료된 JAR: \$BUILD_JAR"

                    # 3. Target 폴더로 복사 및 표준파일명으로 지정
                    TARGET_JAR="${TARGET_DIR}/${APP_NAME}.jar"
                    cp -f "\$BUILD_JAR" "\$TARGET_JAR"
                    echo "서비스 폴더로 이동/복사 완료: \$TARGET_JAR"

                    # 4. 서비스 폴더 위치에서 환경변수 적용하여 백그라운드 구동
                    cd "${TARGET_DIR}"
                    nohup java -jar "${APP_NAME}.jar" \
                        --spring.profiles.active=prod \
                        --spring.datasource.url="jdbc:mariadb://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&serverTimezone=UTC" \
                        --spring.datasource.username="${DB_USER}" \
                        --spring.datasource.password="${DB_PASSWORD}" \
                        > springboot.log 2>&1 &

                    # 5. PID 생성
                    echo \$! > app.pid
                    echo "신규 프로세스 시작 (PID: \$(cat app.pid))"
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 10

                    PID_FILE="${TARGET_DIR}/app.pid"
                    LOG_FILE="${TARGET_DIR}/springboot.log"

                    if [ -f "\$PID_FILE" ] && ps -p \$(cat "\$PID_FILE") > /dev/null; then
                        echo "Spring Boot 실행 성공 (PID: \$(cat \$PID_FILE))"
                    else
                        echo "Spring Boot 실행 실패"
                        if [ -f "\$LOG_FILE" ]; then
                            echo "=== springboot.log ==="
                            cat "\$LOG_FILE"
                        fi
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