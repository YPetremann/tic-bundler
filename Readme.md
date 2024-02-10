# tic-bundler

Tool to bundle your Tic80 games

## Installation

    npm i -g tic-bundler

## Usage

    tic-bundler unbundle <bundle> <main> [asset]
    tic-bundler bundle <bundle> <main> [asset]
    tic-bundler watch <bundle> <main> [asset] --tic <tic>

## Unbundle

tic-bundler can unbundle files bundled with tic-bundler  
this allow to unpack your projects on the fly after being packed

## Bundle

tic-bundler can bundle a project in a lone file using a simple system

## Watch

tic-bundler integrate an easy to use watch tool to develop your games  
it watch for workspace changes, bundle them and tic80 auto reload  
but also watch for changes from tic80 and put them in workspace

## Language integration

supports is based on the same generic parser and module system
it use the fact that a module return like a function and can call require to access what another module returns

### full lua example

**_../lib3/index.lua:_**

    return "Hello"

**_../lib2/index.lua:_**

    return "World"

**_../lib1/index.lua:_**

    local mod2 = require("../lib2/index.lua")
    local mod3 = require("../lib3/index.lua")
    return mod3.." "..mod2

**_main.lua:_**

    local mod = require("../lib1/index.lua")
    function TIC() print(mod) end

**_assets.lua:_**

    // <PALETTE>
    // 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
    // </PALETTE>

### js example

**_../lib1/index.js:_**

    const mod2 = require("../lib2/index.js")
    const mod3 = require("../lib3/index.js")
    return mod3+" "+mod2

### js example

**_../lib1/index.js:_**

    const mod2 = require("../lib2/index.js")
    const mod3 = require("../lib3/index.js")
    return mod3+" "+mod2

## Todo

- More language support (all tic80 languages)
- Better watch strategy (checking bundle and workspace modification time)
- Plugin based language support
- Ast based language support
