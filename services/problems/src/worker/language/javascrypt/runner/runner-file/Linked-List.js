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

// Linked List Node definition (make sure your user code uses same definition or compatible)
function ListNode(val, next = null) {
  this.val = val;
  this.next = next;
}

// Converts array to linked list
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

// Converts linked list back to array
function linkedListToArray(head) {
  const arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  return arr;
}

// Normalize output to array (linked list)
function normalizeOutput(output) {
  if (output === undefined) return null;
  // If output looks like a linked list node, convert to array
  if (typeof output === 'object' && output !== null && 'val' in output && 'next' in output) {
    return linkedListToArray(output);
  }
  return output;
}

(async () => {
  try {
    const rawInput = process.argv[2];
    if (!rawInput) throw new Error("No input provided");

    const input = JSON.parse(rawInput);

    // Convert input array to linked list node
    const linkedListInput = arrayToLinkedList(input);

    const fn = global[functionName];
    if (typeof fn !== 'function') {
      throw new Error(`Function "${functionName}" is not defined.`);
    }

    const result = fn(linkedListInput);

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
