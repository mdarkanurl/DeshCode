const fs = require('fs');

// Define ListNode class globally
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

global.ListNode = ListNode;

function arrayToLinkedList(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

function linkedListToArray(head) {
  const result = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

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

    // Handle single linked list input like [1,2,3] or []
    if (Array.isArray(input) && input.every(x => typeof x !== 'object')) {
      args = [arrayToLinkedList(input)];

    // Handle merge-k-sorted-lists input like [[[1,4,5],[1,3,4],[2,6]]]
    } else if (
      Array.isArray(input) &&
      input.length === 1 &&
      Array.isArray(input[0]) &&
      input[0].every(Array.isArray)
    ) {
      args = [input[0].map(arrayToLinkedList)];

    // General fallback
    } else {
      args = input.map(arg => Array.isArray(arg) ? arrayToLinkedList(arg) : arg);
    }

    const fn = global[functionName];

    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    let result = fn(...args);

    if (result instanceof Promise) {
      result = await result;
    }

    // Convert Linked List result to array
    if (result === null) {
      result = [];
    } else if (result instanceof ListNode) {
      result = linkedListToArray(result);
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