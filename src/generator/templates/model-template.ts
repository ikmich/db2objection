export const PATTERN_MODEL_NAME = '%modelName%';
export const PATTERN_OBJECTION_PROPERTIES = '%ObjectionProperties%';
export const PATTERN_TABLE_FIELDS = '%TableFields%';

export const modelTemplate = `import { Model } from 'objection';

export class ${PATTERN_MODEL_NAME} extends Model {
    
    //region Objection properties
    ${PATTERN_OBJECTION_PROPERTIES}
    //endregion
    
    //region table fields
    ${PATTERN_TABLE_FIELDS}
    //endregion
    
    //region Objection methods
    /* Override Objection methods here */
    //endregion
}
`;
