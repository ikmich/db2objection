import { IModel, IProperty } from '../index';
import { filer } from '../libs/filer';
import { objectionModelTemplate } from './templates/objection-model-template';
import { js as beautifyJs } from 'js-beautify';
import { configUtil } from '../util/config.util';
import { _path, CONF_COMMAND_OPTIONS } from '../util';
import { Db2ObjectionOpts } from '../bin';
import * as ChangeCase from 'change-case';
import { PATTERN_MODEL_NAME, PATTERN_MODEL_PROPERTIES, PATTERN_TABLE_FIELDS } from './templates/templates.index';
import { pojoModelTemplate } from './templates/pojo-model-template';
import appData from '../util/app-data';

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
    const outputDir = _path(process.cwd(), configUtil.getPropModelsOutputDir());
    filer.resetDir(outputDir);

    const commandOpts = appData.get(CONF_COMMAND_OPTIONS) as Db2ObjectionOpts;

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

      code = beautifyJs(code);

      code = code.replace(regexes.nullishOperator, '?:');

      // Write model file to output directory.
      filer.write({
        data: code,
        file: _path(outputDir, `${descriptor.modelName}.model.ts`)
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

    // can use camelCase if option provided
    const commandOptions = appData.get(CONF_COMMAND_OPTIONS) as Db2ObjectionOpts;
    if (commandOptions && commandOptions.camelCase) {
      propertyName = ChangeCase.camelCase(propertyName);
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
