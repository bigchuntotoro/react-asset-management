pipeline {
    agent any

    tools {
        jdk 'JDK21'
        nodejs 'NodeJS24'   // Jenkins에 등록된 NodeJS 도구 이름
    }

    environment {
        DB_HOST     = 'localhost'
        DB_PORT     = '3306'
        DB_NAME     = 'reactdb'
        DB_USER     = 'totoro'
        // Jenkins Credentials (Text 타입)
        DB_PASSWORD = credentials('mariadb-password')

        TARGET_DIR   = '/home/totoro/Reactproject/react-asset-management-app'
        APP_NAME     = 'react-asset-management'

        FRONTEND_DIR = "${WORKSPACE}/src/main/frontend"
        NGINX_ROOT   = '/usr/share/nginx/html/asset-management'
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

        stage('Frontend Build (Vite)') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        node -v
                        npm -v
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Frontend Deploy (Nginx)') {
            steps {
                sh """
                    if [ ! -d "${FRONTEND_DIR}/dist" ]; then
                        echo "오류: Vite 빌드 산출물(dist)을 찾을 수 없습니다."
                        exit 1
                    fi

                    sudo mkdir -p "${NGINX_ROOT}"
                    sudo rm -rf "${NGINX_ROOT}"/*
                    sudo cp -r "${FRONTEND_DIR}/dist"/* "${NGINX_ROOT}/"

                    echo "Nginx 설정 검증 및 재적용"
                    sudo nginx -t
                    sudo systemctl reload nginx
                """
            }
        }

        stage('Backend Build') {
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

        stage('Backend Deploy') {
            steps {
                // 비밀번호 마스킹 및 보안 강화를 위해 withCredentials 사용
                withCredentials([string(credentialsId: 'mariadb-password', variable: 'PASS')]) {
                    sh """
                        mkdir -p "${TARGET_DIR}"

                        BUILD_JAR=\$(find "${WORKSPACE}/build/libs" -name "*.jar" ! -name "*-plain.jar" | head -n 1)
                        echo "빌드 완료된 JAR: \$BUILD_JAR"

                        if [ -z "\$BUILD_JAR" ]; then
                            echo "오류: JAR 파일을 찾을 수 없습니다."
                            exit 1
                        fi

                        TARGET_JAR="${TARGET_DIR}/${APP_NAME}.jar"
                        cp -f "\$BUILD_JAR" "\$TARGET_JAR"
                        echo "서비스 폴더로 복사 완료: \$TARGET_JAR"

                        cd "${TARGET_DIR}"

                        # 1. 커맨드라인 인자(--spring.datasource...) 대신 셸 환경변수(SPRING_DATASOURCE_...)로 주입
                        # 2. ps aux 출력 시 비밀번호 노출 차단
                        SPRING_DATASOURCE_URL="jdbc:mariadb://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&serverTimezone=UTC" \
                        SPRING_DATASOURCE_USERNAME="${DB_USER}" \
                        SPRING_DATASOURCE_PASSWORD='${PASS}' \
                        JENKINS_NODE_COOKIE=dontKillMe \
                        nohup java -jar "${APP_NAME}.jar" --spring.profiles.active=prod > springboot.log 2>&1 &

                        echo \$! > app.pid
                        echo "신규 프로세스 시작 완료 (PID: \$(cat app.pid))"
                    """
                }
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
            echo 'Frontend(Nginx) + Backend(Spring Boot) 빌드 및 배포 성공'
        }
        failure {
            echo '빌드 또는 배포 실패'
        }
        always {
            archiveArtifacts artifacts: 'build/libs/*.jar', fingerprint: true
        }
    }
}