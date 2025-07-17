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

// TreeNode definition (should match user code expectations)
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// Deserialize BFS array to binary tree
function deserializeTree(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const nodes = data.map(x => (x === null ? null : new TreeNode(x)));
  let root = nodes[0];
  let i = 1;

  for (let j = 0; j < nodes.length && i < nodes.length; j++) {
    if (nodes[j] !== null) {
      nodes[j].left = nodes[i++] || null;
      if (i < nodes.length) nodes[j].right = nodes[i++] || null;
    }
  }
  return root;
}

// Serialize binary tree to BFS array
function treeToArray(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];
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
  while (result[result.length - 1] === null) result.pop();
  return result;
}

// Normalize output (tree -> array)
function normalizeOutput(output) {
  if (output === undefined || output === null) return null;
  if (typeof output === 'object' && 'val' in output && ('left' in output || 'right' in output)) {
    return treeToArray(output);
  }
  return output;
}

(async () => {
  try {
    const rawInput = process.argv[2];
    if (!rawInput) throw new Error("No input provided");

    const input = JSON.parse(rawInput);

    const root = deserializeTree(input);

    const fn = global[functionName];
    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    const result = fn(root);

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
