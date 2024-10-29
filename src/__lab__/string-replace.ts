import r from '..'

const schema = r.string('something').toUpperCase()
console.log(schema.parseTyped('SOMETHING'))
