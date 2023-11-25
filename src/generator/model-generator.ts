import { IModel, IProperty } from '../types.js';
import { filer } from '../libs/filer.js';
import { objectionModelTemplate } from './templates/objection-model-template.js';
import jsBeautifyPackage from 'js-beautify';
import { pathJoin } from '../util/index.js';
import { Db2ObjOpts } from '../bin/index.js';
import * as ChangeCase from 'change-case';
import { PATTERN_MODEL_NAME, PATTERN_MODEL_PROPERTIES, PATTERN_TABLE_FIELDS } from './templates/templates.index.js';
import { pojoModelTemplate } from './templates/pojo-model-template.js';
import appData from '../util/app-data.js';
import Path from 'path';
import { DB2OBJ_DIRNAME } from '../consts.js';
import { appUtil } from '../util/app.util.js';
import * as fs from 'fs-extra';
import { logNotice } from '../util/log.util.js';

// const DATE_FORMAT_HISTORY = 'yyyyMMdd_hhmmss_SSSS';
const { js: beautifyJs } = jsBeautifyPackage;

const regexes = {
  modelName: new RegExp(PATTERN_MODEL_NAME, 'g'),
  modelProperties: new RegExp(PATTERN_MODEL_PROPERTIES, 'g'),
  tableFields: new RegExp(PATTERN_TABLE_FIELDS, 'g'),
  nullishOperator: /\s+\?\s+:/g
};

export const modelGenerator = {

  /**
   * Generates an ObjectionJS model class file
   * @param descriptors
   */
  generate(descriptors: IModel[]) {
    // const outputDir = pathJoin(process.cwd(), configUtil.getModelsOutputDirProperty());
    let outputDir = appUtil.resolveModelsOutputDirPath();

    const commandOpts = appData.getCommandOptions();

    if (commandOpts?.scope && commandOpts?.scope.trim()) {
      const scope = commandOpts?.scope.trim()
        .replace(/[^a-zA-Z0-9-_]/g, '');

      outputDir = Path.join(outputDir, scope);
    }

    fs.ensureDirSync(outputDir);

    let modelTemplate = (() => {
      if (commandOpts && commandOpts.pojo) {
        return pojoModelTemplate;
      }
      return objectionModelTemplate;
    })();

    for (let descriptor of descriptors) {
      let code = modelTemplate.replace(regexes.modelName, descriptor.modelName);
      code = code.replace(regexes.modelProperties, generateObjectionProperties(code, descriptor));
      code = code.replace(regexes.tableFields, generateModelProperties(code, descriptor));

      code = beautifyJs(code, {
        brace_style: 'preserve-inline',
        indent_size: 2
      });

      code = code.replace(regexes.nullishOperator, '?:');

      let modelFilename = `${descriptor.modelName}.obj.ts`;
      let objFile = pathJoin(outputDir, modelFilename);

      const useCase = {
        forNewModelFile() {
          filer.write({
            data: code,
            file: objFile
          });
          logNotice(`${modelFilename} generated in ${outputDir}`);
        },
        forExistingFile() {
          // create copy version.
          const destDir = Path.join(process.cwd(), DB2OBJ_DIRNAME);
          // todo - if dir does not exist, ask user to allow adding it in .gitignore.
          filer.ensureDir(destDir);

          // const formattedDate = format(new Date(), DATE_FORMAT_HISTORY);
          // const historyFileName = `${descriptor.modelName}.obj-${formattedDate}.ts`;
          const filename = `__${descriptor.modelName}.obj.ts`;
          let destFilepath = Path.join(destDir, filename);
          filer.write({
            data: code,
            file: destFilepath
          });
          logNotice(`(copy) ${filename} generated in ${destFilepath}`);
        }
      };

      if (filer.exists(objFile)) {
        useCase.forExistingFile();
      } else {
        // Write model file to output directory.
        useCase.forNewModelFile();
      }
    }
  }
};

function generateObjectionProperties(template: string, descriptor: IModel): string {
  let code = `static tableName = '${descriptor.tableName}';`;

  if (descriptor.idColumn && descriptor.idColumn !== 'id') {
    code += `static idColumn = '${descriptor.idColumn};'`;
  }

  return code + '\n';
}

function generateModelProperties(template: string, model: IModel): string {
  let code = ``;

  function getDefaultQualifier(property: IProperty): string {
    if (property.isNullable) {
      return '?';
    }

    return '';
  }

  for (let property of model.modelProperties) {
    let propertyName = property.name;

    // can use snake case if option provided
    const runtimeOptions = appData.getCommandOptions() as Db2ObjOpts;

    switch (runtimeOptions?.case) {
      case 'camel':
        propertyName = ChangeCase.camelCase(propertyName);
        break;
      case 'snake':
        propertyName = ChangeCase.snakeCase(propertyName);
        break;
    }

    code += `${propertyName}${getDefaultQualifier(property)}: ${property.type}`;

    // /* Set default value if property is not nullable */
    // if (!property.isNullable) {
    //   if (property.type?.toLowerCase() === 'date') {
    //     code += ` = new Date()`;
    //   } else if (property.type?.toLowerCase() === 'object') {
    //     code += ` = {}`;
    //   } else {
    //     code += ` = ${property.defaultVal}`;
    //   }
    // }

    code += ';\n';
  }

  return code;
}
