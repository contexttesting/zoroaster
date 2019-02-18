// expected pass
an input to expected

/* expected */
an input to expected - pass
/**/

// expected fail
an input to expected

/* expected */
an input to expected - fail
/**/

// error pass
!an input to error

/* error */
!an input to error - pass
/**/

// error fail
an input to error

/* error */
an input to error - fail
/**/

// duplicate name
an input

/* expected */
ok
/**/

// duplicate name
an input

/* expected */
ok
/**/

// incorrect json
an input

/* json */
not ok
/**/

// empty expected
pass

/* expected */
/**/

// empty expected fail
fail

/* expected */
/**/

// test properties
hello world

/* prop */
{ "key": "value" }
/**/

/* expected */
input: hello world
prop: {"key":"value"}
/**/