const facebook = require('../facebook')
const helpers = require('../helpers')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  const scrape = async function() {
    const posts = await facebook('wokandtalk')

    const presentMenu = posts.find(post => (
      helpers.isToday(new Date(post.date)) &&
      post.content.some(line => line.match(/lunch/i))
    ))

    if (presentMenu) {
      _data = presentMenu.content.filter(line => (
        !line.match(/lunch/i)
      ))

      _context = `<${presentMenu.directLink}|Menu na fb>`
    }

    return this
  }

  const createMessageBlock = function() {
    return [slack.section(`>>>${_data.join('\n')}`)]
  }

  return {
    get title() {return 'Wok & Talk'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()