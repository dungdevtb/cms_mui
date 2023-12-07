import { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent, DialogTitle,
    DialogContentText,
    styled, Grid
    // TextField
} from '@mui/material';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { convertToSlug } from 'app/lib/common';
import { actionCUPermission } from 'redux/manage/action';
import { message } from 'antd';
import { useDispatch } from 'react-redux';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

export default function DialogCUPermission({ open, handleClose }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})
    const handleChange = (event) => {
        event.persist();
        setDataSubmit({
            ...dataSubmit,
            name: event.target.value,
            slug: convertToSlug(event.target.value)
        });
    };
    const handleSubmit = () => {
        let messageSuccess = "Thêm mới thành công!"
        console.log(dataSubmit);

        dispatch(actionCUPermission(dataSubmit));

        handleClose();
        return message.success(messageSuccess);
    };

    return (
        <Box>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
                <DialogTitle id="form-dialog-title">Thêm mới</DialogTitle>

                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
                        </DialogContentText>
                        <Grid container spacing={6}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Tên quyền"
                                    onChange={handleChange}
                                    value={dataSubmit.name || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tên quyền!"]}
                                />

                                <TextField
                                    type="text"
                                    name="slug"
                                    label="Slug"
                                    disabled={true}
                                    value={dataSubmit.slug || ""}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button color="primary" variant='outlined' type="submit">
                            Subscribe
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </Box>
    );
}
