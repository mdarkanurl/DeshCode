const fs = require('fs');

let userCode;
let functionName;

try {
  userCode = fs.readFileSync('./user_code.js', 'utf-8');
  functionName = fs.readFileSync('./function_name.txt', 'utf-8').trim();
} catch (e) {
  const error = {
    type: "FILE_READ_ERROR",
    message: e.message,
    stack: e.stack
  };
  console.error(JSON.stringify(error));
  process.exit(1);
}

try {
  eval(userCode);
} catch (e) {
  const error = {
    type: "SYNTAX_ERROR",
    message: e.message,
    stack: e.stack
  };
  console.error(JSON.stringify(error));
  process.exit(1);
}

try {
  const input = JSON.parse(process.argv[2]);
  const args = Array.isArray(input) ? input : [input];

  if (typeof global[functionName] !== 'function') {
    throw new Error(`Function "${functionName}" is not defined properly.`);
  }

  const result = global[functionName](...args);

  // Handle Promise-returning functions
  if (result instanceof Promise) {
    result
      .then(res => {
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        const error = {
          type: "ASYNC_RUNTIME_ERROR",
          message: err.message,
          stack: err.stack
        };
        console.error(JSON.stringify(error));
        process.exit(1);
      });
  } else {
    console.log(JSON.stringify(result));
  }
} catch (e) {
  const error = {
    type: "RUNTIME_ERROR",
    message: e.message,
    stack: e.stack
  };
  console.error(JSON.stringify(error));
  process.exit(1);
}