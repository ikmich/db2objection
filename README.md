# db2objection

Generate [ObjectionJS](https://vincit.github.io/objection.js/) models from database tables.

## Install

```shell
$ npm install -g db2objection
# or
$ yarn add global db2objection
```

## Commands

Run the commands in the root of the target project that's connecting to the database.

### `$ db2obj init`

Create the `db2objection.config.js` file. This should be the first step to using `db2objection` in your project.

###### Options

`--reset` [boolean] Remove existing config file and create a new one.

### `$ db2obj generate`

Generate ObjectionJS model classes.

###### Options

`--camelCase` [boolean] - Specify whether the model properties should be printed in camel case.  
`--table=<table_reference>` [string] - Name of table to generate model for. Set this option multiple times to specify an
array of tables.  
`--database=<database_name>` [string] - The database to connect to. This overrides the database value that is set in the
config file.
`--pojo` [boolean] - Whether plain Typescript model classes will be generated, and not classes extending ObjectionJS
Model.

### `$ db2obj --help`

See help information about the commands and options.

### `$ db2obj --version`

See the current version.

## The config file

The `db2objection.config.js` file is a js module with the following properties:

```javascript
module.exports = {
  /**
   * Knex configurations.
   */
  knex: {
    client: '',
    connection: {
      database: '',
      host: '',
      port: 0,
      user: '',
      password: ''
    }
  },

  /**
   * Relative path where the objection models should be saved. Be careful, as the contents of this directory will be
   * overwritten when the `generate` command is run.
   */
  modelsOutputDir: '',

  /**
   * Tables for which models will not be generated.
   */
  ignoreTables: [],

  /**
   * Set to 'true' to use camelCase for the generated model properties
   */
  camelCase: false
};
```
