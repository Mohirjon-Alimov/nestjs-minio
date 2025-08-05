# MinIO File Storage API with NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>




A file storage service using MinIO object storage with NestJS backend API.

## Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
    - [MinIO Server Setup](#minio-server-setup)
    - [Project Setup](#project-setup)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Running the Project](#-running-the-project)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🛠 Prerequisites

- Node.js v18+
- npm
- Docker (optional)
- MinIO server (instructions below)

## 📥 Installation

### MinIO Server Setup

#### Option 1: Docker (Recommended)

```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=MINIO_ACCESS_KEY" \
  -e "MINIO_ROOT_PASSWORD=MINIO_SECRET_KEY" \
  -v minio_data:/data \
  minio/minio server /data --console-address ":9001"
```

#### Option 2: Native Installation

##### Linux/macOS:

```bash

wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
mkdir ~/miniodata
minio server ~/miniodata --console-address ":9001"
```

##### Windows (PowerShell):

```powershell

Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "$env:USERPROFILE\minio.exe"
mkdir $env:USERPROFILE\miniodata
$env:USERPROFILE\minio.exe server $env:USERPROFILE\miniodata --console-address ":9001"
```

## Project Setup

#### 1. Clone repository:

```bash

git clone https://github.com/Mohirjon-Alimov/nestjs-minio
cd nestjs-minio
```

#### 2. Install dependencies:

```bash

npm install
```

#### 3. Configure environment:

```bash

cp .env.example .env
```

#### 4. Edit .env file with your credentials.

## ⚙️ Configuration

#### Edit .env file:

```ini

# MinIO Configuration
MINIO_PORT=9000             # MinIO server port
MINIO_ENDPOINT=localhost    # MinIO server host
MINIO_ACCESS_KEY=           # MinIO access key (min 3 chars)
MINIO_SECRET_KEY=           # MinIO secret key (min 8 chars)
MINIO_BUCKET_NAME=files     # Default bucket name
MINIO_USE_SSL=true          # MinIO ssl

# App Configuration
PORT=3001                   # API server port
NODE_ENV=development        # Node environment
```

## 🌐 API Endpoints

| Method	 | Endpoint	          | Description     |
|---------|--------------------|-----------------|
| POST	   | /images/upload	    | Upload a image  |
| GET	    | /images/:filename	 | Download a file |

#### Example upload request:

```bash

curl -X POST -F "file=@test.jpg" http://localhost:3001/files/upload
```

## 🚀 Running the Project

#### Development mode:

```bash

npm run start:dev
```

#### Production mode:

```bash

npm run build
npm run start:prod
```

#### Using Docker:

```bash

docker-compose up --build
```

## 🐳 Deployment

#### Docker Compose

```yaml
version: '3.8'
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: MINIO_ACCESS_KEY
      MINIO_ROOT_PASSWORD: MINIO_SECRET_KEY
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - MINIO_ENDPOINT=minio
      - MINIO_PORT=9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    depends_on:
      - minio

volumes:
  minio_data:
```

## 🔧 Troubleshooting

### MinIO connection issues:

1. Verify MinIO is running at http://localhost:9001

2. Check credentials in .env match MinIO credentials

3. For Docker: Ensure containers are on same network

### File upload problems:

* Check bucket exists in MinIO console

* Verify file size limits (default: 10MB)

### Common errors:

```log

Error: Access Denied
```

Solution: Verify `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` are correct

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).