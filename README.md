# rada-app

Rada — a location-driven event discovery and posting web application.  
It includes a **React + Ant Design frontend**, a **Java + Undertow backend**, and a **Postgres + PostGIS database** for geospatial queries.

---

## 📦 Project Structure

This archive contains a starter project for **Rada** (frontend + backend):

- `frontend/` → Vite + React + Ant Design starter  
- `backend/` → Java + Undertow skeleton (Maven)  
- `docker-compose.yml` → Postgres + PostGIS for local development  

---

## Getting Started

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend

Ensure Java 17+ and Maven are installed:

```bash
cd backend
mvn package
java -jar target/rada-backend-0.1.0.jar
```

Or run via Docker:

```bash
docker build -t rada-backend backend
docker run -p 8080:8080 -e DATABASE_URL=jdbc:postgresql://host:5432/rada rada-backend
```

### 3. Database (Local Dev)

```bash
docker-compose up -d
psql -h localhost -U username -d dbname
```

Enable PostGIS:

```bash
CREATE EXTENSION postgis;
```

#### ⚙️ Backend Notes

Build & run:

```bash
mvn package
java -jar target/rada-backend-0.1.0.jar
```

Add database connection details via env vars:

- DATABASE_URL, DB_USER, DB_PASSWORD
- WsServer.java contains a basic WebSocket example (run separately if desired).

### 4.🤝 Contributing

We welcome contributions to Rada!
Here’s how you can help:

#### 1. Fork & Clone the repository

```bash
git clone https://github.com/your-username/rada-app.git
cd rada-app
```

##### 2. Create a new feature branch

```bash
git checkout -b feature/your-feature-name
```

##### 3. Commit your changes

```bash
git commit -m "Add your message here"
```

##### 4. Push the branch

```bash
git push origin feature/your-feature-name
```

##### 5. Submit a Pull Request for review

Guidelines:
Keep PRs focused (one feature/bugfix per PR).
Follow existing code style (Prettier for frontend, Maven formatting for backend).
Write clear commit messages.

### 5.📄 License

```bash
This project is licensed under the MIT License.
```
