import {StringField, StringFieldType} from "../primitives/StringField";

export type TimeType = StringFieldType;

export class TimeField extends StringField {
   constructor(name: string) {
    super(name);
    this.type = "string";
    this.format = "time"
  }
}
