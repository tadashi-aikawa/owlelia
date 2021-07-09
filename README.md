Owlelia
=======

Utility for DDD 🦉

[![npm version](https://badge.fury.io/js/owlelia.svg)](https://badge.fury.io/js/owlelia)
[![Actions Status](https://github.com/tadashi-aikawa/owlelia/workflows/Tests/badge.svg)](https://github.com/tadashi-aikawa/owlelia/actions)
[![codecov](https://codecov.io/gh/tadashi-aikawa/owlelia/branch/master/graph/badge.svg)](https://codecov.io/gh/tadashi-aikawa/owlelia)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tadashi-aikawa/owlelia/blob/master/LICENSE)

<img src="https://github.com/tadashi-aikawa/owlelia/raw/master/logo.svg?sanitize=true" width=300 alt="logo" />


Install
-------

```
npm i owlelia
```


Sample
------

There are some sample codes which use _owlelia_ in `./sample`.


For developers
--------------

### Requirements

Node.js >= 0.12 

### Develop

```
# Install dependencies
make init-develop
# Test
make test
```

### Release

#### Recommended

Release with GitHub Actions

https://github.com/tadashi-aikawa/owlelia/actions/workflows/release.yaml?query=workflow%3ARelease

#### Manually

```
make release version=x.y.z
```
