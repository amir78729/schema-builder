import { StringField, StringFieldType } from '../primitives/StringField';

export type DateTimeType = StringFieldType;

export class DateTimeField extends StringField {
  constructor(name: string) {
    super(name);
    this.format = 'date-time';
  }
}
