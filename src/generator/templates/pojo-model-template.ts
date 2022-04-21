import { PATTERN_MODEL_NAME, PATTERN_MODEL_PROPERTIES, PATTERN_TABLE_FIELDS } from './templates.index';

export const pojoModelTemplate = `export class ${PATTERN_MODEL_NAME} {
    
    //region properties
    ${PATTERN_MODEL_PROPERTIES}
    //endregion
    
    //region table fields
    ${PATTERN_TABLE_FIELDS}
    //endregion
}
`;
