## Description
The Discussions Service is responsible for managing user discussions and comments within the DeshCode platform. It allows users to engage in conversations, ask questions, and share insights related to coding challenges and contests. The service ensures that discussions are organized, searchable, and easily accessible to all users.

## Features
- Create, read, update, and delete discussion threads and comments
- Support for nested comments and replies
- Pagination and sorting of discussions
- Filtering discussions by tags, users, and date

## Local setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```
2. Go to the `discussions` directory:
   ```bash
   cd app/discussions
   ```
3. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
4. Set up environment variables:
   Create a `.env` file in the `app/discussions` directory and add the necessary environment variables. You can use the provided `.env.example` as a reference.

5. Start the Discussions Service API:
   ```bash
   npm run dev
   ```