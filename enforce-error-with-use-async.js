module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `Enforce that 'error' key is handled from 'useAsync'.`,
    },
    schema: []
  },
  create(context) {
    const REPORT_MESSAGE = `'error' key is not used from 'useAsync', resulting in exceptions in useAsync from being ignored.`;
    const useAsyncNodes = [];
    return {
      VariableDeclarator(node) {
        if (node.init && node.init.type === 'CallExpression' && node.init.callee && node.init.callee.name === 'useAsync') {
          if (node.id.type === 'ObjectPattern') {
            const hasErrorKey = node.id.properties.some(property => {
              return property.key && property.key.name === 'error';
            });
            if (!hasErrorKey) {
              context.report({
                node,
                message: REPORT_MESSAGE,
              });
            }
          } else if (node.id.type === 'Identifier') {
            useAsyncNodes.push(node);
          }
        }
      },
      MemberExpression(node) {
        if (node.property && node.property.name === 'error') {
          const index = useAsyncNodes.findIndex(useAsyncNode => {
            return node.object && useAsyncNode.id.name === node.object.name;
          });
          if (index > -1) {
            useAsyncNodes.splice(index, 1);
          }
        }
      },
      'Program:exit': function(node) {
        if (useAsyncNodes.length) {
          context.report({
            node: useAsyncNodes[0],
            message: REPORT_MESSAGE,
          });
        }
      }
    };
  }
};