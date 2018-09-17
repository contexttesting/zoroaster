// parses args correctly
input input2

/* expected */
["input", "input2"]
/**/

// parses args with double quotes
input "input2 test"

/* expected */
["input", "input2 test"]
/**/

// parses args with single quotes
input 'input2 test'

/* expected */
["input", "input2 test"]
/**/


// parses args with new lines
input
'input2 test'

/* expected */
["input", "input2 test"]
/**/