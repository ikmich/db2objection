import { IModel, IProperty } from '../index.js';
import { filer } from '../libs/filer.js';
import { objectionModelTemplate } from './templates/objection-model-template.js';
import pkg from 'js-beautify';
import { configUtil } from '../util/config.util.js';
import { CONF_COMMAND_OPTIONS, pathJoin } from '../util/index.js';
import { Db2ObjOpts } from '../bin/index.js';
import * as ChangeCase from 'change-case';
import { PATTERN_MODEL_NAME, PATTERN_MODEL_PROPERTIES, PATTERN_TABLE_FIELDS } from './templates/templates.index.js';
import { pojoModelTemplate } from './templates/pojo-model-template.js';
import appData from '../util/app-data.js';
import Path from 'path';
import { format } from 'date-fns';
import { logNotice } from '../util/log.util.js';

const DATE_FORMAT_HISTORY = 'yyyyMMdd_hhmmss_SSSS';
const { js: beautifyJs } = pkg;

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
    const outputDir = pathJoin(process.cwd(), configUtil.getPropModelsOutputDir());

    const commandOpts = appData.get(CONF_COMMAND_OPTIONS) as Db2ObjOpts;

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

      let objFile = pathJoin(outputDir, `${descriptor.modelName}.obj.ts`);

      if (filer.exists(objFile)) {
        logNotice(`File exists (${objFile})`);
        // create copy?
        const copyDestDir = Path.join(process.cwd(), '__db2obj-history');
        filer.ensureDir(copyDestDir);

        logNotice(`copyDestDir: ${copyDestDir}`);

        const formattedDate = format(new Date(), DATE_FORMAT_HISTORY);
        const historyFileName = `${descriptor.modelName}.obj-${formattedDate}.ts`;
        let historyFilePath = Path.join(copyDestDir, historyFileName);
        filer.write({
          data: filer.read({
            file: objFile
          }),
          file: historyFilePath
        });
      }

      // Write model file to output directory.
      filer.write({
        data: code,
        file: objFile
      });
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
    const runtimeOptions = appData.get(CONF_COMMAND_OPTIONS) as Db2ObjOpts;

    switch (runtimeOptions?.case) {
      case 'camel':
        propertyName = ChangeCase.camelCase(propertyName);
        break;
      case 'snake':
        propertyName = ChangeCase.snakeCase(propertyName);
        break;
    }

    // if (cliOpts && cliOpts.snakeCase) {
    //   propertyName = ChangeCase.snakeCase(propertyName);
    // } else {
    //   propertyName = ChangeCase.camelCase(propertyName);
    // }
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
