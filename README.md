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

### `db2obj init`

Create the `db2objection.config.js` file. This should be the first step to using `db2objection` in your project.

###### Options

`--reset` [boolean] Remove existing config file and create a new one.

### `db2obj generate`

Generate ObjectionJS model classes.

###### Options

```text
Options:

  -t, --table [tables...]  Name of table to generate model for.
  --reset-config           Used with the init command to specify whether to reset the config file if it already exists.
  -c | --case <char>       (snake | camel | ignore) Used with the `generate` command to indicate the name case for the generated model properties.
  --pojo                   Used with the `generate` command to specify whether plain Typescript model classes will be generated, and not classes extending ObjectionJS Model.
  --db, --database <char>  Specify the database to connect to. This overrides the database value that is set in the config file.
  --dir <char>             Specify target directory path relative to the project root.
  -h, --help               display help for command

Commands:
  init                     Generate config file: db2objection.config.cjs and initialize.
  generate                 Generate objection models from db
  gen                      Alias for 'generate'
  test-connection          Test the database connection.
  help [command]           display help for command
```

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

  modelsOutputDir: 'src/obj-models', // Relative path where the objection models should be saved.

  ignoreTables: [], // Tables to be ignored. e.g. migration tables and other tables used by frameworks.

  case: 'camel' // 'camel' | 'snake' | 'ignore'
};
```

---

# Changelogs

### 0.1.0

- Convert to ESM package.
- The dir for generated models will not be deleted anymore. Now, the specific model files will simply be replaced
  and a copy of the old file be placed in the history folder in the project root.
- Database name value from cli option flag takes precedence over value in `db2objection.config.cjs` file.
- cli update: `--case` is now a string option, replacing --camelCase.
- New cli option: `--dir` to specify where model object files will be generated.
- Specify multiple tables for --table cli flag

### 0.1.1

- New cli command: `test-connection` to check that the db configuration is setup properly.
- Fix outdated README contents.