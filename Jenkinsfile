// Jenkinsfile para un proyecto Node.js/Express + React Vite con PostgreSQL

pipeline {
    // Define dónde se ejecutará el pipeline. 'any' significa en cualquier agente disponible.
    agent any

    // Define variables de entorno que estarán disponibles en todos los pasos del pipeline.
    environment {
        // --- Backend (Node.js/Express) ---
        // Puerto en el que se espera que el backend se ejecute en tu VM
        PORT_BACKEND = '3003' // Manteniendo el puerto 3003 que ya tienes
        // Configuración de la base de datos PostgreSQL.
        // ¡Variables de entorno actualizadas para tu despliegue de prueba!
        DB_USER = 'admin_boletas'
        DB_PASSWORD = 'password'
        DB_HOST = 'localhost'
        DB_PORT = '5432'
        DB_NAME = 'boletas_db'
        
        JWT_KEY_MASTER = 'KJSVKJSDVK-S.DVSDVSS616SV65SD1V1SS5V1SV51SC' // Manteniendo esta variable

        // Construyendo la URL de la base de datos para uso interno en el Jenkinsfile (ej. para migraciones)
        DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

        // Define la ruta a la carpeta del backend dentro de tu repositorio
        BACKEND_PATH = 'backend' 
        
        // --- Frontend (React Vite) ---
        // URL a la que el frontend debe hacer las llamadas API.
        // Reemplaza 'your-vm-ip-or-domain' con la IP de tu VM o el dominio si lo configuraste en Nginx.
        VITE_APP_BACKEND_URL = "http://192.168.100.177:${PORT_BACKEND}"
        // Define la ruta a la carpeta del frontend dentro de tu repositorio
        FRONTEND_PATH = 'frontend'

        // --- Rutas de Despliegue en la VM CentOS 9 ---
        // Directorio base donde se desplegará tu aplicación en la VM
        DEPLOY_BASE_DIR = '/var/www/boletasweb'
    }

    // Define las diferentes etapas de tu pipeline.
    stages {
        // 1. Etapa de 'Checkout': Obtiene el código fuente de tu repositorio Git.
        stage('Checkout Source Code') {
            steps {
                // Clonar el repositorio. Jenkins ya sabe qué repositorio y credenciales usar
                // porque lo configuraste en el Job de Jenkins.
                git branch: 'main', url: 'https://github.com/limber-git/ACS2025.git'
                // NOTA: 'your-github-credentials-id' es el ID que le diste a tus credenciales (ej. 'github-pat' o 'my-ssh-key')
                // Si tu repo es público, puedes omitir 'credentialsId'.
                // Asegúrate de usar la rama correcta (ej. 'main', 'master').
            }
        }

        // 2. Etapa de 'Build e Instalación de Dependencias del Backend'
        stage('Build Backend & Install Deps') {
            steps {
                dir("${BACKEND_PATH}") { // Cambia al directorio del backend
                    echo 'Instalando dependencias del backend...'
                    sh 'npm install' // Instala las dependencias de Node.js
                    
                    // Si tu backend tiene un paso de 'build' (ej. TypeScript a JavaScript), actívalo aquí
                    // echo 'Compilando el backend (si aplica)...'
                    // sh 'npm run build' 
                }
            }
        }
        
        // 3. Etapa de 'Migración de Base de Datos'
        stage('Database Migration') {
            steps {
                dir("${BACKEND_PATH}") { // Asegúrate de estar en el directorio del backend para ejecutar migraciones
                    echo 'Ejecutando migraciones de base de datos...'
                    // Este comando asume que tienes un script npm llamado 'migrate' en tu package.json del backend
                    // Por ejemplo: "migrate": "npx sequelize-cli db:migrate" o similar para TypeORM/Knex
                    // Asegúrate de que tu script de migración use la variable de entorno DATABASE_URL
                    sh "DATABASE_URL=${DATABASE_URL} npm run migrate" 
                }
            }
        }

        // 4. Etapa de 'Pruebas del Backend'
        stage('Test Backend') {
            steps {
                dir("${BACKEND_PATH}") {
                    echo 'Ejecutando pruebas del backend...'
                    sh 'npm test' // Ejecuta tus pruebas unitarias/de integración del backend
                }
            }
        }

        // 5. Etapa de 'Build e Instalación de Dependencias del Frontend'
        stage('Build Frontend & Install Deps') {
            steps {
                dir("${FRONTEND_PATH}") { // Cambia al directorio del frontend
                    echo 'Instalando dependencias del frontend...'
                    sh 'npm install' // Instala las dependencias de React Vite
                    
                    echo 'Compilando el frontend con Vite...'
                    // Vite necesita las variables de entorno inyectadas en tiempo de build
                    // Asegúrate de que tu configuración de Vite (vite.config.js) use import.meta.env
                    // Y que VITE_APP_BACKEND_URL esté definida correctamente en el environment de este Jenkinsfile.
                    sh "VITE_APP_BACKEND_URL=${VITE_APP_BACKEND_URL} npm run build" 
                    // Esto generará la carpeta 'dist' por defecto en Vite
                }
            }
        }

        // 6. Etapa de 'Pruebas del Frontend'
        stage('Test Frontend') {
            steps {
                dir("${FRONTEND_PATH}") {
                    echo 'Ejecutando pruebas del frontend...'
                    // El flag --watchAll=false es crucial para que las pruebas no se queden "escuchando" indefinidamente.
                    sh 'npm test -- --watchAll=false' 
                }
            }
        }

        // 7. Etapa de 'Deploy' (Despliegue)
        stage('Deploy') {
            steps {
                script {
                    echo "Iniciando la fase de despliegue en la VM CentOS 9..."

                    // 1. Limpiar directorios de despliegue antiguos (opcional, pero buena práctica)
                    echo "Limpiando directorios de despliegue antiguos en ${DEPLOY_BASE_DIR}..."
                    // 'sudo' es necesario si el usuario 'jenkins' no tiene permisos directos en /var/www
                    // Asegúrate de haber configurado 'sudoers' para el usuario jenkins como te indiqué antes.
                    sh "sudo rm -rf ${DEPLOY_BASE_DIR}/backend ${DEPLOY_BASE_DIR}/frontend"

                    // 2. Crear directorios si no existen
                    echo "Creando directorios de despliegue si no existen..."
                    sh "sudo mkdir -p ${DEPLOY_BASE_DIR}/backend"
                    sh "sudo mkdir -p ${DEPLOY_BASE_DIR}/frontend"

                    // 3. Copiar el código del backend compilado (o solo los archivos necesarios)
                    echo "Copiando archivos del backend a ${DEPLOY_BASE_DIR}/backend..."
                    // Aquí copias todo lo necesario para que tu backend corra.
                    // Si tienes un paso de 'build' que genera una carpeta 'dist' en el backend, copia esa.
                    // Si solo son archivos JS, copia los directorios relevantes.
                    sh "sudo cp -R ${BACKEND_PATH}/* ${DEPLOY_BASE_DIR}/backend/"
                    // O si tu build del backend genera una carpeta 'dist':
                    // sh "sudo cp -R ${BACKEND_PATH}/dist/* ${DEPLOY_BASE_DIR}/backend/"
                    // sh "sudo cp ${BACKEND_PATH}/package.json ${DEPLOY_BASE_DIR}/backend/" // Copia package.json para PM2
                    // sh "sudo cp ${BACKEND_PATH}/package-lock.json ${DEPLOY_BASE_DIR}/backend/" // y package-lock.json

                    // 4. Copiar los archivos estáticos del frontend (la carpeta 'dist' de Vite)
                    echo "Copiando archivos del frontend (dist) a ${DEPLOY_BASE_DIR}/frontend..."
                    sh "sudo cp -R ${FRONTEND_PATH}/dist/* ${DEPLOY_BASE_DIR}/frontend/"

                    // 5. Reiniciar la aplicación de Node.js con PM2
                    echo "Reiniciando la aplicación Node.js con PM2..."
                    // Este comando intentará reiniciar la aplicación si ya existe ('my-simple-node-app')
                    // Si no existe, la iniciará por primera vez.
                    // Asegúrate de que la ruta a tu archivo principal del backend (server.js, app.js, index.js) sea correcta.
                    // También, las variables de entorno para el backend (ej. DATABASE_URL, PORT)
                    // deben estar disponibles para PM2. Una forma es pasarlas directamente o que PM2
                    // lea un archivo .env en el directorio del backend.
                    sh "sudo pm2 restart my-simple-node-app || sudo pm2 start ${DEPLOY_BASE_DIR}/backend/src/server.js --name my-simple-node-app --env production"
                    // Nota: Asegúrate de que tu 'src/server.js' exista y sea el punto de entrada de tu Express app.
                    // Si tu backend tiene un .env, PM2 puede cargarlo si estás en el directorio correcto.
                    // sh "cd ${DEPLOY_BASE_DIR}/backend && sudo pm2 restart my-simple-node-app || sudo pm2 start src/server.js --name my-simple-node-app --env production"


                    // 6. Recargar la configuración de Nginx (si es necesario)
                    echo "Recargando configuración de Nginx..."
                    // Solo es necesario recargar Nginx si cambiaste su configuración.
                    // Si Nginx solo sirve los archivos de /var/www/my-simple-app/frontend/dist,
                    // y esa ruta no cambió, entonces un simple recargo no siempre es estrictamente necesario,
                    // pero es una buena práctica para asegurar que los cambios se reflejen.
                    sh "sudo systemctl reload nginx" 

                    echo "¡Despliegue local completado exitosamente!"
                }
            }
        }
    }

    // Define acciones a realizar después de que el pipeline finaliza (éxito o fallo).
    post {
        always {
            echo 'Pipeline finalizado.'
        }
        success {
            echo '¡Pipeline completado con éxito!'
            // Puedes añadir notificaciones por correo electrónico o Slack aquí para builds exitosos
        }
        failure {
            echo '¡El pipeline ha fallado! Revisa los logs.'
            // Puedes añadir notificaciones por correo electrónico o Slack aquí para builds fallidos
        }
    }
}