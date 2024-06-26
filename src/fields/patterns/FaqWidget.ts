import {StringField} from "../primitives/StringField";
import {ObjectField, ObjectFieldType} from "../containers/ObjectField";
import {produce} from "immer";
import {ArrayField} from "../containers/ArrayField";
import {JsonSchema} from "../../types";

export type FaqType = ObjectFieldType;

export class FaqWidget extends ArrayField {
    constructor(name: string) {
        super(name);
        this.title = "Frequently Asked Questions";
        this.setSchema({
            items: {
                // @ts-expect-error TODO: fix
                question: {
                    type: 'string',
                    title: 'FAQ Question',
                },
                answer: {
                    type: 'string',
                    title: 'FAQ Answer',
                }
            }
        })
    }

    getBuilderSchema(): JsonSchema {
        // TODO: fix
        return produce(super.getBuilderSchema(), (draft: JsonSchema) => {
            const items = new ObjectField('items');
            items.setSchema({
                properties: {
                    question: new StringField('question').getBuilderSchema(),
                    answers: new StringField('answers').getBuilderSchema(),
                }
            })
            if (draft?.items) draft.items = items.getBuilderSchema()
        })
    }

}
