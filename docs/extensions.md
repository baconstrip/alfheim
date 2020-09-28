# Extensions

Extensions are the primary functionality for extending Alfheim with new stories,
worlds, functionality, etc.

## Writing Extensions

Basic extensions to the game reside in the folder `/extensions`, and each 
extension is a folder within. 

Each extension is required to have at least two files, `package.json` and a
Javascript/Typescript (of arbitrary name) that corressponds to the entry point
of the extension.

### package.json

The `package.json` file conforms to the NodeJS package format, more information
here:
https://nodejs.org/en/knowledge/getting-started/npm/what-is-the-file-package-json/

In addition to the required fields listed by NodeJS (currently `name` and 
`version`), Alfheim requires the following additional fields:

  * `main`: a relative path to a Typescript/Javascript file that serves as
  an entry point. See [main](#main-file) below for a description of the requirements
  for this file.
  * `plugin`
    * `features`: a list of features that this plugin provides, including its 
    name, so that other extensions may depend on it.
    * `requires`: a list of plugins/features that this extension relies on, it
    will fail to load if any of these are not met. This extension is guarenteed to be loaded after the extensions in this list.

*A note about the names*: The name must be of the form `.*-alfheim`, e.g. 
`great-extension-alfheim`, and it must provide a feature with the name of the
extension preceeding the `-alfheim` prefix, for our example above, this would
be `great-extension`.

An example bare minimum extension declaration:

```JSON
{
    "name": "example-alfheim",
    "version": "0.0.1",
    "main": "index.ts",
    "plugin": {
        "features": ["example"],
    }
}
```

*NOTE: it is strongly recommended to set `private: true` in the `package.json`
to prevent NPM from accidentally publishing it.*

### Main File

The main file of an extension provides the entry point for an extension, and
allows it to export features.

Main files are expected to export at least one function named `setup`, and a
dictionay named `features`. Entries in the `features` dictionary can be
any type, and can be accessed by this extension or others. `features` dictionary
at the name of the extension is expected to return a reference to the module
itself (this can be achieved with the `module` name inside the file).

Here's an example of a main file (for an extension named 'great-extension'):

```TypeScript
export function setup() {
    console.log("Loaded great-extension");
}

export var features = {
    'great-extension': module
}
```

*Note: these are the minimum requirements for main module to export, additional
features are described in the next heading*

## Extension API

### `setup()`

`setup()` is invoked exactly once per instance, at the first time the extension
is loaded. In this, the extension can do things like register global listeners,
create information it needs to store, and load information that has been saved.

### `newInstance(inst: Instance)`

`newInstance(inst: Instance)` is invoked whenever a new instance is created, and is invoked
before any players are spawned into the instance.

It is invoked with a single argument, the `Instance` that represents the
instance that was created.

*Note: This is never invoked for the default instance, if you need a listener
for the default instance, register and instance listener in the setup()
function, as it is guarenteed to be invoked before any players are spawned into
the default instance.*