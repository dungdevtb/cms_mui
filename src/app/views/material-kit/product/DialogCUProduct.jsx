/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent, DialogTitle,
    styled, Grid,
    InputLabel, Select,
    MenuItem, Switch,
    FormControlLabel
} from '@mui/material';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { message, Upload } from 'antd';
import { actionUploadOneFile } from 'redux/upload/action';
import { actionCUProduct } from 'redux/product/action';
import { useDispatch } from "react-redux";
import InputAdornment from '@mui/material/InputAdornment';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

function DialogCUProduct({ open, handleClose, record, dataBrand, dataCategory, dataProductType }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})
    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/upload.png'
    );
    const [status, setStatus] = useState(false);
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])

    useEffect(() => {
        if (record && record?.id) {
            setDataSubmit({
                ...dataSubmit,
                name: record?.name,
                description: record?.description,
                quantity: record?.quantity,
                import_price: record?.import_price,
                sell_price: record?.sell_price,
                category_id: record?.category?.id,
                brand_id: record?.brand?.id,
                product_type_id: record?.product_type?.id,
                display_order: record?.display_order,
                discount: record?.discount,
                discount_price: record?.discount_price,
                // status: record?.status === 1 ? true : false
            })

            let colorSize = record?.sizes[0].size_color.map(it => it.color)
            setColors(colorSize)
            setSizes(record?.sizes)
            setOldFileUpload(record?.image)
            setStatus(record?.status === 1 ? true : false)
            console.log(record, 'record');
        }
    }, [])

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        if (record && record?.id) {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                id: record?.id,
                [name]: value,
                // status: checked === true ? 1 : 0
            }));
        } else {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                [name]: value,
                // status: checked === true ? 1 : 0
            }));
        }
    };

    const handleSubmit = async () => {
        let messageSuccess = "Thêm mới thành công!"
        if (record && record?.id) {
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
            image: fileUpload ? image : oldFileUpload,
            // color: colors,
            size_quantity: sizes,
            quantity: handleTotalQuantity(),
            status: status === true ? 1 : 0
        }

        // let array_color = []
        // if (dataPayload?.color?.length) {
        //     array_color = dataPayload?.color?.map(async (item) => {
        //         if (typeof item.image === 'string') {
        //             return { ...item }
        //         } else {
        //             let newUploadFile = new FormData();
        //             newUploadFile.append('file', item.image);
        //             let image_color = await dispatch(actionUploadOneFile(newUploadFile));
        //             return { ...item, image: image_color }
        //         }
        //     })
        //     dataPayload.color = await Promise.all(array_color)
        // }

        let array_size_color = []
        if (dataPayload?.size_quantity?.length > 0) {
            await Promise.all(dataPayload?.size_quantity?.map(async (item) => {
                if (item.colors.length > 0) {
                    array_size_color = await Promise.all(item.colors?.map(async (item_color) => {
                        if (typeof item_color.image === 'string') {
                            return { ...item_color };
                        } else {
                            let newUploadFile = new FormData();
                            newUploadFile.append('file', item_color.image);
                            let image_color = await dispatch(actionUploadOneFile(newUploadFile));
                            return { ...item_color, image: image_color };
                        }
                    }));
                    item.colors = array_size_color;
                }
            }));
        }

        const res = await dispatch(actionCUProduct(dataPayload));
        if (res) {
            message.success(messageSuccess);
            handleClose();
        }
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
    }

    const handleChangeSize = (event, index, key, indexColor) => {
        if (key === "size") {
            let new_array = [...sizes];
            new_array[index].size = event;
            new_array[index].colors = colors
            setSizes(new_array);
        }
    }

    const handleChangeQuantity = (event, sizeIndex, colorIndex) => {
        const newSizes = sizes.map((size, i) => {
            if (i === sizeIndex) {
                const newColors = size.colors.map((color, j) => {
                    if (j === colorIndex) {
                        return {
                            ...color,
                            quantity: event
                        };
                    }
                    return color;
                });
                return {
                    ...size,
                    colors: newColors
                };
            }
            return size;
        });

        setSizes(newSizes);
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

    const handleTotalQuantity = (data = sizes) => {
        let totalQuantity = 0;

        data?.forEach((size) => {
            size.colors?.forEach((color) => {
                totalQuantity += parseInt(color.quantity, 10) || 0;
            });
        });

        return totalQuantity;
    };

    const handleSwitch = (e) => {
        setStatus(e.target.checked);
    }


    return (
        <Box>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='md'>
                <DialogTitle id="form-dialog-title">
                    {record && record?.id ? "Cập nhật" : "Thêm mới"}
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
                                    value={dataSubmit?.name || ""}
                                    // validators={["required"]}
                                    // errorMessages={["Vui lòng nhập tên sản phẩm!"]}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    type="text"
                                    name="import_price"
                                    label="Giá nhập"
                                    value={dataSubmit?.import_price || ""}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                                    }}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    type="text"
                                    name="sell_price"
                                    label="Giá bán"
                                    value={dataSubmit?.sell_price || ""}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                                    }}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    type="text"
                                    name="discount"
                                    label="Discount"
                                    value={dataSubmit?.discount || ""}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    type="text"
                                    name="discount_price"
                                    label="Giá giảm"
                                    value={dataSubmit?.discount_price || ""}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">vnd</InputAdornment>,
                                    }}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <InputLabel id="demo-simple-select-label">Nhãn hàng</InputLabel>
                                <Select
                                    name="brand_id"
                                    labelId="demo-simple-select-label"
                                    // label="Nhãn hàng"
                                    onChange={handleChange}
                                    value={dataSubmit?.brand_id || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập nhãn hàng!"]}
                                    style={{ width: '100%', marginBottom: 16 }}
                                    size="small"
                                >
                                    {dataBrand?.rows?.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                                <Select
                                    name="category_id"
                                    labelId="demo-simple-select-label"
                                    // label="Danh mục"
                                    onChange={handleChange}
                                    value={dataSubmit?.category_id || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập danh mục!"]}
                                    style={{ width: '100%', marginBottom: 16 }}
                                    size="small"
                                >
                                    {dataCategory?.rows?.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <InputLabel id="demo-simple-select-label">Loại sản phẩm</InputLabel>
                                <Select
                                    name="product_type_id"
                                    labelId="demo-simple-select-label"
                                    onChange={handleChange}
                                    value={dataSubmit?.product_type_id || ""}
                                    validators={["required"]}
                                    errorMessages={["Vui lòng nhập danh mục!"]}
                                    style={{ width: '100%', marginBottom: 16 }}
                                    size="small"
                                >
                                    {dataProductType?.rows?.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <InputLabel id="demo-simple-label">Màu sắc :</InputLabel>
                                {colors?.map((val, index) => (
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
                                {sizes?.map((val, index) => (
                                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, ml: 8 }}>
                                        <Box key={index} display={'flex'} width={'100%'} >
                                            <Grid item xs={1} sm={1} md={1} sx={{ mr: 2 }}>
                                                <InputLabel id="demo-simple-label">Size</InputLabel>
                                                <TextField
                                                    type="text"
                                                    value={val?.size || ""}
                                                    size="small"
                                                    onChange={(e) => handleChangeSize(e.target.value, index, "size")}
                                                />
                                            </Grid>
                                            <Grid item xs={7} sm={7} md={7} sx={{ mr: 2 }}>
                                                {(val?.colors || colors)?.map((valColor, indexColor) => (
                                                    <Box key={indexColor} display={'flex'} alignItems={'center'} width={'100%'} marginBottom={"15px"}>
                                                        <TextField
                                                            type="text"
                                                            label="Màu sắc"
                                                            // disabled={true}
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
                                                            onChange={(e) => handleChangeQuantity(e.target.value, index, indexColor)}
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
                                    <div style={{ marginTop: 20 }}>Tổng số lượng: {handleTotalQuantity() || record?.quantity} </div>
                                </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <TextField
                                    type="text"
                                    name="display_order"
                                    label="Thứ tự hiển thị"
                                    value={dataSubmit?.display_order || ""}
                                    size="small"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                <InputLabel id="demo-simple-switch-label">Trạng thái sản phẩm</InputLabel>
                                <FormControlLabel
                                    control={<Switch checked={status} onChange={handleSwitch} name='status' />}
                                    label={status ? "Công bố" : "Không công bố"}
                                    style={{ marginBottom: 12 }}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    type="text"
                                    name="description"
                                    label="Mô tả sản phẩm"
                                    value={dataSubmit?.description || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    multiLine={true}
                                    minRows={4}
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

export default React.memo(DialogCUProduct); // DialogCUProduct
