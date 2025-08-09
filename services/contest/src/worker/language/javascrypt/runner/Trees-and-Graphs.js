const fs = require('fs');

// ---------- TreeNode ----------
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
global.TreeNode = TreeNode;

function arrayToBinaryTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (arr[i] != null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] != null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function binaryTreeToArray(root) {
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
  while (result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ---------- GraphNode (Adjacency List) ----------
class GraphNode {
  constructor(val) {
    this.val = val;
    this.neighbors = [];
  }
}
global.GraphNode = GraphNode;

function buildGraph(adjList) {
  if (!Array.isArray(adjList)) return null;
  const nodes = adjList.map((_, i) => new GraphNode(i));
  adjList.forEach((edges, i) => {
    nodes[i].neighbors = edges.map(j => nodes[j]);
  });
  return nodes[0]; // Entry point
}

// ---------- Setup ----------
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

// ---------- Main Runner ----------
(async () => {
  try {
    const input = JSON.parse(process.argv[2]);
    let args;

    function convertArg(arg) {
      if (Array.isArray(arg)) {
        // Binary Tree
        if (arg.some(v => v === null || typeof v === 'number')) return arrayToBinaryTree(arg);

        // Graph (Adjacency List)
        if (Array.isArray(arg[0])) return buildGraph(arg);

        // Raw array fallback
        return arg;
      }
      return arg;
    }

    args = Array.isArray(input) ? input.map(convertArg) : [convertArg(input)];

    const fn = global[functionName];
    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    let result = fn(...args);
    if (result instanceof Promise) result = await result;

    // Serialize Tree output
    if (result instanceof TreeNode) {
      result = binaryTreeToArray(result);
    }

    console.log(JSON.stringify(result));
  } catch (e) {
    console.error(JSON.stringify({ type: "RUNTIME_ERROR", message: e.message, stack: e.stack }));
    process.exit(1);
  }
})();