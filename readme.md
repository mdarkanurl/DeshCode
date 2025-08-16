# DeshCode

**DeshCode** is an advance LeeCode-style problem-solving platform.

## Description

- DeshCode allows users to practice coding challenges, submit solutions, and receive automated feedback.
- It manages problems, evaluates code against predefined test cases in a secure environment.
- This system provides a discussion tab where users can exchange ideas and collaborate.
- It also supports coding contests, enabling users to compete in real time.
- Overall, it serves as a complete coding practice, collaboration, and competition platform, simulating a real-world online judge.

## Motive to build this project
- Build a system that can handle 10K users at the same time
- Build a problem-solving platform that can run code securely with Docker
- Provide real-time collaboration features for users
- Learn some advanced techniques in code evaluation and sandboxing
- Learn how to build a scalable and maintainable system

## Local setup
**prerequisites:**
- Node.js (version 14 or later)
- Docker (for running code in isolated environments)
- Docker image of runtime environment (e.g., Python, Node.js)

1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. You can use the provided `.env.example` as a reference.

4. Start the service whatever service you need:
    If you need to start the problems service, run:
   ```bash
   npm run dev:problems
   ```
   Look up to `package.json` and find the script as you need.

5. Access the application: <br>
   Open your testing tool and navigate to `http://localhost:3000` or the appropriate endpoint for the service you started.

**Docker:** if you have Docker you can pull the image from Docker Hub and test it:
```bash
docker pull mdarkanurl/deshcode
```