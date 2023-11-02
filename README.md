<br>

<h1 align="center">ddeep core</h1>

<p align="center">Decentralized real-time peer-to-peer data network</p>

<div align="center">

![NPM Downloads](https://img.shields.io/npm/dm/ddeep-core?style=flat-square) 
![NPM License](https://img.shields.io/npm/l/ddeep-core?style=flat-square) 
![code quality](https://img.shields.io/scrutinizer/quality/g/kais-radwan/ddeep-core/main?style=flat-square)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=kais-radwan_ddeep-core&metric=bugs)](https://sonarcloud.io/summary/new_code?id=kais-radwan_ddeep-core)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=kais-radwan_ddeep-core&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=kais-radwan_ddeep-core)
[![Static Badge](https://img.shields.io/badge/chat-on_matrix-lightgreen?style=flat-square)](https://matrix.to/#/@multineon:gitter.im)

</div>

<br>

## Table of contents

- [Table of contents](#table-of-contents)
- [What is ddeep-core ?](#what-is-ddeep-core)
- [Install](#install)
    - [Using npm](#using-npm)
    - [Using Github](#using-github)
    - [Using Docker](#using-docker)
- [Configurations](#configurations)
- [Policies](#policies)
    - [Schema](#schema)
    - [Check policies](#check-policies)
    - [Smart policies (AI-powered)](#smart-policies)
- [Restort checkpoints](#restore-checkpoints)
- [Decentralized world](#decentralized-world)
- [Development](#development)
- [Contact me](#contact-me)

## What is ddeep-core ?

> **ddeep-core is under development**. We are doing our best to reach a stable stage with this project, and please nore that ddeep-core is built using [Bun](https://github.com/oven-sh/bun), a project that's also under development.

ddeep-core is a real-time back-end environment to run a decentralized peer-relay or what we call a `core` to sync and save decentralized graph data.

ddeep-core uses a publish-subscribe approach, and ships with a lot of features such as policies (checkers and AI-powered), persistent storage, data recovery checkpoints, and more...

You can run `ddeep-core` as a back-end peer-relay for your [Gun](https://www.npmjs.com/package/gun) project, and soon we'll be releasing a client library.

## Install

First you need to **install Bun** if haven't already, you can use `npm install -g bun` to install Bun globally, or navigate to [Bun's website](https://bun.sh/).

> Use bun v1.0.7

### Using npm

> Use `sudo` if you get a permission error.

Install ddeep-core globally:
```bash
npm install -g ddeep-core
```

Now run this in your working directory (has to be empty):

```bash
ddeep-init
```

Install the dependencies:
```bash
bun install
```

and now start it:
```bash
bun start
```

### Using Github

Clone this repository:
```bash
git clone https://github.com/kais-radwan/ddeep-core
```

Now install then dependencies:

```bash
bun install
```

and start it:

```bash
bun start
```
### Using Docker

> Use `sudo` if you get a permission error using Docker.

First install `ddeep-core` from npm or Github as described above, and run:

```bash
docker build -t ddeep-core .
```

and now run it:

```bash
docker run -d ddeep-core
```

## Configurations

> Written in Typescript

Your core configurations are defined in the `ddeep.config.ts` found in your working directory, everything is explained with comments in the file itself.

## Policies

Policies are used to control access to data by applying conditions to specific nodes in the graph network.

You can add your policies in the `policies.config.ts` file, the default policies file should look something like this:

```typescript
import { Policy } from './src/policies/builder';

let policies:Array<Policy> = [

    // Your policies go here

];

export default policies;
```

### Schema

let's first discover the schema of a policy in ddeep:

```typescript
{
    type: 'check' | 'smart',
    operations: Array<'get', 'put'>,
    graph: string,
    check: Function: Boolean
}
```

- **type**: There are two types of policies, check policies and smart policies.

- **operations**: Defines the data operations the policy is applied on, can be one of `get` when reading data, or `put` when writing data.

- **graph**: the graph property accept a string of nodes the policies is applied to. if you apply a policy to people it's applied to all nodes under people, but if you apply a policy to people/kais the policy will only be applied to the node kais under people, and so on.

- **check**: A function that returns a `Boolean` (`true` or `false`), if returns `true` the data operation will be performed, otherwise it will be ignored.

### Check policies

Check policies are based on the check function, if the function returns true the access to the data will be granted and if it returns false the data access will be denied.

let's see a simple example:

```typescript
import { Policy } from './src/policies/builder';

let policies:Array<Policy> = [

    {
        type: 'check',
        operations: ['put'],
        graph: 'people/kais',

        check: function (data: any): Boolean {
            return (data?.name) ? true : false;
        }

    }

];

export default policies;
```

this policy will be applied to put operations to the node kais under people and it checks if the data we are putting have a name or not, if it does, the data operation will be granted and the data will be added otherwise the operation will be cancelled.

the data argument passed to the checking function contains the data being putted if the operation is put, and the data is being getted if the operation is get.

what matters is that the checking function has to return true or false, if returned true the opeartion will be processed, and if returned false the opeartion will be ignored.

for example this is also a valid `check()` policy function:

```javascript
function (data) {
    if (data.plan === 'pro') {
        return true;
    } else {
        return false;
    }
}
```

so you have the freedom to build your own `check` functions and policies.

## Smart policies

> WARNING: Smart policies's AI is giving bad results in some cases, has some bugs, and causing latency so be careful using it

> NOTICE: You need to add your HuggingFace token to your `ddeep.config.ts` file to avoid bad rate limits

Smart policies uses AI classification to classify the inputs and gives an object of classes with a score from 0.0 to 1.0 for every class or emotion as 1.0 is the highest score.

the classes generated will be passed to the `check` function, and you can check if a class is more than a certain value or less than a certain value easily, let's see an example:

```typescript
import { Policy } from './src/policies/builder';
import smartChecker from './src/smart_checker';

let policies:Array<Policy> = [

    {
        type: 'smart',
        operations: ['get', 'put'],
        graph: 'posts',

        check: function (classes): Boolean {
            return smartChecker(classes, [
                [ "anger", "<0.5", true ],
                [ "anger", ">0.5", false ]
            ]);
        }

    }

];

export default policies;
```

the policy above is applied to all nodes under posts and it blocks all data that contains angry inputs from being added or read.

with smart policies you need to use the `smartChecker` function to check the classes and return true or false, this is how it's used:

```typescript
return smartChecker(classes, [
    [class: string, condition: string, return: true|false]
])
```


- Classes: passed to the policy's function if the policy type is set to smart instead of the data in check policies.

- Class: have to be a valid class name.

- Condition: a string that starts with an operator and then a value to check if the class value apply to the condition. valid opeartors:

    - `>` the class value is greater than the given value. example: ">0.3".

    - `<` the class value is less than the given value. example: "<0.7".

- Return: if the condition is applied, the check will return the value if the return.


## Restore checkpoints

If you are using persistent storage, you can setup a checkpoint in the `ddeep.config.ts` so the system will create a restore checkpoint based on the options you give it. (more explained in the `ddeep.config.ts` file itself).

Now to recover data from a restore point, you need to run this:

```bash
bun ./src/storage/recover.ts POINT_ID
```

you can check the /recover directory to see all available checkpoints and pick a point to load your data from, use the checkpoint directory name as the POINT_ID.

## Decentralized world

This project is part of a big movement to build a decentralized world where developers own their projects and users own their data, and ddeep-core is the core of this world and part of the Ddeep Ecosystem.

## Development

### License

If you want to develop this project, distribute it or help us improve it, you're welcome to do that, just check the license and you're good to go.

### NOTICE

Some of the files where taken from [gun-port](https://github.com/gundb/port), and there is a license notice in the first 3 lines of these files with a notice if they were modified or not. we recommend you check [gun's license](https://github.com/amark/gun/blob/master/LICENSE.md) before using these files in a distributed version.

## The idea of ddeep-core

Build a complete back-end environment to run decentralized real-time databases, peers, relays, and more...

Ddeep core is part of ddeep ecosystem, a decentralized open-source ecosystem of tools for developers to build stable decentralized projects.

ddeep-core works fine with Gun as a peer, and soon we will release the complete ddeep ecosystem so you get a great API to use with ddeep-core.

the idea of this project was inspired by [Gun](https://gun.eco/), so we took the idea to the next level, the goal is to give developers a secure & stable way to build decentralized projects so we built `ddeep-core` using Bun and Typescript, added policies, upgraded the connections functionality, added more storage configurations and recovery checkpoints, and much more...

## Contact me

If you need any help, have any ideas, or want to code something together, you can always send me a message on [Matrix](https://matrix.to/#/@multineon:gitter.im).

> I'm a little busy lately, I will always respone to any questions and messages, but the question is when :)

Built with ❤️ by Kais Radwan.