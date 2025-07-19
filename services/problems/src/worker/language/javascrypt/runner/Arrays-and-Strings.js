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

(async () => {
  try {
    const input = JSON.parse(process.argv[2]);

    let args;
    if (Array.isArray(input)) {
      args = input;
    } else if (typeof input === 'object' && input !== null) {
      args = Object.values(input);
    } else {
      args = [input];
    }

    const fn = global[functionName];

    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    let result = fn(...args);


    if (result instanceof Promise) {
      result = await result;
    }

    if (typeof result === 'undefined') {
      result = args[0];
    }

    console.log(JSON.stringify(result));
  } catch (e) {
    const error = {
      type: "RUNTIME_ERROR",
      message: e.message,
      stack: e.stack
    };
    console.error(JSON.stringify(error));
    process.exit(1);
  }
})();