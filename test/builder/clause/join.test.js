const { sq, e, query } = require('../tape')

describe('join', () => {
  describe('join types', () => {
    query({
      name: 'natural join',
      query: sq.from`book`.naturalJoin`publisher`,
      text: 'select * from book natural join publisher'
    })
    query({
      name: 'natural left join',
      query: sq.from`book`.naturalLeftJoin`publisher`,
      text: 'select * from book natural left join publisher'
    })
    query({
      name: 'natural right join',
      query: sq.from`book`.naturalRightJoin`publisher`,
      text: 'select * from book natural right join publisher'
    })
    query({
      name: 'natural full join',
      query: sq.from`book`.naturalFullJoin`publisher`,
      text: 'select * from book natural full join publisher'
    })
    query({
      name: 'cross join',
      query: sq.from`book`.crossJoin`publisher`,
      text: 'select * from book cross join publisher'
    })
  })
  describe('multiple joins', () => {
    query({
      name: 'two joins',
      query: sq.from`book`.naturalJoin`author`.naturalJoin`publisher`,
      text: 'select * from book natural join author natural join publisher'
    })
    query({
      name: 'three joins',
      query: sq.from`a`.naturalJoin`b`.naturalJoin`c`.naturalJoin`d`,
      text: 'select * from a natural join b natural join c natural join d'
    })
    query({
      name: 'multiple mixed join types',
      query: sq.from`a`.naturalLeftJoin`b`.naturalRightJoin`c`.crossJoin`d`,
      text:
        'select * from a natural left join b natural right join c cross join d'
    })
    query({
      name: 'repeat join types',
      query: sq.from`a`.crossJoin`b`.naturalFullJoin`c`.naturalJoin`d`,
      text: 'select * from a cross join b natural full join c natural join d'
    })
  })
  describe('join overloads', () => {
    query({
      name: 'two joins',
      query: sq.from({ b: 'book' }).naturalJoin({ p: 'publisher' }),
      text: 'select * from book b natural join publisher p'
    })
    query({
      name: 'two joins',
      query: sq.from('book').naturalJoin('publisher'),
      text: 'select * from book natural join publisher'
    })
  })
  describe('join on', () => {
    query({
      name: 'on template string',
      query: sq.from`book`.join`author`.on`book.author_id = author.id`,
      text: 'select * from book join author on (book.author_id = author.id)'
    })
    query({
      name: 'on expression',
      query: sq.from`book`.join`author`.on(e`book.author_id`.eq`author.id`),
      text: 'select * from book join author on (book.author_id = author.id)'
    })
    query({
      name: 'on object',
      query: sq.from`book`.join`author`.on(
        sq.txt`(book.author_id = author.id)`,
        {
          'book.genre': 'Fantasy'
        }
      ),
      text:
        'select * from book join author on (book.author_id = author.id) and (book.genre = $1)',
      args: ['Fantasy']
    })
    query({
      name: 'multiple on',
      query: sq.from`book`.join`author`.on`book.author_id = author.id`
        .on`book.genre = ${'Fantasy'}`,
      text:
        'select * from book join author on (book.author_id = author.id) and (book.genre = $1)',
      args: ['Fantasy']
    })
    query({
      name: 'multiple joins on',
      query: sq.from`a`.join`b`.on`a.id = b.id`.join`c`.on`a.id = c.id`
        .on`b.id = c.id`,
      text:
        'select * from a join b on (a.id = b.id) join c on (a.id = c.id) and (b.id = c.id)'
    })
  })
  describe('join using', () => {
    query({
      name: 'using template string',
      query: sq.from`book`.join`author`.using`author_id`,
      text: 'select * from book join author using (author_id)'
    })
    query({
      name: 'using string',
      query: sq.from`book`.join`author`.using('author_id'),
      text: 'select * from book join author using (author_id)'
    })
    query({
      name: 'using multiple strings',
      query: sq.from`a`.join`b`.using('x', 'y', 'z'),
      text: 'select * from a join b using (x, y, z)'
    })
    query({
      name: 'multiple using',
      query: sq.from`a`.join`b`.using`x`.using('y', 'z'),
      text: 'select * from a join b using (x, y, z)'
    })
    query({
      name: 'multiple join using',
      query: sq.from`a`.join`b`.using`x`.join`c`.using('y', 'z'),
      text: 'select * from a join b using (x) join c using (y, z)'
    })
    query({
      name: 'multiple join using',
      query: sq.from`a`.join`b`.using`x`.join`c`.on`a.id = c.id`,
      text: 'select * from a join b using (x) join c on (a.id = c.id)'
    })
  })
})
