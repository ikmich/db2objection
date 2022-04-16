import { ModelDescriptor, PropertyMeta } from '../index';
import { filex } from '../libs/filex';
import {
  modelTemplate,
  PATTERN_MODEL_NAME,
  PATTERN_OBJECTION_PROPERTIES,
  PATTERN_TABLE_FIELDS
} from './templates/model-template';
import { js as beautifyJs } from 'js-beautify';
import { configUtil } from '../util/config.util';

const regexes = {
  modelName: new RegExp(PATTERN_MODEL_NAME, 'g'),
  objectionProperties: new RegExp(PATTERN_OBJECTION_PROPERTIES, 'g'),
  tableFields: new RegExp(PATTERN_TABLE_FIELDS, 'g'),
  nullishOperator: /\s+\?\s+:/g
};

export const modelGenerator = {
  /**
   * Generates an ObjectionJS model class file
   * @param descriptors
   */
  generate(descriptors: ModelDescriptor[]) {
    const outputDir = filex.path(process.cwd(), configUtil.getPropModelsOutputDir());
    filex.resetDir(outputDir);

    for (let descriptor of descriptors) {
      let code = modelTemplate.replace(regexes.modelName, descriptor.modelName);
      code = code.replace(regexes.objectionProperties, generateObjectionProperties(code, descriptor));
      code = code.replace(regexes.tableFields, generateModelProperties(code, descriptor));

      code = beautifyJs(code);

      code = code.replace(regexes.nullishOperator, '?:');

      // Write model file to output directory.
      filex.write({
        data: code,
        file: filex.p(outputDir, `${descriptor.modelName}.model.ts`)
      });
    }
  }
};

function generateObjectionProperties(template: string, descriptor: ModelDescriptor): string {
  let code = `static tableName = '${descriptor.tableName}';`;

  if (descriptor.idColumn && descriptor.idColumn !== 'id') {
    code += `static idColumn = '${descriptor.idColumn};'`;
  }

  return code + '\n';
}

function generateModelProperties(template: string, descriptor: ModelDescriptor): string {
  let code = ``;

  function getDefaultQualifier(property: PropertyMeta): string {
    if (property.defaultVal === null || property.defaultVal === undefined) {
      return '?';
    }
    return '';
  }

  for (let property of descriptor.modelProperties) {
    code += `${property.name}${getDefaultQualifier(property)}: ${property.type}`;
    code += ';\n';
  }

  return code;
}
