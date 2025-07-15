import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

/**
 * Rewrite user-submitted JS to expose target function to global scope
 */
export function prepareCodeWithBabel(code: string, functionName: string): string {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"]
  });

  let functionFound = false;

  traverse(ast, {
    FunctionDeclaration(path) {
      if ((path.node.id?.name ?? '') === functionName) {
        functionFound = true;
        const fnExpr = t.functionExpression(
          t.identifier(functionName),
          path.node.params,
          path.node.body,
          path.node.generator,
          path.node.async
        );
        const assignExpr = t.assignmentExpression(
          '=',
          t.memberExpression(t.identifier('global'), t.identifier(functionName)),
          fnExpr
        );
        path.replaceWith(t.expressionStatement(assignExpr));
      }
    },
    VariableDeclarator(path) {
      if ((path.node.id as t.Identifier)?.name === functionName) {
        functionFound = true;
        const assignExpr = t.assignmentExpression(
          '=',
          t.memberExpression(t.identifier('global'), t.identifier(functionName)),
          path.node.init!
        );
        path.parentPath.replaceWith(t.expressionStatement(assignExpr));
      }
    },
    AssignmentExpression(path) {
      const left = path.node.left;
      if (t.isIdentifier(left) && left.name === functionName) {
        functionFound = true;
        const assignExpr = t.assignmentExpression(
          '=',
          t.memberExpression(t.identifier('global'), t.identifier(functionName)),
          path.node.right
        );
        path.replaceWith(assignExpr);
      }
    }
  });

  if (!functionFound) {
    throw new Error(`Function "${functionName}" not found in submitted code.`);
  }

  const { code: rewrittenCode } = generate(ast, {}, code);
  return rewrittenCode;
}
