import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent, DialogTitle,
    styled, Grid,
    InputLabel
} from '@mui/material';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { convertToSlug } from 'app/lib/common';
import { actionCURole } from 'redux/manage/action';
import { Input, message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { actionUploadOneFile } from 'redux/upload/action';


const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

function DialogCUProduct({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})
    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/imageDefault.png'
    );

    const [colors, setColors] = useState([])

    const [sizes, setSizes] = useState([])

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

    const handleSubmit = async () => {
        let messageSuccess = "Thêm mới thành công!"

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
        }

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
            avatar: fileUpload ? image : oldFileUpload,
        }

        dispatch(actionCURole(dataSubmit));
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

    const beforeUpload = (file, fileList, index, key) => {
        if (
            file.type !== "image/png" &&
            file.type !== "image/jpeg" &&
            file.type !== "image/webp" &&
            file.type !== "image/svg+xml"
        ) {
            message.error(`${file.name} is not a image file`);
            setTimeout(() => {
                message.destroy();
            }, 2000);
            return;
        } else {
            if (file.size > 10000000) {
                message.error("File size > 1 MB!");
                setTimeout(() => {
                    message.destroy();
                }, 2000);
                return;
            }
            file.newImg = URL.createObjectURL(file);
            if (key === "color") {
                let new_array_sub = [...colors];
                new_array_sub[index].image = file;
                setColors(new_array_sub);
            }
        }
        return false;
    };

    const handleChangeAttributes = (event, index, key) => {
        if (key === "color") {
            let new_array = [...colors];
            new_array[index].name = event;
            setColors(new_array);
        }
        if (key === "size") {
            let new_array = [...sizes];
            console.log(event, 'event', new_array[index]);
            new_array[index].size = event;
            setSizes(new_array);
        }
    }

    const handleAddColor = () => {
        let new_arr_sub = [...colors];
        let object_sub = {}
        new_arr_sub.push(object_sub)
        setColors(new_arr_sub)
    }

    const handleDeleteColor = (index) => {
        let new_arr_sub = colors.filter((item, i) => i !== index)
        setColors(new_arr_sub)
    }

    const handleAddSize = () => {
        let new_arr_sub = [...sizes];
        let object_sub = {}
        new_arr_sub.push(object_sub)
        setSizes(new_arr_sub)
    }

    const handleDeleteSize = (index) => {
        let new_arr_sub = sizes.filter((item, i) => i !== index)
        setSizes(new_arr_sub)
    }

    console.log(colors, 'colors');

    return (
        <Box>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='md'>
                <DialogTitle id="form-dialog-title">
                    {record && record.id ? "Cập nhật" : "Thêm mới"}
                </DialogTitle>

                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-label">Ảnh đại diện</InputLabel>
                                <Upload {...uploadProps}>
                                    <img
                                        src={fileUpload?.newImg || oldFileUpload}
                                        alt="img"
                                        className="rad--4"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }}
                                    />
                                </Upload>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Tên sản phẩm"
                                    onChange={handleChange}
                                    value={dataSubmit.name || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập tên sản phẩm!"]}
                                    size="small"
                                />

                                <TextField
                                    type="text"
                                    name="slug"
                                    label="Slug"
                                    disabled={true}
                                    value={dataSubmit.slug || ""}
                                    size="small"

                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <InputLabel id="demo-simple-label">Màu sắc :</InputLabel>
                                {colors.map((val, index) => (
                                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, ml: 8 }}>
                                        <Box key={index} display={'flex'} width={'100%'} >
                                            <Grid item xs={2} sm={2} md={2} >
                                                <InputLabel id="demo-simple-label">Màu sắc {index + 1}:</InputLabel>
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={4}>
                                                <TextField
                                                    type="text"
                                                    label="Tên màu sắc"
                                                    value={val?.name || ""}
                                                    size="small"
                                                    onChange={(e) => handleChangeAttributes(e.target.value, index, "color")}
                                                />
                                            </Grid>
                                            <Grid item xs={2} sm={2} md={2} sx={{ ml: 2 }}>
                                                <Upload
                                                    accept={"image/png,image/jpeg,image/svg+xml,image/webp"}
                                                    beforeUpload={(file, fileList) =>
                                                        beforeUpload(file, fileList, index, "color")}
                                                >
                                                    <img
                                                        src={val?.image?.newImg || val?.image}
                                                        alt=""
                                                        className="rad--4"
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "80px",
                                                            height: "80px",
                                                        }}
                                                    />
                                                </Upload>
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={4} sx={{ ml: 2 }}>
                                                <span onClick={() => handleDeleteColor(index)}>X</span>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                ))}
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, ml: 8 }}>
                                    <span onClick={handleAddColor}> + Thêm màu sắc </span>
                                </Grid>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <InputLabel id="demo-simple-label">Kích cỡ :</InputLabel>
                                {sizes.map((val, index) => (
                                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, ml: 8 }}>
                                        <Box key={index} display={'flex'} width={'100%'} >
                                            <Grid item xs={1} sm={1} md={1} sx={{ mr: 2 }}>
                                                <InputLabel id="demo-simple-label">Size</InputLabel>
                                                <TextField
                                                    type="text"
                                                    value={val?.size || ""}
                                                    size="small"
                                                    onChange={(e) => handleChangeAttributes(e.target.value, index, "size")}
                                                />
                                            </Grid>
                                            <Grid item xs={7} sm={7} md={7} sx={{ mr: 2 }}>
                                                {colors?.map((valColor, indexColor) => (
                                                    <Box key={indexColor} display={'flex'} alignItems={'center'} width={'100%'} marginBottom={"15px"}>
                                                        <TextField
                                                            type="text"
                                                            label="Màu sắc"
                                                            value={valColor?.name || ""}
                                                            size="small"
                                                        />
                                                        <img
                                                            src={valColor?.image?.newImg || valColor?.image}
                                                            alt=""
                                                            className="rad--4"
                                                            style={{
                                                                objectFit: "cover",
                                                                width: "80px",
                                                                height: "80px",
                                                                marginLeft: 20,
                                                                marginRight: 20
                                                            }}
                                                        />
                                                        <TextField
                                                            type="number"
                                                            label="Số lượng"
                                                            value={valColor?.quantity || ""}
                                                            size="small"
                                                            onChange={(e) => handleChangeAttributes(e.target.value, index, "size")}
                                                        />
                                                    </Box>
                                                ))}
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={4} sx={{ ml: 2, mt: 2 }}>
                                                <span onClick={() => handleDeleteSize(index)}>X</span>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                ))}
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, ml: 8 }}>
                                    <span onClick={handleAddSize}> + Thêm kích cỡ và số lượng </span>
                                </Grid>
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

export default React.memo(DialogCUProduct); // DialogCUProduct
