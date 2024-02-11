-- script:  moon

local load,require
do
  m,p={},{}
  load=(name,module)->
    m[name]=module
  require=(name)->

    if not p[name] and m[name] then m[name],p[name]=m[name](require),true
    return m[name]


load "lib_c/module.lua",(require)->
  hello = require("lib_a/module.lua")
  world = require("lib_b/module.lua")
  return hello.." "..world

load "lib_a/module.lua",(require)->
  return "Hello"

load "lib_b/module.lua",(require)->
  return "World"

mod = require("lib_c/module.lua")

export BOOT=->
   trace(mod)
   exit()

export TIC=->
   exit()


-- <PALETTE>
-- 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
-- </PALETTE>

