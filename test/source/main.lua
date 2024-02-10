-- script: lua

local mod = require("lib_b/module.lua")

function BOOT()
  cls(0)
  trace(mod)
end

function TIC()
  print(mod,1,1,1)
end
