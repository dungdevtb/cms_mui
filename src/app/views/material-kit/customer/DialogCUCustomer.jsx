import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
    InputLabel, FormControlLabel,
    Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { actionUploadOneFile } from 'redux/upload/action';
import { actionCUCustomer } from 'redux/customer/action';

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

function DialogCUCustomer({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({
        username: '',
        email: '',
        address: '',
        mobile: '',
        role_id: 0,
        status: false
    })

    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/upload.png'
    );

    useEffect(() => {
        if (record && record.id) {
            setDataSubmit({
                ...dataSubmit,
                username: record.username,
                email: record.email,
                address: record.address,
                role_id: record?.user_role?.role?.id,
                mobile: record.mobile,
                status: record?.status === 1 ? true : false
            })
            if (record?.avatar) {
                setOldFileUpload(record?.avatar)
            } else {
                setOldFileUpload('/assets/images/upload.png')
            }
        }
    }, [])

    const handleChange = async (e) => {
        // e.persist();
        const { name, value, checked, type } = e.target;

        if (record && record.id) {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                id: record.id,
                [name]: value,
                status: checked === true ? 1 : 0
            }));
        } else {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                [name]: value,
                status: checked === true ? 1 : 0
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let messageSuccess = "Thêm mới thành công!"

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
        }

        if (!fileUpload && !oldFileUpload) {
            return message.error('Vui lòng tải ảnh!');
        }
        let avatar = '';
        if (fileUpload) {
            let newUploadFile = new FormData();
            newUploadFile.append('file', fileUpload);
            avatar = await dispatch(actionUploadOneFile(newUploadFile));
        }

        let dataPayload = {
            ...dataSubmit,
            avatar: fileUpload ? avatar : oldFileUpload,
        }

        await dispatch(actionCUCustomer(dataPayload));
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
                        <Grid container spacing={4}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-label">Ảnh đại diện</InputLabel>
                                <Upload
                                    {...uploadProps}
                                // onChange={handleChange}
                                // listType="picture-card"
                                >
                                    <img
                                        src={fileUpload?.newImg || oldFileUpload}
                                        alt=""
                                        className="rad--4"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }}
                                    />
                                    {/* {fileUpload || oldFileUpload ? (
                                        <img
                                            src={fileUpload?.newImg || oldFileUpload}
                                            alt="avatar"
                                            style={{
                                                width: '100%',
                                                marginBottom: 16
                                            }}
                                        />
                                    ) : (
                                        <div>
                                            {loading ? <CircularProgress /> : <AddIcon />}
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                    marginBottom: 16
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </div>
                                    )} */}
                                </Upload>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="text"
                                    name="username"
                                    label="Tên admin"
                                    value={dataSubmit.username || ""}
                                    onChange={handleChange}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tên admin!"]}
                                    fullWidth
                                />

                                <TextField
                                    type="password"
                                    name="password"
                                    label="Mật khẩu"
                                    onChange={handleChange}
                                    value={dataSubmit.password || ""}
                                    fullWidth
                                />

                                <TextField
                                    type="email"
                                    name="email"
                                    label="Email"
                                    onChange={handleChange}
                                    value={dataSubmit.email || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập email admin!"]}
                                    fullWidth
                                />

                                <TextField
                                    type="text"
                                    name="address"
                                    label="Địa chỉ"
                                    onChange={handleChange}
                                    value={dataSubmit.address || ""}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <InputLabel id="demo-simple-switch-label">Trạng thái người dùng</InputLabel>
                                <FormControlLabel
                                    control={<Switch checked={dataSubmit.status} onChange={handleChange} name='status' />}
                                    label={dataSubmit.status ? "Hoạt động" : "Không hoạt động"}
                                    style={{ marginBottom: 12 }}
                                />
                                <TextField
                                    type="number"
                                    name="mobile"
                                    label="Số điện thoại"
                                    onChange={handleChange}
                                    value={dataSubmit.mobile || ""}
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
        </Box >
    );
}

export default React.memo(DialogCUCustomer); // DialogCUCustomer
