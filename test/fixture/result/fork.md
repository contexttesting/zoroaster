// forks a module
-a test world

/* stdout */
argv: "-a test world"
Arguments: ["-a","test","world"]

/**/

/* stderr */
zoroaster test mask

/**/

/* code */
127
/**/

// forks a module with string arguments
-a "test world"

/* stdout */
argv: "-a test world"
Arguments: ["-a","test world"]

/**/

// fails on stdout
-a "test world"

/* stdout */
fail
/**/

// fails on stderr
-a "test world"

/* stderr */
fail
/**/

// fails on code
-a "test world"

/* code */
1
/**/