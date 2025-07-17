const fs = require('fs');

let userCode, functionName;

try {
  userCode = fs.readFileSync('./user_code.js', 'utf-8');
  functionName = fs.readFileSync('./function_name.txt', 'utf-8').trim();
} catch (e) {
  console.error(JSON.stringify({ type: "FILE_READ_ERROR", message: e.message, stack: e.stack }));
  process.exit(1);
}

try {
  eval(userCode);
} catch (e) {
  console.error(JSON.stringify({ type: "SYNTAX_ERROR", message: e.message, stack: e.stack }));
  process.exit(1);
}

function normalizeOutput(output) {
  // For DP, just return output as is, or null if undefined
  if (output === undefined) return null;
  return output;
}

(async () => {
  try {
    const rawInput = process.argv[2];
    if (!rawInput) throw new Error("No input provided");

    // Parse input, can be array, string, object, etc.
    const input = JSON.parse(rawInput);

    // Determine how to pass arguments to the function:
    // If input is array, spread it as multiple arguments.
    // Otherwise, pass as a single argument.
    let fnArgs;
    if (Array.isArray(input)) {
      fnArgs = input;
    } else {
      fnArgs = [input];
    }

    const fn = global[functionName];
    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    const result = fn(...fnArgs);

    if (result instanceof Promise) {
      const awaitedResult = await result;
      console.log(JSON.stringify(normalizeOutput(awaitedResult)));
    } else {
      console.log(JSON.stringify(normalizeOutput(result)));
    }

  } catch (e) {
    console.error(JSON.stringify({ type: "RUNTIME_ERROR", message: e.message, stack: e.stack }));
    process.exit(1);
  }
})();
