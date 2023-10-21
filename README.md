<div align="center">
  <img align="center" src="https://opencollective-production.s3.us-west-1.amazonaws.com/account-long-description/dedb8939-f88e-4099-8d41-8680f0a67ef3/ddeep_big.png" height="200px" />
</div>

<br>
<p align="center">Decentralized real-time peer-to-peer data network</p>

<div align="center">

![Static Badge](https://img.shields.io/badge/alpha_release-current?style=flat-square&color=slateblue) 
![NPM Downloads](https://img.shields.io/npm/dm/ddeep-core?style=flat-square) 
![NPM License](https://img.shields.io/npm/l/ddeep-core?style=flat-square) 
![GitHub issues](https://img.shields.io/github/issues/kais-radwan/ddeep-core?style=flat-square) 
![typescript version](https://img.shields.io/npm/dependency-version/ddeep-core/dev/typescript?style=flat-square) 
![esbuild version](https://img.shields.io/npm/dependency-version/ddeep-core/esbuild?style=flat-square) 
![Scrutinizer build](https://img.shields.io/scrutinizer/build/g/kais-radwan/ddeep-core/main?style=flat-square)
![code quality](https://img.shields.io/scrutinizer/quality/g/kais-radwan/ddeep-core/main?style=flat-square)
[![Socket Badge](https://socket.dev/api/badge/npm/package/ddeep-core?style=flat-square)](https://socket.dev/npm/package/ddeep-core)
[![Static Badge](https://img.shields.io/badge/chat-on_matrix-lightgreen?style=flat-square)](https://matrix.to/#/@multineon:gitter.im)


</div>

> This is an alpha version !

<img src="https://github.com/kais-radwan/ddeep-core/blob/development/dev/assets/core_terminal.png?raw=true" style="border-radius: 10px;" />

Decentralized real-time peer-to-peer data core, used to save and sync decentralized graph data across connected peers, with features like:

- Persistent data storage with recovery checkpoints

- Scoped and AI-powered data policies

- Real-time low latency connections

- Security features like IP whitelists, data policies, smart listeners so one device can't overload the core with connections

- Command-line interactive interface to manage your network

- `ddeep-core` works perfectly with Gun JS.

## Installation

We recommend you clone this repository and run `npm install` and then `npm start` to start ddeep-core.

Using npm, you can install ddeep-core globally:
```bash
npm install -g ddeep-core
```
Now create a directory for your project and run:
```bash
ddeep-init
```
This will give you a complete ready-to-go environment, you can run `npm start` to start your network.

## Table of contents

- [Installation](#installation)
- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
  - [node \& npm](#node--npm)
  - [docker](#docker)
  - [build](#build)
  - [Alpha](#alpha)
- [Configurations](#configurations)
- [Policies](#policies)
  - [Add policies](#add-policies)
  - [Schema](#schema)
  - [Check policies](#check-policies)
    - [Usage](#usage)
  - [Smart policies](#smart-policies)
    - [HuggingFace token](#huggingface-token)
    - [Usage](#usage-1)
    - [`smart_check` extension](#smart_check-extension)
- [Extensions](#extensions)
  - [Add extensions](#add-extensions)
  - [Schema](#schema-1)
  - [Write your extensions](#write-your-extensions)
  - [Use your extensions](#use-your-extensions)
- [Restore checkpoints](#restore-checkpoints)
- [Infrastructure](#infrastructure)
  - [Communications](#communications)
  - [CRDT](#crdt)
  - [Storage](#storage)
  - [Policies](#policies-1)
    - [Check policies](#check-policies-1)
    - [AI-powered policies](#ai-powered-policies)
- [Decentralized world](#decentralized-world)
- [Development](#development)
  - [`dev` directory](#dev-directory)
  - [License](#license)
  - [NOTICE](#notice)
- [Thanks](#thanks)
- [The idea of ddeep-core](#the-idea-of-ddeep-core)
  - [Ddeep ecosystem](#ddeep-ecosystem)
  - [Gun](#gun)
- [Contact us](#contact-us)

## Getting started

### node & bytenode

To start your network using node, just run:

```bash
npm start
```

or using bytenode:
```bash
node start-bytenode
```

### docker
You can run ddeep-code in a [Docker](docker.com) container, you can pull the image from Docker hub:
```bash
docker pull multineon/ddeep-core
```
or build it from the source (recommended) :
```bash
docker build -t ddeep-core .
```
and now you can run ddeep-core as a docker container:
```bash
docker run -d ddeep-core
```

### build

To build your core again (needed after updating configurations, policies, and extensions):
```bash
npm run build
```

or using bytenode:
```bash
npm run bytenode-build
```

or simply do this:
```bash
npm run build-start
```

to build your new configurations and start the server.

Currently, everytime you make a change on your configurations, policies, extensions, or code, you need to build ddeep-core again, thanks to [esbuild](https://www.npmjs.com/package/esbuild) the build will usually be ready in under one second.

in coming versions this won't be the case and you won't need to build the code after every change.

### Alpha

This project is still in `alpha testing` and in its early stages, so we are testing possible issues and bugs, if you face any issue please contact us or report it on Github.

## Configurations
in the root directory of your project, you'll find a config file called `ddeep.config.js` where all your configurations live, the default file content should look like this:

> You need to build the code using `npm run build` after everytime you update your configurations.

in the `ddeep.config.js` you'll find comments explaining what every option does, and this is an example of the all default options:

```javascript
module.exports = {

  "storage": false,

  "port": 9999,

  "whitelist": [],

  "hf": null,

  "checkpoint": null,

  "reset_graph": null,

  "reset_listeners": 6000000

}
```

## Interactive interface

When you start `ddeepc-core` it opens a command-line interface where you can manage your network, let's see available commands:

- `list peers`: lists all connected peers

- `list listeners`: lists graph listeners and the peers listening to them

- `peer PEER_ID`: shows a peer info

- `clear`: clears the terminal

- `clear peers`: clears all listening peers

- `clear graph`: clears the cached graph data

- `clear listeners`: clears all the listeners

- `info`: shows the configurations info

- `run CODE`: executes a nodeJS code inside the code's process

## Policies

### Add policies

You can add policies to the `policies.config.js` file in the root directory of your project.

> You need to build the code using `npm run build` after everytime you configure your policies.

### Schema

let's first discover a policy schema in Ddeep:

```javascript
POLICY(
  type: 'check'|'smart',
  operations: ['get', 'put'],
  graph: string, 
  callback: Function // return true or false
)
```
There are two types of policies, check policies and smart policies, so let's discover how every policy works.

the `graph` property accept a string of nodes the policies is applied to. if you apply a policy to `people` it's applied to all nodes under `people`, but if you apply a policy to `people/kais` the policy will only be applied to the node `kais` under `people`, and so on.

### Check policies

Check policies are based on the check function, if the function returns `true` the access to the data will be granted and if it returns `false` the data access will be denied.

#### Usage

let's see a simple example:

```javascript
module.exports = [

  POLICY(
    'check', ['put'], 'people/kais',
    (data) => {
      return (data.name) ? true : false;
    }
  )

]
```

this policy will be applied to `put` operations to the node `kais` under `people` and it checks if the data we are putting have a `name` or not, if it does, the data operation will be granted and the data will be added otherwise the operation will be cancelled.

the `data` argument passed to the checking function contains the data being putted if the operation is `put`, and the data is being `getted` if the operation is `get`.

what matters is that the checking function has to return `true` or `false`, if returned `true` the opeartion will be processed, and if returned `false` the opeartion will be ignored.

for example this is also a valid `check()` policy function:

```javascript
(data) => {
    if (data.plan === "pro") {return true};
    if (data.plan !== "pro") {return false};
}
```

you have full customizability to build your own check functions and policies.

### Smart policies

> WARNING: the text classification model is giving poor classes scores and is not acurate, we are currently working on a fix for this

Smart policies uses AI classification to classify the inputs and gives an object of classes with a score from 0.0 to 1.0 for every class or emotion as 1.0 is the highest score.

#### HuggingFace token
First of all we recommend you add your [HuggingFace token](https://huggingface.co/docs/hub/security-tokens) to your `ddeep.config.js` so you don't suffer from hard rate limits.

#### Usage
You can check if a class is more than a certain value or less than a certain value, It's super easy let's see the example below:

```javascript
module.exports = [

  POLICY(
    'smart', ['get', 'put'], 'posts',
    
    (classes) => {
      var smart_check = extensions.load('smart_check');

      return smart_check(classes, [
        [ "anger", "<0.5", true ],
        [ "anger", ">0.5", false ]
      ]);

    }

  )

]
```

the policy above is applied to all nodes under `posts` and it blocks all data that contains angry inputs from being added or read.

#### `smart_check` extension

with smart policies you need to use `smart_check` extension to check the classes and return `true` or `false`.

the extension can be loaded using `extensions.load` and it's imported to your policies by default, this is how `smart_check` is used:

```javascript
var smartCheck = extensions.load('smart_check');
return smartCheck(classes, [
    [class: string, condition: string, return: true|false]
])
```

- **Classes**: passed to the policy's function if the policy type is set to `smart` instead of the data in `check policies`.

- **Class**: have to be a valid class name.

- **Condition**: a string that starts with an operator and then a value to check if the class value apply to the condition. valid opeartors:
    
    - `>` the class value is greater than the given value. example: `">0.3"`.
    
    - `<` the class value is less than the given value. example: `"<0.7"`.

- **Return**: if the condition is applied, the check will return the value if the `return`.

## Extensions

You can use extensions to expand the functionality of ddeep-core easily with full control, real-time listeners, and more...

### Add extensions

you add your extensions to the `extensions.config.js` found in the root directory of your project.

> You need to build the code using `npm run build` after everytime you configure your extensions.

### Schema

```json
{
    "name": string,
    "callback": Function
}
```

### Write your extensions

```javascript
module.exports = [

    {
        name: 'object-keys',
        callback: (obj) => {
            return (typeof obj === 'object') ? Object.keys(obj) : null;
        }
    }

]
```
This is just a very simple extension that returns the keys in a data object. this extension might not be useful but it's just an example to show you how to write your own extensions.

### Use your extensions

Now you can use your extension in your policies or any other file using `extensions.load(extension_name)`. example:
```javascript
var get_object_keys = extensions.load('object-keys');
```

`extensions` is imported by default to your policies but if you want to use your extension in other files, you can require it:
```javascript
var extensions = require('./lib/ext/require');
```

## Whitelisted IPs

in the `ddeep.config.js` you can add a list of IP adresses (of peers, servers, or websites) that are able to connect to your core or server.

this can help you prevent cross-site connections to your core, if the list in empty this option will be ignored.

## Restore checkpoints
If you are using persistent storage, you can setup a checkpoint in the `ddeep.config.js` so the system will create a restore checkpoint based on the options you give it. (more explained in the `ddeep.config.js` file itself).

Now to load data from a restore point, you need to run this:
```bash
node ./dev/storage/recover.js -p POINT_ID
```
you can check the `/recover` directory to see all available checkpoints and pick a point to load your data from, use the checkpoint directory name as the POINT_ID.

## Infrastructure

### Communications

ddeep-core uses fastify to run a websocket server as it's a very efficient WebSocket framework that can handle tens of thousands of requests per second.

if you think that you can upgrade the communications structure, jump to [development](#development).

### CRDT

ddeep-core uses conflict resolution algorithm (HAM), now this is really fully implemented into ddeep-core from gun... so we recommend you check [this page](https://gun.eco/docs/Conflict-Resolution-with-Guns) for more info.

### Storage

ddeep-core uses radix to handle the persistent storage functionality, if `storage: true`.

### Policies

#### Check policies

There is notthing really fancy in check policies, It's just `true | false` callbacks.

#### AI-powered policies

Currently we are using the [SamLowe/roberta-base-go_emotions](https://huggingface.co/SamLowe/roberta-base-go_emotions) model through [HuggingFace inference](https://www.npmjs.com/package/@huggingface/inference).

We are working to upgrade this to a local running classification model running locally in the server itself for lower latency and more stability.

## Decentralized world

This project is part of a big movement to build a decentralized world where developers own their projects and users own their data, and **ddeep-core** is the core of this world.

Based on some simple benchmarks, ddeep-core can perform ~200K ops/sec on a low-end device of 2GB-4GB of ram, and we are always working to get better performance and would be happy to hear your experience with it on [Matrix](https://matrix.to/#/@multineon:gitter.im).

## Development

### `dev` directory
all the code lives in the `/dev` directory, and you can run `npm run build` to build your code to `/dist/build.js`, we use esbuild as it's the fastest tool we've ever used to build nodeJS code.

### License
If you want to develop this project, distribute it or help us improve it, you're welcome to do that, just check the [license](https://github.com/kais-radwan/ddeep-core/blob/main/LICENSE) and you're good to go.

### NOTICE

Some of the files where taken from [gun-port](https://github.com/gundb/port), and there is a license notice in the first 3 lines of these files with a notice if they were modified or not. we recommend you check [gun's license](https://github.com/amark/gun/blob/master/LICENSE.md) before using these files in a distributed version.

## Thanks
We want to give our thanks to all the wonderful people helping us to decentralize the world, and also to:

- [Mark Nadal](https://github.com/amark) for building the best decentralized graph engine ever.

- [esbuild](https://esbuild.github.io/) for building the fastest bundler in the world.

- [fastify](https://fastify.dev/) for building a great fast web framework for nodeJS.

- [bytenode](https://github.com/bytenode/bytenode) for building a great bytecode compiler for NodeJS.

## The idea of ddeep-core

ddeep-core is a complete back-end NodeJS environment to run decentralized real-time databases, peers, and relays.

ddeep-core gives you the full control to configure it, scale it, change it, or do whatever you want... it's yours.

### Ddeep ecosystem

Ddeep core is part of ddeep ecosystem, a decentralized open-source ecosystem of tools for developers to build stable decentralized projects.

### Gun

ddeep-core works fine with [Gun](https://gun.eco) as a peer, and soon we will release the complete ddeep ecosystem so you get a great API to use with ddeep-core.

the idea of this project was inspired by [Gun](https://gun.eco), so we took the idea to the next level, the goal is to give developers a secure & stable way to build decentralized projects so we added [policies](#policies), [extensions](#extensions), upgraded the connections protocols, added more storage configurations and automations for restore checkpoints, and much more...

## Contact us

If you need any help, have any ideas, or want to code something together, you can always send us a message on [Matrix](https://matrix.to/#/@multineon:gitter.im).

Built with ❤️ by Kais Radwan.