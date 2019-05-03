// I/O Interface
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

// Read Line function
const getLine = () => {
  return new Promise((resolve, reject) => {
    rl.on('line', line => {
      // console.info('Read:', line)
      resolve(line)
    })
  })
}

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

const endProcess = result => {
  console.log(result)
  rl.close()
  process.exit(0)
}

const main = async () => {
  // Get n and m
  // console.info('How many [n:class  m:dependency] ? ')
  let nm = (await getLine()).trim().split(/\s+/)
  let n = Number(nm[0]) || inputError('n is not correct..')
  let m = Number(nm[1]) || inputError('m is not correct..')
  if (n > 1000 || n < 1) inputError('n is not in scope (1 ≤ n ≤ 1000)..')
  if (m > n * (n - 1) || m < 1)
    inputError(`m is not in scope (1 ≤ m ≤ ${n * (n - 1)})..`)
  // console.info(`n: ${n}, m: ${m}`)

  // Get dependency loop
  let deps = {}
  for (let i = 0; i < m; i++) {
    // console.info(`Class Dependency#${i} [A B] ? `)
    let ab = (await getLine()).trim().split(/\s+/)
    let a = Number(ab[0]) || inputError('Class a is not correct..')
    let b = Number(ab[1]) || inputError('Class b is not correct..')
    if (a > n || a < 1) inputError(`Class a is not in scope (n=${n})..`)
    if (b > n || b < 1) inputError(`Class b is not in scope (n=${n})..`)
    if (a === b) inputError(`Class a,b can't be the same..`)
    // console.info(`Dependency${i}: ${a} -> ${b}`)

    // Dependency structure
    if (a in deps) {
      deps[a].push(b)
    } else deps[a] = [b]

    // Dependency Check
    let isOk = circularCheck(a, b, deps)
    if (!isOk) {
      endProcess('FALSE')
    }
  }
  endProcess('TRUE')
}

main()
