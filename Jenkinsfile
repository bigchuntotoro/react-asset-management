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

        PATH         = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
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

        stage('Backend Deploy & Start with PM2') {
            steps {
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

                        # PM2에 해당 프로세스가 이미 활성화되어 있는지 검사
                        if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
                            echo "기존 PM2 프로세스 삭제 후 새로 등록합니다..."
                            pm2 delete "${APP_NAME}"
                        fi

                        echo "PM2로 Spring Boot 앱을 실행합니다..."
                        SPRING_DATASOURCE_URL="jdbc:mariadb://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&serverTimezone=UTC" \
                        SPRING_DATASOURCE_USERNAME="${DB_USER}" \
                        SPRING_DATASOURCE_PASSWORD='${PASS}' \
                        pm2 start java \
                          --name "${APP_NAME}" \
                          -- -jar "${APP_NAME}.jar" --spring.profiles.active=prod

                        pm2 save
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    sleep 10

                    # PM2 상태 체크 (online 여부 확인)
                    if pm2 describe "${APP_NAME}" | grep -q "online"; then
                        echo "Spring Boot가 PM2에서 정상적으로 실행 중입니다 (online)."
                        pm2 list
                    else
                        echo "Spring Boot 실행 실패! PM2 에러 로그를 출력합니다:"
                        echo "=========================================="
                        pm2 logs "${APP_NAME}" --lines 50 --raw
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