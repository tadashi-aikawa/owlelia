# Owlelia

Utility for DDD 🦉

[![npm version](https://badge.fury.io/js/owlelia.svg)](https://badge.fury.io/js/owlelia)
[![Actions Status](https://github.com/tadashi-aikawa/owlelia/workflows/Tests/badge.svg)](https://github.com/tadashi-aikawa/owlelia/actions)
[![codecov](https://codecov.io/gh/tadashi-aikawa/owlelia/branch/master/graph/badge.svg)](https://codecov.io/gh/tadashi-aikawa/owlelia)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tadashi-aikawa/owlelia/blob/master/LICENSE)

<img src="https://github.com/tadashi-aikawa/owlelia/raw/master/logo.svg?sanitize=true" width=300 alt="logo" />

## Install

```console
npm i owlelia
```

## Sample

There are some sample codes which use _owlelia_ in `./sample`.

## For developers

### Setup

```bash
git config core.hooksPath hooks
```

### Requirements

- Node.js >= 22
- pnpm
- TypeScript >= 4.1

### Develop

Before, you need to install [Task].

```console
task install
task build
task test
```

### Release

- [ ] Don't you need to add some exports to `index.ts`?

```
task version-up VERSION=x.y.z
```

Then, GitHub Actions will automatically package and upload Owlelia.

[task]: https://github.com/go-task/task
