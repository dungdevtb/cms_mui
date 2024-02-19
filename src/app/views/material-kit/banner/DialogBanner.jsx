import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
    InputLabel,
    MenuItem, Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { actionCUBanner } from 'redux/order-voucher/action';
import { actionUploadOneFile } from 'redux/upload/action';

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

function DialogCUBanner({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})

    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/upload.png'
    );

    const arrType = [
        { value: 1, label: 'Main Banner' },
        { value: 2, label: 'Sub Banner' },
    ]

    useEffect(() => {
        if (record && record?.id) {
            setDataSubmit({
                ...dataSubmit,
                title: record.title,
                description: record.description,
                type: record.type,
            })

            setOldFileUpload(record?.image)
        }
    }, [])

    const handleChange = (event) => {
        const { name, value, } = event.target;

        if (record && record?.id) {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                id: record?.id,
                [name]: value,
            }));
        } else {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                [name]: value,
            }));
        }
    };

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
        }

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
        }

        dispatch(actionCUBanner(dataPayload));
        handleClose();
        return message.success(messageSuccess);
    };

    const uploadProps = {
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
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-label">Hình ảnh banner</InputLabel>
                                <Upload {...uploadProps}>
                                    <img
                                        src={fileUpload?.newImg || oldFileUpload}
                                        alt="img"
                                        className="rad--4"
                                        style={{ objectFit: 'cover', width: '150px', height: '100px' }}
                                    />
                                </Upload>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <InputLabel id="demo-simple-select-label">Loại banner</InputLabel>
                                <Select
                                    name="type"
                                    labelId="demo-simple-select-label"
                                    onChange={handleChange}
                                    value={dataSubmit?.type || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập nhãn hàng!"]}
                                    style={{ width: '100%', marginBottom: 16 }}
                                    size="small"
                                >
                                    {arrType?.map((item, index) => (
                                        <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="title"
                                    label="Tiêu đề banner"
                                    onChange={handleChange}
                                    value={dataSubmit.title || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tiêu đề banner!"]}
                                    style={{ width: '100%' }}
                                />

                                <TextField
                                    type="text"
                                    name="description"
                                    label="Mô tả"
                                    onChange={handleChange}
                                    value={dataSubmit.description || ""}
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

export default React.memo(DialogCUBanner);
