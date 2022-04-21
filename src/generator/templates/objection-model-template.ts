import { PATTERN_MODEL_NAME, PATTERN_MODEL_PROPERTIES, PATTERN_TABLE_FIELDS } from './templates.index';

export const objectionModelTemplate = `import { Model } from 'objection';

export class ${PATTERN_MODEL_NAME} extends Model {
    
    //region Objection properties
    ${PATTERN_MODEL_PROPERTIES}
    //endregion
    
    //region table fields
    ${PATTERN_TABLE_FIELDS}
    //endregion
    
    //region Objection methods
    /* Override Objection methods here */
    //endregion
}
`;
