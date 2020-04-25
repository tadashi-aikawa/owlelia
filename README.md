# Owlelia

Utility for DDD 🦉

[![npm version](https://badge.fury.io/js/owlelia.svg)](https://badge.fury.io/js/owlelia)
[![Actions Status](https://github.com/tadashi-aikawa/owlelia/workflows/Tests/badge.svg)](https://github.com/tadashi-aikawa/owlelia/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2d25fe948ba57717c578/test_coverage)](https://codeclimate.com/github/tadashi-aikawa/owlelia/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/2d25fe948ba57717c578/maintainability)](https://codeclimate.com/github/tadashi-aikawa/owlelia/maintainability)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tadashi-aikawa/owlelia/blob/master/LICENSE)

<img src="https://github.com/tadashi-aikawa/owlelia/raw/master/logo.svg?sanitize=true" width=300 alt="logo" />

## Install

```
npm i owlelia
```

## Sample

There are some sample codes which use _owlelia_ in `./sample`.

You need to install other packages as following.

- [type-fest](https://github.com/sindresorhus/type-fest)
- [dayjs](https://github.com/iamkun/dayjs)

## Release

```
npm run build
npm test
npm version x.y.z
npm run build
npm publish
git push --tags
git push
```
