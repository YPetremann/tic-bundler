-- script: lua

do
  local m,p={},{}
  function load(name,module) m[name]=module end
  function require(name)
    if not p[name] and m[name] then m[name],p[name]=m[name](require),true end
    return m[name]
  end
end

load("lib_b/module.lua",function(require)
  local mod = require("lib_a/module.lua")
  return mod.." World"
end)

load("lib_a/module.lua",function(require)
  return "Hello"
end)

local mod = require("lib_b/module.lua")

function BOOT()
  cls(0)
  trace(mod)
end

function TIC()
  print(mod,1,1,1)
end

-- <PALETTE>
-- 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
-- </PALETTE>
