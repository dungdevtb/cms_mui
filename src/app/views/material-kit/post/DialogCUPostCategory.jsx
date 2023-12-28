import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
    InputLabel, Switch,
    FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { convertToSlug } from 'app/lib/common';
import { message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { actionUploadOneFile } from 'redux/upload/action';
import { actionCUPostCategory } from 'redux/post/action';

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

function DialogCUPostCategory({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})

    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/upload.png'
    );
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (record && record.id) {
            setDataSubmit({
                ...dataSubmit,
                name: record.name,
                url: record.url,
                description: record.description
            })

            setStatus(record.status === 1 ? true : false)
            setOldFileUpload(record.image)
        }
    }, [])

    const handleChange = (event) => {
        setDataSubmit({
            ...dataSubmit,
            name: event.target.value,
            url: convertToSlug(event.target.value)
        });
    };

    const handleChangDes = (event) => {
        setDataSubmit({
            ...dataSubmit,
            description: event.target.value
        })
    }

    const handleSwitch = (event) => {
        setStatus(event.target.checked);
    }

    const handleSubmit = async () => {
        let messageSuccess = "Thêm mới thành công!"

        if (!fileUpload && !oldFileUpload) {
            return message.error('Vui lòng tải ảnh!');
        }

        let image = '';
        if (fileUpload) {
            let newUploadFile = new FormData();
            newUploadFile.append('file', fileUpload);
            image = await dispatch(actionUploadOneFile(newUploadFile));
        }

        let dataPayload = {
            ...dataSubmit,
            image: fileUpload ? image : oldFileUpload,
            status: status === true ? 1 : 0
        }

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
            dataPayload = {
                ...dataPayload,
                id: record.id
            }
        }

        dispatch(actionCUPostCategory(dataPayload));
        handleClose();
        return message.success(messageSuccess);
    };

    const uploadProps = {
        // multiple: true,
        accept: 'image/png,image/jpeg,image/svg+xml,image/webp',
        beforeUpload: (file, fileList) => {
            if (
                file.type !== 'image/png' &&
                file.type !== 'image/jpeg' &&
                file.type !== 'image/svg+xml' &&
                file.type !== 'image/webp'
            ) {
                message.error(`${file.name} is not a image file`);
                setTimeout(() => {
                    message.destroy();
                }, 2000);
                return;
            } else {
                if (file.size > 10000000) {
                    message.error('File size > 1 MB!');
                    setTimeout(() => {
                        message.destroy();
                    }, 2000);
                    return;
                }
                file.newImg = URL.createObjectURL(file);
                setFileUpload(file);
            }
            return false;
        }
    };

    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title" onClose={handleClose}>
                    {record && record.id ? "Cập nhật" : "Thêm mới"}
                </DialogTitle>

                <ValidatorForm onSubmit={handleSubmit} >
                    <DialogContent dividers >
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel id="demo-simple-label">Hình ảnh</InputLabel>
                                <Upload {...uploadProps}>
                                    <img
                                        src={fileUpload?.newImg || oldFileUpload}
                                        alt="img"
                                        className="rad--4"
                                        style={{ objectFit: 'cover', width: '150px', height: '100px' }}
                                    />
                                </Upload>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Tên danh mục"
                                    onChange={handleChange}
                                    value={dataSubmit.name || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tên danh mục!"]}
                                    style={{ width: '100%' }}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    type="text"
                                    name="url"
                                    label="Đường dẫn"
                                    disabled={true}
                                    value={dataSubmit.url || ""}
                                    style={{ width: '100%' }}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    type="text"
                                    name="description"
                                    label="Mô tả"
                                    onChange={handleChangDes}
                                    value={dataSubmit.description || ""}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <InputLabel id="demo-simple-switch-label">Trạng thái danh mục</InputLabel>
                                <FormControlLabel
                                    control={<Switch checked={status} onChange={handleSwitch} name='status' />}
                                    label={status ? "Công bố" : "Ẩn"}
                                    style={{ marginBottom: 12 }}
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

export default React.memo(DialogCUPostCategory); // DialogCUPostCategory
