# Problems Service - Comprehensive Docus

## 🚀 **Features Overview**

### **Core Functionality**
The Problems Service is a comprehensive coding platform backend that manages programming problems and handles code submissions with automated testing capabilities.

### **Key Features:**

#### 1. **Problem Management**
- **Create Problems**: Admins can create coding problems with:
  - Custom problem ID, title, and description
  - Function signature definition
  - Multiple programming language support
  - Difficulty levels (EASY, MEDIUM, HARD)
  - Test cases (input/output pairs)
  - Problem categorization (Arrays & Strings, Linked Lists, Trees & Graphs, Dynamic Programming, etc.)
  - Tags for better organization

- **Retrieve Problems**: 
  - Get all problems with pagination
  - Filter by difficulty, tags, and supported languages
  - Get individual problem details
  - Search and filter capabilities

- **Update/Delete Problems**: Full CRUD operations for problem management

#### 2. **Code Submission & Execution**
- **Submit Solutions**: Users can submit code solutions for problems
- **Language Validation**: Ensures submitted code matches problem's supported languages
- **Automated Testing**: Code is executed against test cases automatically
- **Real-time Status Tracking**: Multiple submission statuses:
  - `PENDING` - Awaiting execution
  - `ACCEPTED` - Solution passed all tests
  - `WRONG_ANSWER` - Solution failed test cases
  - `EXECUTION_ERROR` - Runtime errors
  - `TIME_OUT` - Solution exceeded time limits
  - `FAILED` - General failure
  - `INVALID_FUNCTION_SIGNATURE` - Incorrect function signature
  - `LANGUAGE_NOT_SUPPORTED` - Unsupported language

#### 3. **Asynchronous Processing**
- **RabbitMQ Integration**: Uses message queues for scalable code execution
- **Worker System**: Separate worker processes handle code execution
- **Queue-based Architecture**: Different queues for different problem types

#### 4. **Authentication & Authorization**
- **JWT-based Authentication**: Secure user authentication
- **Role-based Access**: Admin vs regular user permissions
- **Protected Routes**: Admin-only routes for problem management

#### 5. **Database Management**
- **PostgreSQL Database**: Robust data persistence
- **Prisma ORM**: Type-safe database operations
- **Relational Data**: Problems, submissions, and discussions linked

## 🛠 **Local Setup Guide**

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL database
- RabbitMQ message broker
- Docker for running code
- pnpm package manager

### **Environment Setup**
1. **Install Dependencies**:
   ```bash
   cd app/problems
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env` file. Use `.env.example` for guidance.

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run database migrations
   npx prisma migrate deploy
   ```

4. **Start Services**:
   ```bash
   # Start RabbitMQ (Docker)
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   
   # Start PostgreSQL (Docker)
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=problems_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password postgres:15
   ```

5. **Run the Application**:
   ```bash
   # Development mode
   pnpm dev
   
   # Production build
   pnpm build
   pnpm start
   ```

### **API Endpoints**

#### **Problems Management**
- `POST /api/v1/problems` - Create problem (Admin only)
- `GET /api/v1/problems` - Get all problems (with filters)
- `GET /api/v1/problems/:id` - Get specific problem
- `PUT /api/v1/problems/:id` - Update problem (Admin only)
- `DELETE /api/v1/problems/:id` - Delete problem (Admin only)

#### **Submissions**
- `POST /api/v1/submissions` - Submit solution (Authenticated users)
- `GET /api/v1/submissions/:id` - Get submission status (Authenticated users)

#### **Health Check**
- `GET /api/health` - Service health status
- `GET /` - Service information

## 🧪 **Testing & Test Cases**

### **Testing Framework**
- **Jest**: Main testing framework
- **Supertest**: HTTP testing
- **Testcontainers**: Docker-based test infrastructure
- **TypeScript**: Full type safety in tests

### **Test Setup**
The service uses a sophisticated testing setup with:

#### **Test Infrastructure**
- **PostgreSQL Container**: Isolated test database
- **RabbitMQ Container**: Message queue for testing
- **Worker Processes**: Code execution workers for testing
- **Global Setup/Teardown**: Automated test environment management

#### **Test Categories**

1. **Application Tests**
   - Health check endpoints
   - Root endpoint responses
   - Database connectivity

2. **Problem Management Tests**
   - Create problems (with validation)
   - Retrieve problems (with pagination)
   - Update/delete operations
   - Authorization checks
   - Input validation
   - Error handling

3. **Submission Tests**
   - Code submission workflow
   - Language validation
   - Problem existence checks
   - Status tracking
   - Result verification

### **Test Data**
Comprehensive test data includes:
- **15+ Problem Examples**: Various difficulty levels and categories
- **Test Cases**: Input/output pairs for validation
- **Solution Examples**: Correct and incorrect solutions
- **Edge Cases**: Invalid inputs, unsupported languages, etc.

### **Running Tests**
```bash
# Run all tests
pnpm test
```

### **Test Features**
- **Integration Testing**: Full API endpoint testing
- **Authentication Testing**: JWT token validation
- **Database Testing**: Real database operations
- **Message Queue Testing**: RabbitMQ integration
- **Worker Testing**: Code execution pipeline
- **Error Scenario Testing**: Comprehensive error handling

### **Test Execution Flow**
1. **Setup**: Start containers and workers
2. **Authentication**: Login as admin/user
3. **Problem Creation**: Create test problems
4. **Submission Testing**: Submit and verify solutions
5. **Status Verification**: Check execution results
6. **Cleanup**: Teardown containers and processes

## 🏗 **Architecture Highlights**

- **Microservice Architecture**: Independent service with clear boundaries
- **Event-Driven**: RabbitMQ for asynchronous processing
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Comprehensive test suite with containers
- **Scalability**: Queue-based worker system
- **Security**: JWT authentication and role-based access

## 📁 **Project Structure**

```
app/problems/
├── src/
│   ├── __tests__/           # Test files and test data
│   ├── controllers/         # API route handlers
│   ├── services/           # Business logic layer
│   ├── repo/               # Data access layer
│   ├── routers/            # Express route definitions
│   ├── schema/             # Zod validation schemas
│   ├── middlewares/        # Authentication & authorization
│   ├── utils/              # Utility functions
│   ├── worker/             # Code execution workers
│   ├── types/              # TypeScript type definitions
│   ├── app.ts              # Express app configuration
│   └── index.ts            # Main application entry
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── package.json            # Dependencies and scripts
├── jest.config.ts          # Jest configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 **Available Scripts**

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run test suite
- `pnpm prisma:generate` - Generate Prisma client

## 🚀 **Getting Started**

1. Clone the repository
2. Navigate to `app/problems`
3. Install dependencies with `pnpm install`
4. Set up environment variables
5. Start required services (PostgreSQL, RabbitMQ) # Locally or Docker
6. Run database migrations
7. Start the application with `pnpm dev`

## 📝 **Contributing**

Please refer to the main project's contributing guidelines for information on how to contribute to this service.

## 📄 **License**

This project is licensed under the terms specified in the main project's LICENSE file.
