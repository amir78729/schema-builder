import {Box, Button, Dialog, FormControl, InputLabel, MenuItem, Stack, TextField,} from "@mui/material";
import Form from "@rjsf/mui";

import validator from "@rjsf/validator-ajv8";
import React from "react";
import {useSchema} from "../providers/SchemaProvider";
import {JsonSchemaType} from "../types";
import {JsonSchemaField} from "../fields/JsonSchemaField";
import Select from "@mui/material/Select";

const AddFieldModal = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [name, setName] = React.useState<string | null>(null);
    const [type, setType] = React.useState<JsonSchemaType | null>(null);
    const [field, setField] = React.useState<null | JsonSchemaField>(null);
    const {dispatch, fields} = useSchema();
    const [step, setStep] = React.useState<number>(0);

    const SelectedFieldClass = fields.find(f => f.id === type)?.Class

    const handleSelectType = () => {
        if (name && type && SelectedFieldClass) {
            setField(new SelectedFieldClass(name))
            setStep(1);
        }
    }


    const handleSubmit = (formData) => {
        if (field) {
            field.setSchema(formData);
            dispatch({
                type: "ADD_PROPERTY",
                payload: {
                    name: field.getName() || 'newField',
                    schema: field.getSchema(),
                },
            });
            if (field.getIsRequired()) {
                dispatch({
                    type: "ADD_REQUIRED",
                    payload: {
                        name: field.getName() || 'newField',
                    },
                })
            }
            setOpen(false);
            setType(null);
            setName(null);
            setStep(0);
        }
    }


    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Property</Button>
            <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
                <Box p={3} key={JSON.stringify(fields)}>
                    <h1>{step !== 0 && <Button onClick={() => setStep(0)}>back</Button>}Adding Field</h1>
                    {step === 0 && (
                        <Stack gap={3}>
                            <TextField label="Field Name" value={name} onChange={(e) => setName(e.target.value)}/>

                            <FormControl>
                                <InputLabel htmlFor="field-type">Field Type</InputLabel>
                                <Select defaultValue="" value={type} id="field-type" label="Field Type"
                                        onChange={(e) => setType(e.target.value as JsonSchemaType)}>
                                    {fields.map((property) => (
                                        <MenuItem title={property.description} key={property.id}
                                                  value={property.id}>{property.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button disabled={!name || !type} variant="contained"
                                    onClick={() => handleSelectType()}>Continue</Button>
                        </Stack>
                    )}
                    {step === 1 && (
                        <>
                            <p>Please complete the info for the <code>name</code> field</p>
                            {field && (
                                <Form formData={field.getSchema()} schema={field.getBuilderSchema()}
                                      validator={validator}
                                      onSubmit={({formData}) => handleSubmit(formData)}/>
                            )}
                        </>
                    )}
                </Box>
            </Dialog>
        </>
    );
};

export default AddFieldModal;