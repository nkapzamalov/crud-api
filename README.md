## Client

### Development Setup

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:3000`

## Server

#### Development Setup

```bash
cd server
docker-compose up --build
```

The server will be available at `http://localhost:8000`

### API Endpoints

#### Users API

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

#### Notes

There is no .env file or credentials. Since there wont be any production environment, all necessary configurations are hardcoded for faster testing of the task. 
