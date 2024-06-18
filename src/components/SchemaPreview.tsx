import React, {useState} from "react";
import {RJSFSchema} from "@rjsf/utils";
import AddFieldModal from "./AddFieldModal";
import Numbers from '@mui/icons-material/Numbers';
import {
    Add,
    DataArray,
    DataObject,
    Delete,
    Edit,
    ExpandLess,
    ExpandMore,
    TextSnippet,
    ToggleOn
} from "@mui/icons-material";
import {
    Box, Button, Card, Chip,
    Collapse,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import {getFieldId, getSchemaFormatFromSchema} from "../utils";
import {DataVisualizationType} from "../types";
import {SchemaAction, useSchema} from "../providers/SchemaProvider";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

type Props = {
    schema: RJSFSchema;
    data: unknown;
    name: string;
}


// TODO: refactor
const renderHeader = ({icon, schema, onDelete, name}: {
    icon?: React.ReactNode,
    schema: RJSFSchema,
    name: string,
    onDelete?: () => void,
    collapse?: boolean;
    onCollapse?: () => void
}) => {
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const {fields, dispatch} = useSchema();
    const SelectedFieldClass = fields.find(field => field.id === getFieldId(schema))?.Class
    console.log('🐕 sag selectedField', SelectedFieldClass); // TODO: REMOVE ME ⚠️

    let field;
    if (SelectedFieldClass) {
        field = new SelectedFieldClass(name)
    }
    return (
        <>
            <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
                <DialogTitle>Edit <code>{name}</code> Field</DialogTitle>
                <DialogContent>
                    <Form onSubmit={({formData}) => {
                        dispatch({type: "UPDATE_PROPERTY", payload: {name, schema: formData}})
                        setShowEditModal(false);
                    }} schema={field?.getBuilderSchema()} formData={schema} validator={validator}/>
                </DialogContent>
            </Dialog>
            <Dialog open={showDeleteConfirmationModal} onClose={() => setShowDeleteConfirmationModal(false)}>
                <DialogContent><Typography>Are you sure you want to delete this field?</Typography></DialogContent>
                <DialogActions>
                    <Button fullWidth color="error"
                            onClick={() => setShowDeleteConfirmationModal(false)}>Cancel</Button>
                    <Button fullWidth variant="contained" color="error" onClick={() => {
                        onDelete?.();
                        setShowDeleteConfirmationModal(false)
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
            <ListItem>
                <ListItemText
                    primary={(
                        <>
                            <Typography variant="h6">{schema?.title} <Chip
                                size="small"
                                color="primary"
                                variant="outlined"
                                icon={icon}
                                label={`${schema?.type}${schema?.format ? `: ${schema?.format}` : ''}`}
                            />
                            </Typography>
                            {schema?.description && (
                                <Typography variant="caption">{schema?.description}</Typography>
                            )}
                        </>
                    )}
                />
                {onDelete && <IconButton color="error" onClick={() => setShowDeleteConfirmationModal(true)}><Delete
                    fontSize="small"/></IconButton>}
                <IconButton
                    color="warning"
                    onClick={() => setShowEditModal(true)}
                >
                    <Edit fontSize="small"/>
                </IconButton>

            </ListItem>
        </>
    )
}

const handleDelete = (dispatch: React.Dispatch<SchemaAction>, name: string) => {
    dispatch({type: "DELETE_PROPERTY", payload: {name}});
    dispatch({type: "DELETE_REQUIRED", payload: {name}});
}

const handleEdit = (dispatch: React.Dispatch<SchemaAction>, name: string, schema: RJSFSchema) => {
    dispatch({type: "UPDATE_PROPERTY", payload: {name, schema}});
}

const SchemaPreview = ({schema, data, name}: Props) => {
    const FormPreview = getSchemaFormatFromSchema(schema, SchemaPreview)
    return (
        <div>
            <FormPreview {...{schema, data, name}} />
        </div>
    )
};

SchemaPreview.String = function String({schema, data, name}: DataVisualizationType) {
    const {dispatch} = useSchema();
    return (
        <div>
            {renderHeader({name, schema, icon: <TextSnippet/>, onDelete: () => handleDelete(dispatch, name)})}
        </div>
    );
};

SchemaPreview.Number = function Number({schema, name}: DataVisualizationType) {
    const {dispatch} = useSchema();
    return (
        <div>
            {renderHeader({name, schema, icon: <Numbers/>, onDelete: () => handleDelete(dispatch, name)})}
        </div>
    );
};

SchemaPreview.Boolean = function BooleanVisualization({schema, name}: DataVisualizationType) {
    const {dispatch} = useSchema();
    return (
        <div>
            {renderHeader({name, schema, icon: <ToggleOn/>, onDelete: () => handleDelete(dispatch, name)})}
        </div>
    );
};

SchemaPreview.Object = function ObjectVisualization({schema, data, name}: DataVisualizationType) {
    const {dispatch} = useSchema();
    const properties = Object.keys(schema?.properties || {})

    const [open, setOpen] = React.useState(true);

    const handleCollapse = () => {
        setOpen(!open);
    };

    return (
        <Card sx={{p: 2, m: 2}}>
            {renderHeader({
                name,
                schema,
                icon: <DataObject/>,
                collapse: open,
                onCollapse: handleCollapse,
                onDelete: () => handleDelete(dispatch, name)
            })}
            <Card sx={{p: 2, m: 2}}>
                <Box
                    px={2} display="flex" justifyContent="space-between">
                    <Typography flex={1}>Properties</Typography>
                    <AddFieldModal/>
                    {open !== undefined &&
                        <IconButton onClick={handleCollapse}>{!open ? <ExpandMore fontSize="small"/> :
                            <ExpandLess fontSize="small"/>}</IconButton>}
                </Box>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {properties?.length > 0 ? properties?.map((property) => (
                        <SchemaPreview
                            name={property}
                            schema={schema.properties[property]}
                        />
                    )) : (
                        <Typography alignItems="center" textAlign="center" p={3}>
                            Click on <Add fontSize="small"/> button to add properties
                        </Typography>
                    )}
                </Collapse>
            </Card>
        </Card>
    );
};

SchemaPreview.Array = function ArrayVisualization({schema, data, name}: DataVisualizationType) {
    const {dispatch} = useSchema();
    return (
        <>
            <Card sx={{p: 2, m: 2}}>
            {renderHeader({name, schema, icon: <DataArray/>, onDelete: () => handleDelete(dispatch, name)})}
                <SchemaPreview
                    {...{schema: schema.items, name}}
                />
            </Card>
        </>
    );
};

SchemaPreview.Unknown = function ArrayVisualization() {
    return <></>;
};

export default SchemaPreview;
