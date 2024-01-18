const { RuleTester } = require('eslint');
const errorWithUseAsyncRule = require('./enforce-error-with-use-async');
const useAsync = require('react-use/lib/useAsync');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015 }
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  'enforce-error-with-use-async', // rule name
  errorWithUseAsyncRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [
	  {
	  	code: 'const { error } = useAsync();',
	  },
	  {
		code: 'const { error: myError } = useAsync();',
	  },
	  {
		code: 'const { anotherKey } = getSomethingElse();',
	  },
	  {
		code: `
		  const out = useAsync();
		  if (out.error) {
		  	// do something with error
		  }
		`,
	  }
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: 'const { loading, value } = useAsync();',
        errors: 1,
      },
      {
        code: `
          const out = useAsync();
          out.value;
        `,
        errors: 1,
      }
    ],
  }
);

console.log("All tests passed!");