require! path

module.exports = (args = process.argv, cwd = process.cwd!) ->
  filename: path.relative cwd, args.1
  args: Array::slice.call args, 2

