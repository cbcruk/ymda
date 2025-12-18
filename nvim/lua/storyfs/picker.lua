local pickers = require('telescope.pickers')
local finders = require('telescope.finders')
local conf = require('telescope.config').values
local actions = require('telescope.actions')
local action_state = require('telescope.actions.state')
local previewers = require('telescope.previewers')

local storyfs = require('storyfs')

local M = {}

local story_previewer = previewers.new_buffer_previewer({
  title = '미리보기',
  define_preview = function(self, entry, status)
    local body = storyfs.get_body(entry.value.id)

    if body then
      local lines = vim.split(body, '\n')
      local preview_lines = {}

      for i = 1, math.min(100, #lines) do
        table.insert(preview_lines, lines[i])
      end

      if #lines > 100 then
        table.insert(preview_lines, '')
        table.insert(preview_lines, '... (계속) ...')
      end

      vim.api.nvim_buf_set_lines(self.state.bufnr, 0, -1, false, preview_lines)

      vim.bo[self.state.bufnr].filetype = 'markdown'
    end
  end,
})

M.stories = function(opts)
  opts = opts or {}

  local stories = storyfs.get_stories()

  if not stories or #stories == 0 then
    vim.notify('storyfs: 소설이 없습니다', vim.log.levels.WARN)
    return
  end

  pickers.new(opts, {
    prompt_title = '📚 소설 목록',
    finder = finders.new_table({
      results = stories,
      entry_maker = function(story)
        local display = string.format(
          '%-12s │ %-30s │ %5.1fKB',
          story.author:sub(1, 12),
          story.title:sub(1, 30),
          (story.size or 0) / 1000
        )

        return {
          value = story,
          display = display,
          ordinal = story.author .. ' ' .. story.title,
        }
      end,
    }),
    sorter = conf.generic_sorter(opts),
    previewer = storyfs.config.previewer and story_previewer or nil,
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)

        local selection = action_state.get_selected_entry()

        if selection then
          storyfs.open_story(selection.value)
        end
      end)

      return true
    end,
  }):find()
end

M.authors = function(opts)
  opts = opts or {}

  local authors = storyfs.get_authors()

  if not authors or #authors == 0 then
    vim.notify('storyfs: 작가가 없습니다', vim.log.levels.WARN)
    return
  end

  pickers.new(opts, {
    prompt_title = '✍️  작가 목록',
    finder = finders.new_table({
      results = authors,
      entry_maker = function(author)
        local display = string.format(
          '%-20s │ %d편',
          author.author,
          author.count
        )

        return {
          value = author,
          display = display,
          ordinal = author.author,
        }
      end,
    }),
    sorter = conf.generic_sorter(opts),
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)

        local selection = action_state.get_selected_entry()

        if selection then
          M.stories_by_author({ author = selection.value.author })
        end
      end)

      return true
    end,
  }):find()
end

M.stories_by_author = function(opts)
  opts = opts or {}

  local author = opts.author

  if not author then
    vim.notify('storyfs: 작가가 지정되지 않았습니다', vim.log.levels.ERROR)
    return
  end

  local all_stories = storyfs.get_stories()
  local stories = vim.tbl_filter(function(s)
    return s.author == author
  end, all_stories)

  if #stories == 0 then
    vim.notify('storyfs: 해당 작가의 소설이 없습니다', vim.log.levels.WARN)
    return
  end

  pickers.new(opts, {
    prompt_title = '📖 ' .. author .. '의 소설',
    finder = finders.new_table({
      results = stories,
      entry_maker = function(story)
        local display = string.format(
          '%-35s │ %5.1fKB',
          story.title:sub(1, 35),
          (story.size or 0) / 1000
        )

        return {
          value = story,
          display = display,
          ordinal = story.title,
        }
      end,
    }),
    sorter = conf.generic_sorter(opts),
    previewer = storyfs.config.previewer and story_previewer or nil,
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)

        local selection = action_state.get_selected_entry()

        if selection then
          storyfs.open_story(selection.value)
        end
      end)

      return true
    end,
  }):find()
end

M.search = function(opts)
  opts = opts or {}
  local search_term = opts.search or ''
  local all_stories = storyfs.get_stories()

  if not all_stories then return end

  local stories = all_stories

  if search_term ~= '' then
    local term_lower = search_term:lower()

    stories = vim.tbl_filter(function(s)
      return s.title:lower():find(term_lower, 1, true)
          or (s.summary and s.summary:lower():find(term_lower, 1, true))
          or s.author:lower():find(term_lower, 1, true)
    end, all_stories)
  end

  pickers.new(opts, {
    prompt_title = '🔍 소설 검색',
    default_text = search_term,
    finder = finders.new_table({
      results = stories,
      entry_maker = function(story)
        local display = string.format(
          '%-12s │ %-30s',
          story.author:sub(1, 12),
          story.title:sub(1, 30)
        )

        return {
          value = story,
          display = display,
          ordinal = story.author .. ' ' .. story.title .. ' ' .. (story.summary or ''),
        }
      end,
    }),
    sorter = conf.generic_sorter(opts),
    previewer = storyfs.config.previewer and story_previewer or nil,
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)

        local selection = action_state.get_selected_entry()

        if selection then
          storyfs.open_story(selection.value)
        end
      end)

      return true
    end,
  }):find()
end

return M
