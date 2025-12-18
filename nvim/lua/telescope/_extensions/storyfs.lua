local picker = require('storyfs.picker')

return require('telescope').register_extension({
  setup = function(ext_config, config)
  end,
  exports = {
    stories = picker.stories,
    authors = picker.authors,
    stories_by_author = picker.stories_by_author,
    search = picker.search
  },
})
