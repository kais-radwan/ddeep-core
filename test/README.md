

# `ddeep`

The ecosystem for building stable real-time decentralized applications.

## Table of contents

- [`ddeep`](#ddeep)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Introduction](#introduction)
    - [Key features](#key-features)
  - [Getting started](#getting-started)
    - [Initialize](#initialize)
  - [Database](#database)
    - [Getting started](#getting-started-1)
    - [Put data](#put-data)
    - [Subscribe to data](#subscribe-to-data)
    - [Get data once](#get-data-once)
    - [Policies](#policies)
  - [Peers](#peers)
    - [How peers work](#how-peers-work)
    - [Run your peer](#run-your-peer)
    - [Do you need your own peers ?](#do-you-need-your-own-peers-)
  - [Data policies](#data-policies)
    - [Schema and types](#schema-and-types)
    - [Apply policies](#apply-policies)
    - [Check policies](#check-policies)
    - [Smart policies](#smart-policies)
  - [Extensions](#extensions)
    - [Add extensions](#add-extensions)
    - [Use extensions](#use-extensions)
    - [Extensions instance](#extensions-instance)
  - [Thanks](#thanks)
  - [How Ddeep works (demo)](#how-ddeep-works-demo)
    - [data operations](#data-operations)
    - [policies](#policies-1)


## Installation

Using a CDN (Recommended only for vanilla JS usage):

```html
<script src="" ></script>
```

Install the Javascript library in your project:

```bash
npm install ddeep
```

Install globally in your machine (for running peers):

```bash
npm install -g ddeep
```

## Introduction

Ddeep is a set of tools to help you build real-time decentralized applications, with the main focus on security, flexibility, and stability.

### Key features

*   real-time data channels and listeners (peer-to-peer)
*   secure and custom data scopes and smart policies
*   authentication and encryption
*   Process blockchain smart contracts
*   Stable graph database
*   Stable APIs to build secure Javascript decentralized apps
*   Vector data support to train AI models

## Getting started

Ddeep is not one tool, It's a huge set of tools each with its own usecases, so let's start by inistializing Ddeep in your project after you install it.

### Initialize

This is a great example to setup your DDEEP program and database:

```javascript
import DDEEP from 'ddeep'; // Don't do this if loading from a CDN

const DDEEP = require("ddeep"); // NodeJS

// Create a ddeep program
const DDEEP = new DDEEP({
    peers: ["localhost:8000"] // add your peers
});

// Define the database
const db = program.DB;
```

these are all the valid options in the `DDEEP` constructor:

```javascript
const ddeep = new DDEEP({

    peers: Array<string>, // all peers to use

    local: true | false, // save data in browser's localStorage or not

    hf: string // huggingface token to use with smart policies

})
```

## Database

Ddeep's database is built on top of [Gun](https://gun.eco), a graph real-time decentralized peer-to-peer databsae, and we inhanced it with more security layers, data scopes and customizable and AI-powered policies so all the operations are stable, secure, and fully customizable with extensions.

![](https://miro.medium.com/v2/resize:fit:1112/1*TjJxYQYuaTqqMlWwMmCGFg.png)

so by using Ddeep, you have the full power of Gun along with all the security features and inhancements we made.

You can start with this without running peers, or anything you just setup ddeep in your project and you're ready to go, however if you want to have your own peers and have persistent storage you can run ddeep-peer.

### Getting started
The syntax here is just like Gun's syntax, so if you've used Gun before this should be familiar to you and you can skip this section.

This is a graph database, so the data is saved as nodes, It's similar to how no-sql databases work, first let's initialize the database:

```javascript
const ddeep = new DDEEP(/*options*/);

const db = ddeep.db;
```

`ddeep.db` has the full functionality of both Gun and Ddeep.

We strongly recommend you check [Gun docs](https://gun.eco) and learn more about how gun works.

### Put data
In the example below, we are putting data to the node "kais" in the "people" node.

if you've used no-sql databases before, here "people" is actually a collection that can contain documents (nodes) and "kais" is the document (node) we are adding:

```javascript
// Put a node (document) to "people"
db.get("people").get("kais").put({
    name: "kais",
    role: "developer"
});

// Put a node "prjects" to "people->kais" node
db.get("people").get("kais").get("projects").put([
    "ddeep"
]);

// Schema
db.get(node: string).get(node: string).put(data: any)
```

### Subscribe to data

Let's listen to the node's data we just added in real-time:
```javascript
// subscribe to a node
db.get("people").get("kais").on( (data) => {
    console.log(data); // do anything with the data
});

// schema
db.get(node: string).on(callback: Function)

```
We subscribe to a node so when the node's data changes the callback will be called in real time.

The callback will also be called when you add the listener.

### Get data once

If you want to get data without subscribing to real-time changes, you can do this:
```javascript
// Get node's data once
db.get("people").get("kais").once( (data) => {
    console.log(data);
});

// schema
db.get(node: string).once(callback: Function)
```

### Policies

Data policies are one of the most important in Ddeep. [see below](#data-policies)

## Peers

### How peers work

Ddeep uses [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer) communication, so the data is first saved in the user's browser, and two devices can talk and share data together without a central peer between them.

![decentralized network](https://miro.medium.com/v2/resize:fit:901/1*_3CJO8LCMPnTRx9tmzJZHg.jpeg)

But one device can't access data on another device if it does not have a public IP address, so you need to run peers (peers) to synchronize data across the devices in the network while keeping it decentralized.

Peers are not centralized. and actually every device in the network is a peer but if data only exists on one device and the device goes offline the data can still be access from the peer.

### Run your peer

To run your own peer, Install ddeep globally in your machine using `npm install -g ddeep`.

You can run a peer without a persistent storage so it's only used to sync data across devices:

```bash
ddeep serve --p 8000
```

and you can enable persisten storage to save data for long-term with checkpoints:

```bash
ddeep serve --p 8000 --s
```

and now you can add your own peer to your ddeep config in the front-end:

```javascript
const ddeep = new DDEEP({
    peers: ["localhost:8000"]
});
```

In development, you can start ddeep-peer locally, and in production you can run it using any NodeJS hosting or any server.

### Do you need your own peers ?

if you don't run your peers ddeep will use our public peers to sync the data so you don't actually have to run your peers, but our peers won't be used for persistent storage.

To get data or a node, it has to exist on a peer even if it's a browser, a server, or any device.


- public peers cache is deleted every few hours.
  
- If the data you want to get exist on a device that's offline you won't be able to get the data, so you need a peer running with persistent storage.

- using authentication is only saved in the user's device, so if the user changes his device he won't be able to login back to his old account as it only exists in the old device. here you also need a peer with persistent storage.

- public peers may go down from time to time based on some factors like the traffic or other technical issues.

- if you're building a stable production application, we recommend you run your own peer.

## Data policies

Data policies gives you full customizability to choose what data and inputs can be added to the network or certain nodes and choose who can subscribe to certain nodes...

### Schema and types

let's first discover a policy schema in Ddeep:

```javascript
{
    name: string,
    
    operations: ['subscribe', 'put', 'update'],
    
    node: Array<string>

    type: "check" || "smart",
    
    check: Function // return true or fales
}
```
There are two types of policies, check policies and smart policies, so let's discover how every policy works.

### Apply policies

when you setup your policy you can apply it like this:
```javascript
ddeep.applyPolicy(policy);
```

if you have multiple policies, you can add them all to an array and run this:

````javascript
ddeep.applyPolicies(policies)
````

the `node` property accept an array of nodes. if you apply a policy to `["people"]` node it's applied to all nodes under 'people', but if you apply a policy to `["people", "kais"]` the policy will only be applied to the node 'kais' under 'people'.

### Check policies

Check policies are based on the check function, if the function returns `true` the access to the data will be granted and if it returns `false` the data access will be denied.

let's see a simple example:

```javascript
const policy = {

    name: "policy1",
    operations: ["put"],
    node: ["people", "kais"],
    type: "check",

    check (data) {

        return ddeep.check([data?.plan, true], data)

    }

}
```

this policy will be applied to `put` operations to the node 'kais' inside the node 'people' and it checks if the data we are putting have a 'plan' property or not, if it does, the data operation will be granted and the data will be added otherwise the operation will be cancelled.

you don't actually need to use `ddeep.check`, but It's an easy way to check if a value exists or equalt to another value and return `true` or `false` based on that.

what matters is that the `check()` function has to return `true` or `false`.

for example this is also a valid `check()` policy function:

```javascript
check () {

    if (data.plan === "pro") return true;
    
    if (data.plan !== "pro") return false;

}
```

you have full customizability to build your own check functions and policies.

### Smart policies

Smart policies uses AI classification to classify the inputs and gives an object of classes with the score from 0.0 to 1.0 as 1.0 is the highest score.

To use smart policies you need to add your own [HuggingFace token](https://huggingface.co/docs/hub/security-tokens) and otherwise you'll face bad request limits. don't worry it's totally free and easy, just get your token and add it to your ddeep options like this:

```javascript
const ddeep = new DDEEP({
    hf: "YOUR_TOKEN"
});
```

We recommend using environment variables to keep your token safe.

now you can check if a class is more than a certain value or less than a certain value, It's super easy let's see the example below:

```javascript
const policy = {

    name: "smart policy",
    operations: ["put", "subscribe"],
    node: ["posts"],
    type: "smart",

    check (classes) {

        return ddeep.smartCheck(classes, [
            [ "anger", "<0.5", true ],
            [ "anger", ">0.5", false ]
        ])

    }

}
```

the policy above is applied to all nodes under "posts" and it blocks all data that contains angry inputs from being added or read.

with smart policies you need to use `ddeep.smartCheck` to check the classes and return `true` or `false`. this is how you smartCheck is used:

```javascript
ddeep.smartCheck(classes, [
    [class:string, condition:string, return:true||false]
])
```

- **Class**: have to be a valid class name.

- **Condition**: a string start with an operator and then a value to check if the class value apply to the condition. valid opeartors:
    
    - `>` the class value is greater than the given value. example: `">0.3"`.
    
    - `<` the class value is less than the given value. example: `"<0.7"`.
    
    - `=` the class value is equal to the given value. example: `"=0.6"` (not recommend).
    
    - `!` the class is not equal to the given value. example `"!0.6"` (not recommended).

- **Return**: if the condition is applied, the check will return the value if the `return`.

## Extensions

extensions are used to extend the functionality of `ddeep.db` and process customizable data operations.

### Add extensions

To add your extensions to the database chain you can use `ddeep.addExtension`, see example:

```javascript
ddeep.addExtension("extension1", (instance, options) => {

    // instance is the full current db chain
    // so you have full access to both gun and ddeep inthe instance

    instance.on( (data) => {

        db.get(data?.name).on( (nameData) => {
            console.log(nameData);
        });

    })

})
```

### Use extensions

Now we can use the extension we added above like this:

```javascript
db.get("people").get("kais").extension("extension1");
```

to pass options you can do this:

```javascript
db.get("people").get("kais").extension("extension1", {
    // options
})
```

### Extensions instance

the instance used in extensions is passed from the current operation chain that's built by `gun` and passed to the extension.

## Thanks

We send our thanks to:

- [Mark Nadal](https://github.com/amark) for creating the best decentralized protocol ever, [Gun](https://gun.eco).

- [Web3 team](https://github.com/web3) for creating [web3.js](https://github.com/web3/web3.js), the official etherium Javascript API.

- [QuickNode team](https://www.quicknode.com/about) for providing super fast Blockchain APIs.

## How Ddeep works (demo)

This section explains how ddeep works with some diagrams, this is a demo and you might see some mistakes in the diagram.

the diagrams functionality are only to make things clear and easy a little bit and does not reflect the actual code after the production build.

### data operations

`ddeepOP` is the global processor for all the databsae operations, It's built in with every data operation based on its type and functionality:

<img src="https://app.code2flow.com/MyVCzmlFHKLo.svg" style="background: #fff" />

### policies

If you want to understand how the policies functionality works we recommend you check this section.

policies are built in with every data chain in `gun`, so when you run any operation first the system needs to get an array of the nodes you running the operation on like `db.get("people").get("kais")` (here the nodes are `["people", "kais"]`), so we need to process the instance as described here:

<img src="https://app.code2flow.com/AhDfxJNK7Tja.svg" style="background: #fff" />

Now we need to check policies and current node path to scan all policies applied to the current node we are excuting the operation on:

<img src="https://app.code2flow.com/dhachBXWD0hU.png" style="background: #fff" />

the policy processor will be called from the scanner and it will process a policy based on its type:

<img src="https://app.code2flow.com/R7Iy3i6Usv5i.svg" style="background: #fff" />

