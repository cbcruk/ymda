local M = {}

M.config = {
  db_path = "",
  previewer = true,
}

local function query(sql)
  local db_path = vim.fn.expand(M.config.db_path)

  if not db_path then
    vim.notify('storyfs: db_path가 설정되지 않았습니다', vim.log.levels.ERROR)
    return nil
  end

  local cmd = string.format(
    'sqlite3 -json "%s" "%s"',
    db_path,
    sql:gsub('"', '\\"')
  )

  local handle = io.popen(cmd)

  if not handle then return nil end

  local result = handle:read('*a')

  handle:close()

  if result == '' then return {} end

  local ok, data = pcall(vim.json.decode, result)

  if not ok then
    vim.notify('storyfs: JSON 파싱 실패', vim.log.levels.ERROR)
    return nil
  end

  return data
end

function M.get_stories()
  return query([[
    SELECT id, title, author, size, summary
    FROM stories
    ORDER BY author, title
  ]])
end

function M.get_authors()
  return query([[
    SELECT author, COUNT(*) as count
    FROM stories
    GROUP BY author
    ORDER BY author
  ]])
end

function M.get_body(id)
  local result = query(string.format(
    'SELECT body FROM story WHERE id = %d',
    id
  ))

  if result and result[1] then
    return result[1].body
  end

  return nil
end

function M.open_story(story)
  local body = M.get_body(story.id)

  if not body then
    vim.notify('storyfs: 본문을 찾을 수 없습니다', vim.log.levels.ERROR)
    return
  end

  vim.cmd('enew')

  local buf = vim.api.nvim_get_current_buf()
  local lines = vim.split(body, '\n')
  local name = string.format('[%s] %s', story.author, story.title)

  vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)

  vim.bo[buf].buftype = 'nofile'
  vim.bo[buf].bufhidden = 'wipe'
  vim.bo[buf].swapfile = false
  vim.bo[buf].filetype = 'markdown'
  vim.bo[buf].modifiable = false

  vim.api.nvim_buf_set_name(buf, name)

  vim.cmd('normal! gg')
end

function M.setup(opts)
  M.config = vim.tbl_deep_extend('force', M.config, opts or {})

  vim.api.nvim_create_user_command('StoryBrowse', function()
    require('telescope').extensions.storyfs.stories()
  end, {})

  vim.api.nvim_create_user_command('StoryAuthors', function()
    require('telescope').extensions.storyfs.authors()
  end, {})

  vim.api.nvim_create_user_command('StorySearch', function(args)
    require('telescope').extensions.storyfs.search({ search = args.args })
  end, { nargs = '?' })
end

return M
