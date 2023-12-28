import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { convertToSlug } from 'app/lib/common';
import { actionCUPermission } from 'redux/manage/action';
import { message } from 'antd';
import { useDispatch } from 'react-redux';

const DialogTitleRoot = styled(MuiDialogTitle)(({ theme }) => ({
    margin: 0,
    padding: theme.spacing(2),
    '& .closeButton': {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const DialogTitle = (props) => {
    const { children, onClose } = props;
    return (
        <DialogTitleRoot disableTypography>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className="closeButton" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitleRoot>
    );
};

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

function DialogCUPost({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})

    useEffect(() => {
        if (record) {
            setDataSubmit({
                ...dataSubmit,
                name: record.name,
                slug: record.slug
            })
        }
    }, [])

    const handleChange = (event) => {
        event.persist();
        if (record && record.id) {
            setDataSubmit({
                ...dataSubmit,
                id: record.id,
                name: event.target.value,
                slug: convertToSlug(event.target.value)
            })
        } else {
            setDataSubmit({
                ...dataSubmit,
                name: event.target.value,
                slug: convertToSlug(event.target.value)
            });
        }
    };

    const handleSubmit = () => {
        let messageSuccess = "Thêm mới thành công!"

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
        }

        dispatch(actionCUPermission(dataSubmit));
        handleClose();
        return message.success(messageSuccess);
    };

    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title" onClose={handleClose}>
                    {record && record.id ? "Cập nhật" : "Thêm mới"}
                </DialogTitle>

                <ValidatorForm onSubmit={handleSubmit} >
                    <DialogContent dividers >
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
                                    style={{ width: '100%' }}
                                />

                                <TextField
                                    type="text"
                                    name="slug"
                                    label="Slug"
                                    disabled={true}
                                    value={dataSubmit.slug || ""}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button color="primary" variant='outlined' type="submit">
                            Ok
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </Box>
    );
}

export default React.memo(DialogCUPost); // DialogCUPost
