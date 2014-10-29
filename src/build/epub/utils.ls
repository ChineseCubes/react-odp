get-argv = (argv = process.argv, cwd = process.cwd!) ->
  filename: ".#{argv.1.replace cwd, ''}"
  argv: Array::slice.call argv, 2

module.exports = { argv: get-argv }
