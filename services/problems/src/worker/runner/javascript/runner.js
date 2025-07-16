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

// TreeNode helpers
function defineTreeNodeClass() {
  global.TreeNode = function TreeNode(val, left, right) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  };
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Convert tree back to array (level order)
function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }
  // Trim trailing nulls
  while (result.length && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

function convertIfTreeInput(functionName, input) {
  const treeProblems = new Set([
    "maxPathSum",
    "invertTree",
    "isSymmetric",
    "hasPathSum",
    "levelOrder",
    "isSameTree",
    "lowestCommonAncestor",
    "sumNumbers"
  ]);

  if (!treeProblems.has(functionName)) return input;

  defineTreeNodeClass();

  if (input.root && Array.isArray(input.root)) {
    return { ...input, root: buildTree(input.root) };
  }

  return input;
}

const normalizeOutput = (output) => {
  if (output === null) return [];
  return output;
}

(async () => {
  try {
    const input = JSON.parse(process.argv[2]);
    const convertedInput = convertIfTreeInput(functionName, input);

    let args;
    if (Array.isArray(convertedInput)) {
      args = convertedInput;
    } else if (typeof convertedInput === 'object' && convertedInput !== null) {
      args = Object.values(convertedInput);
    } else {
      args = [convertedInput];
    }

    const fn = global[functionName];

    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    const result = fn(...args);

    const output = (result && typeof result === 'object' && 'val' in result && 'left' in result && 'right' in result)
      ? treeToArray(result)
      : result;

    if (result instanceof Promise) {
      const awaited = await result;
      const awaitedOutput = (awaited && typeof awaited === 'object' && 'val' in awaited && 'left' in awaited && 'right' in awaited)
        ? treeToArray(awaited)
        : awaited;
      console.log(JSON.stringify(normalizeOutput(awaitedOutput)));
    } else {
      console.log(JSON.stringify(normalizeOutput(output)));
    }

  } catch (e) {
    console.error(JSON.stringify({ type: "RUNTIME_ERROR", message: e.message, stack: e.stack }));
    process.exit(1);
  }
})();
