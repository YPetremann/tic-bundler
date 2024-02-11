# script:  python

m={}
p={}
def load(name):
  def _loader(module):
    m[name]=module
  return _loader
def require(name):
  if not (name in p) and (name in m):
    m[name]=m[name](require)
    p[name]=True
  return m[name]

@load("lib_c/module.lua")
def d(require):
  hello = require("lib_a/module.lua")
  world = require("lib_b/module.lua")
  return hello+" "+world

@load("lib_a/module.lua")
def d(require):
  return "Hello"


@load("lib_b/module.lua")
def d(require):
  return "World"

mod = require("lib_c/module.lua")

def BOOT():
  trace(mod)
  exit()

def TIC():
  pass

# <PALETTE>
# 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
# </PALETTE>

