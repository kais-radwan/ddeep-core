## licenses

**ddeep-core**'s license can be found [here](https://github.com/kais-radwan/ddeep-core/blob/main/LICENSE).

NOTICE: We've used the source code of some other projects in `ddeep-core`, all these files have a notice with the license and if it was modified or not.

We've used the following open source library/code for some features, concepts, ideas and more in `ddeep-core`:

- [GUN](https://github.com/amark/gun/blob/master/LICENSE.md) (Zlib | MIT | Apache-2.0)
    - The idea of ddeep-core was inspired by the GUN project, we also used some of the source code with some additional modifications. for sure we give our thanks to [Mark Nadal](https://github.com/amark).

- [fastify](https://github.com/fastify/fastify) (MIT)
    - We used fastify to handle websocket connections as we found it as the best option to go with.

- [bytenode](https://github.com/bytenode/bytenode/blob/master/LICENSE) (MIT)
    - Bytenode is a minimalist `V8` bytecode compiler for Node.js. using Bytenode is optional and up to you (check package.json scripts). of course cheers for the great work done by Osama Abbas and the team working on bytenode

- [esbuild](https://github.com/evanw/esbuild/blob/main/LICENSE.md) (MIT)
    - esbuild is the fastest bundler we've ever used, and as we are using [Typescript](https://github.com/microsoft/TypeScript), you need to bundle the code each time you edit your configurations or policies, esbuild is crazly fast in bundling the code so it just solves the problem.

- [Huggingface inference](https://github.com/huggingface/huggingface.js/blob/main/LICENSE) (MIT)
    - We are using the HuggingFace inference API to use a text classification model only in smart policies (this is what is causing a latency when using smart AI-powered policies).


- [SamLowe/roberta-base-go_emotions](https://huggingface.co/SamLowe/roberta-base-go_emotions) (MIT)
    - We are using this text classification model in smart policies to classify the emotions of the data passed to a smart policy.