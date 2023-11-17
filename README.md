# db2objection

Generate [ObjectionJS](https://vincit.github.io/objection.js/) models from database tables.
_(Note: This is an ESM package from v0.1.0)_

## Install

Install cli globally with npm, yarn or your preferred package manager.

```shell
$ npm install -g db2objection
# or
$ yarn add global db2objection
```

## Supported databases

`db2objection` currently supports the following databases:

- MySQL
- PostgreSQL
- SQLite

## Commands

Run the commands in the root of the target project that's connecting to the database.

### `$ db2obj init`

Create the `db2objection.config.js` file. This should be the first step to using `db2objection` in your project.

###### Options

`--reset` [boolean] Remove existing config file and create a new one.

### `$ db2obj generate`

Generate ObjectionJS model classes.

###### Options

`--snake-case` [boolean] - Indicate that the model properties should be printed in snake case.  
`-t | --table=<table_reference>` [string] - Name(s) of table(s) to generate model for. Use space to specify multiple
tables.
`-db | --database=<database_name>` [string] - The database to connect to. This overrides the database value that is set
in the config file.  
`--pojo` [boolean] - Whether plain Typescript model classes will be generated, and not classes extending Objection.js
Model.

### `$ db2obj --help`

See help information about the commands and options.

### `$ db2obj --version`

See the current version.

## The config file

The `db2objection.config.js` file is a module with the following properties:

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
   * Set to 'true' to use snake case for the generated model properties
   */
  snakeCase: false
};
```

---

# 0.1.0 changelogs

- Convert to ESM package.
- The dir for generated models will not be deleted anymore. Now, the specific model files will simply be replaced
  and a copy of the old file be placed in the history folder in the project root.
- Database name value from cli option flag takes precedence over value in `db2objection.config.cjs` file.
- cli update: `--case` is now a string option, replacing --camelCase.
- New cli option: `--dir` to specify where model object files will be generated.