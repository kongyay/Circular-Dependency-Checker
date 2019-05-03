var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

let n = null
let m = null
let dep_input = []
rl.on('line', function (line) {
    // Get n and m
    if (n === null) {
        let nm = line.trim().split(/\s+/)
        n = parseInt(nm[0]) || inputError('n is not correct..')
        m = parseInt(nm[0]) || inputError('m is not correct..')
        if (n > 1000 || n < 1) inputError('n is not in scope (1 ≤ n ≤ 1000)..')
        if (m > n * (n - 1) || m < 1)
            inputError(`m is not in scope (1 ≤ m ≤ ${n * (n - 1)})..`)
    }
    // Get dependency until m times
    else if (dep_input.length < m) {
        let ab = line.trim().split(/\s+/)
        let a = Number(ab[0]) || inputError('Class a is not correct..')
        let b = Number(ab[1]) || inputError('Class b is not correct..')
        if (a > n || a < 1) inputError(`Class a is not in scope (n=${n})..`)
        if (b > n || b < 1) inputError(`Class b is not in scope (n=${n})..`)
        if (a === b) inputError(`Class a,b can't be the same..`)
        dep_input.push([a, b])

        // If all dependencies is read 
        if (dep_input.length === m) {
            let deps = {}
            dep_input.forEach(([a, b]) => {
                // Dependency structure
                if (a in deps) {
                    deps[a].push(b)
                } else deps[a] = [b]

                // Dependency Check
                let isOk = circularCheck(a, b, deps)
                if (!isOk) {
                    endProcess('FALSE')
                }
            })

            endProcess('TRUE')
        }
    }

}).on('close', function () {
    process.exit(0);
});

// Print error function
const inputError = errMsg => {
    console.error('\x1b[31m ERROR:' + errMsg + '\x1b[0m')
    rl.close()
    process.exit(1)
}

// Circular checker
const circularCheck = (a, b, deps) => {
    if (b in deps) {
        // Base Case: Found circular !
        if (deps[b].indexOf(a) > -1) {
            return false
        }
        // Recursion: Keep digging
        else {
            for (let i of deps[b]) {
                let result = circularCheck(a, i, deps)
                if (!result) return false
            }
            return true
        }
    }
    // Base Case: No further dependency
    else {
        return true
    }
}

// Process End
const endProcess = result => {
    console.log(result)
    rl.close()
    process.exit(0)
}