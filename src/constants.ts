import { StringField } from './fields/primitives/StringField';
import { IntegerField } from './fields/primitives/IntegerField';
import { BooleanField } from './fields/primitives/BooleanField';
import { NumberField } from './fields/primitives/NumberField';
import { ObjectField } from './fields/containers/ObjectField';
import { ArrayField } from './fields/containers/ArrayField';
import { DateField } from './fields/widgets/DateField';
import { TimeField } from './fields/widgets/TimeField';
import { DateTimeField } from './fields/widgets/DateTimeField';
import { FieldConfig } from './types';
import { SelectField } from './fields/widgets/SelectField';

export const SCHEMA_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  INTEGER: 'integer',
  OBJECT: 'object',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
};

export const PRIMITIVE_PROPERTIES: FieldConfig[] = [
  {
    id: 'STRING',
    title: 'String Field',
    description: 'a string field',
    Class: StringField,
  },
  {
    id: 'INTEGER',
    title: 'Integer Field',
    description: 'a integer field',
    Class: IntegerField,
  },
  {
    id: 'NUMBER',
    title: 'Number Field',
    description: 'a number field',
    Class: NumberField,
  },
  {
    id: 'BOOLEAN',
    title: 'Boolean Field',
    description: 'a boolean field',
    Class: BooleanField,
  },
];

export const CONTAINER_PROPERTIES: FieldConfig[] = [
  {
    id: 'ARRAY',
    title: 'Array Field',
    description: 'a array field',
    Class: ArrayField,
  },
  {
    id: 'OBJECT',
    title: 'Object Field',
    description: 'a object field',
    Class: ObjectField,
  },
];

export const STRING_WIDGETS: FieldConfig[] = [
  {
    id: 'DATE',
    title: 'Date Field',
    description: 'a date field',
    Class: DateField,
  },
  {
    id: 'DATE_TIME',
    title: 'Date-Time Field',
    description: 'a date-time field',
    Class: DateTimeField,
  },
  {
    id: 'TIME',
    title: 'Time Field',
    description: 'a time field',
    Class: TimeField,
  },
  {
    id: 'SELECT',
    title: 'Select Field',
    description: 'a select field with a list of options',
    Class: SelectField,
  },
];

export const PROPERTIES = [...PRIMITIVE_PROPERTIES, ...CONTAINER_PROPERTIES, ...STRING_WIDGETS];
