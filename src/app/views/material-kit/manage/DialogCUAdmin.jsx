import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
    CircularProgress,
    Select, MenuItem,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { actionCUPermission } from 'redux/manage/action';

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

function DialogCUAdmin({ open, handleClose, record, dataRole }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})
    const [loading, setLoading] = useState(false);

    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        'https://api.hanagold.vn/uploads/1640839689807-defaultUpload.png'
    );

    useEffect(() => {
        if (record) {
            setDataSubmit({
                ...dataSubmit,
                name: record.username,
                email: record.email,
                address: record.address,
                role: record?.user_role?.role,
                mobile: record.mobile
            })
            setOldFileUpload(record?.avatar)
        }
    }, [])

    console.log(oldFileUpload);


    const handleChange = (event) => {
        event.persist();
        if (record && record.id) {
            setDataSubmit({
                ...dataSubmit,
                id: record.id,
                name: event.target.value,
            })
        } else {
            setDataSubmit({
                ...dataSubmit,
                name: event.target.value,
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
                        <Grid container spacing={6}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-label">Ảnh đại diện</InputLabel>

                                <Upload
                                    {...uploadProps}
                                    listType="picture-card"
                                >
                                    {/* <img
                                        src={fileUpload?.newImg || oldFileUpload}
                                        alt=""
                                        className="rad--4"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }}
                                    /> */}
                                    {fileUpload || oldFileUpload ? (
                                        <img
                                            src={fileUpload?.newImg || oldFileUpload}
                                            alt="avatar"
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                    ) : (
                                        <div>
                                            {loading ? <CircularProgress /> : <AddIcon />}
                                            <div
                                                style={{
                                                    marginTop: 8
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </div>
                                    )}
                                </Upload>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Tên admin"
                                    // placeholder='Tên admin'
                                    onChange={handleChange}
                                    value={dataSubmit.name || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tên admin!"]}
                                    style={{ width: '100%' }}
                                />

                                <TextField
                                    type="text"
                                    name="Email"
                                    label="Email"
                                    disabled={true}
                                    value={dataSubmit.email || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập email admin!"]}
                                    style={{ width: '100%' }}
                                />

                                <TextField
                                    type="text"
                                    name="address"
                                    label="Địa chỉ"
                                    disabled={true}
                                    value={dataSubmit.address || ""}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <InputLabel id="demo-simple-select-label">Vai trò</InputLabel>
                                <Select
                                    name="role"
                                    labelId="demo-simple-select-label"
                                    label="Vai trò"
                                    // onChange={handleChange}
                                    // value={dataSubmit.role || ""}
                                    value={"abcccccccccc"}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập vai trò admin!"]}
                                    style={{ width: '100%', marginBottom: 16 }}
                                >
                                    {dataRole?.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>

                                <TextField
                                    type="text"
                                    name="mobile"
                                    label="Số điện thoại"
                                    disabled={true}
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
        </Box>
    );
}

export default React.memo(DialogCUAdmin); // DialogCUAdmin
