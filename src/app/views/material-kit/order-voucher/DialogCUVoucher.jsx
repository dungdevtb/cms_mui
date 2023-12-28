import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    styled, Grid,
    Typography, IconButton,
    InputLabel,
    Select, Switch,
    FormControlLabel, MenuItem,
    OutlinedInput, Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { createReactEditorJS } from 'react-editor-js';
import { message, DatePicker, Upload, Form } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { actionGetListCategory, actionGetListProduct } from 'redux/product/action';
import { actionUploadOneFile } from 'redux/upload/action';
import { actionCUVoucher } from 'redux/order-voucher/action';
import { jsonToHtml } from 'app/lib/common';

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

const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) { result.push(i); }
    return result;
};

const EDITOR_JS_TOOLS_TEXT = {
    paragraph: {
        inlineToolbar: false
    },
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const formRef = React.createRef()

function DialogCUVoucher({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const [dataSubmit, setDataSubmit] = useState({})
    let date = moment("2000-01-01T00:00:00.000Z").format("DD/MM/YYYY HH:mm:ss")
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const editorCore = useRef(null);

    const theme = useTheme();
    const [products, setProducts] = useState([])
    const [fileUpload, setFileUpload] = useState(null);
    const [oldFileUpload, setOldFileUpload] = useState(
        '/assets/images/upload.png'
    );

    const { dataProduct, dataCategory, infoUser } = useSelector(
        (state) => ({
            dataProduct: state.productReducer.dataProduct,
            dataCategory: state.productReducer.dataCategory,
            infoUser: state.homeReducer.infoUser,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (record && record?.id) {
            setDataSubmit({
                ...dataSubmit,
                name: record.name,
                code: record.code,
                type_voucher: record.type_voucher,
                status: record.status === 1 ? true : false,
                type: record.type,
                percent: record.percent,
                max_money: record.max_money,
                total: record.total,
                used: record.used,
                all: record.all,
            })

            setOldFileUpload(record?.image)
            setMaxDate(moment(record?.exp).format("DD/MM/YYYY HH:mm:ss"))
            setMinDate(moment(record?.start).format("DD/MM/YYYY HH:mm:ss"))

            let productVoucher = record.voucher_product.map(item => item.product)
            setProducts(productVoucher)

            // formRef?.current?.setFieldsValue({
            //     start: moment(record.start),
            //     exp: moment(record.exp),
            // })

            console.log(record, 'record');
        }
    }, [])

    useEffect(() => {
        dispatch(actionGetListCategory());
        dispatch(actionGetListProduct());
    }, [dispatch])

    const ReactEditorJS = createReactEditorJS()
    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance
    }, [])

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        if (record && record?.id) {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                id: record?.id,
                [name]: value,
                status: checked === true ? 1 : 0,
            }));
        } else {
            setDataSubmit((prevData) => ({
                ...prevData,
                // [name]: type === 'checkbox' ? checked : value
                [name]: value,
                status: checked === true ? 1 : 0,
            }));
        }
    };

    const handleSubmit = async () => {
        let messageSuccess = "Thêm mới thành công!"

        const content = await editorCore.current.save()
        const html = jsonToHtml(content).trim()

        if (!fileUpload && !oldFileUpload) {
            return message.error('Vui lòng tải ảnh!');
        }

        let image = '';
        if (fileUpload) {
            let newUploadFile = new FormData();
            newUploadFile.append('file', fileUpload);
            image = await dispatch(actionUploadOneFile(newUploadFile));
        }

        let productVoucher = dataSubmit.all === 1 ? dataProduct.rows : products

        let dataPayload = {
            ...dataSubmit,
            html,
            html_obj: content,
            image: fileUpload ? image : oldFileUpload,
            start: moment(minDate),
            exp: moment(maxDate),
            user_id_created: infoUser?.id,
            products: productVoucher
        }

        if (record && record.id) {
            messageSuccess = "Cập nhật thành công!"
        }

        console.log(dataPayload);
        dispatch(actionCUVoucher(dataPayload));
        handleClose();
        return message.success(messageSuccess);
    };


    const disableTimeEnd = (current) => {
        if (current && current < moment(minDate, "DD/MM/YYYY HH:mm:ss")) {
            return ({
                disabledHours: () => range(0, (moment(minDate, 'DD/MM/YYYY HH:mm:ss').hour())),
                disabledMinutes: () => range(0, (moment(minDate, 'DD/MM/YYYY HH:mm:ss').minute())),
                disabledSeconds: () => range(0, (moment(minDate, 'DD/MM/YYYY HH:mm:ss').second())),
            })
        }
    }
    const disableTimeStart = (current) => {
        if (current && current.valueOf() > moment(maxDate, 'DD/MM/YYYY HH:mm:ss')) {
            return ({
                disabledHours: () => range((moment(maxDate, 'DD/MM/YYYY HH:mm:ss').hour()), 24),
                disabledMinutes: () => range((moment(maxDate, 'DD/MM/YYYY HH:mm:ss').minute()), 59),
                disabledSeconds: () => range((moment(maxDate, 'DD/MM/YYYY HH:mm:ss').second()), 59),
            })
        }
    }

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

    const handleChangeProduct = (event) => {
        const { target: { value } } = event
        setProducts(
            typeof value === 'string' ? value.split(',') : value,
        )
    }

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
                                {/* <FormControl fullWidth> */}
                                <InputLabel id="select-label">Loại voucher</InputLabel>
                                <Select
                                    name="type_voucher"
                                    labelId="select-label"
                                    // label="Loại voucher"
                                    onChange={handleChange}
                                    value={dataSubmit.type_voucher || ""}
                                    // validators={["required"]}
                                    // errorMessages={["Vui lòng nhập loại voucher!"]}
                                    style={{ width: '100%' }}
                                    size="small"
                                >
                                    <MenuItem value={1}>Voucher cho đơn hàng</MenuItem>
                                    <MenuItem value={2}>Voucher cho sản phẩm</MenuItem>
                                </Select>
                                {/* </FormControl> */}
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
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
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="text"
                                    name="name"
                                    label="Tên voucher"
                                    onChange={handleChange}
                                    value={dataSubmit.name || ""}
                                    // validators={["required"]}
                                    // errorMessages={["Vui lòng nhập tên voucher!"]}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="text"
                                    name="code"
                                    label="Mã voucher"
                                    onChange={handleChange}
                                    value={dataSubmit.code || ""}
                                    // validators={["required"]}
                                    // errorMessages={["Vui lòng nhập mã voucher!"]}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <InputLabel id="select-label">Loại giảm giá</InputLabel>
                                <Select
                                    name="type"
                                    labelId="select-label"
                                    // label="Loại voucher"
                                    onChange={handleChange}
                                    value={dataSubmit.type || ""}
                                    // validators={["required"]}
                                    errorMessages={["Vui lòng nhập loại giảm giá!"]}
                                    style={{ width: '100%' }}
                                    size="small"
                                >
                                    <MenuItem value={'percent'}>Giảm theo phần trăm</MenuItem>
                                    <MenuItem value={'money'}>Giảm theo số tiền</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                {dataSubmit.type === 'percent' ?
                                    <TextField
                                        type="number"
                                        name="percent"
                                        label="Giảm %"
                                        size="small"
                                        onChange={handleChange}
                                        value={dataSubmit.percent || ""}
                                        style={{ width: '100%' }}
                                    /> :
                                    <TextField
                                        type="number"
                                        name="max_money"
                                        label="Giảm $"
                                        size="small"
                                        onChange={handleChange}
                                        value={dataSubmit.max_money || ""}
                                        style={{ width: '100%' }}
                                    />}
                            </Grid>
                            <Form ref={formRef}>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <InputLabel id="date_start_label">Ngày bắt đầu</InputLabel>
                                    <Form.Item name="start">
                                        <DatePicker
                                            id='date_start_label'
                                            name='start'
                                            format="DD/MM/YYYY HH:mm:ss"
                                            // placeholder='Chọn ngày bắt đầu ...'
                                            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                                            // disabledTime={disableTimeStart}
                                            style={{ width: '100%' }}
                                            onChange={(date) => setMinDate(date)}
                                        // disabledDate={(current) => {
                                        //     return current && current > moment(maxDate, "DD/MM/YYYY HH:mm:ss");
                                        // }}
                                        // value={moment(minDate, "DD/MM/YYYY HH:mm:ss")}
                                        />
                                    </Form.Item>
                                    {/* <DatePicker
                                    id='date_start_label'
                                    name='start'
                                    format="DD/MM/YYYY HH:mm:ss"
                                    // placeholder='Chọn ngày bắt đầu ...'
                                    showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                                    // disabledTime={disableTimeStart}
                                    style={{ width: '100%' }}
                                    onChange={(date) => setMinDate(date)}
                                // disabledDate={(current) => {
                                //     return current && current > moment(maxDate, "DD/MM/YYYY HH:mm:ss");
                                // }}
                                // value={moment(minDate, "DD/MM/YYYY HH:mm:ss")}
                                /> */}
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <InputLabel id="date_end_label">Hạn sử dụng</InputLabel>
                                    <Form.Item name="exp">
                                        <DatePicker
                                            id='date_end_label'
                                            name='exp'
                                            format="DD/MM/YYYY HH:mm:ss"
                                            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                                            disabledTime={disableTimeEnd}
                                            style={{ width: '100%' }}
                                            onChange={(date) => setMaxDate(date)}
                                            // placeholder='Chọn hạn sử dụng ...'
                                            disabledDate={(current) => {
                                                return current && current > moment(maxDate, "DD/MM/YYYY HH:mm:ss");
                                            }}
                                        // value={moment(maxDate, "DD/MM/YYYY HH:mm:ss")}
                                        />
                                    </Form.Item>
                                </Grid>
                            </Form>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="number"
                                    name="total"
                                    label="Tổng số lượt sử dụng"
                                    onChange={handleChange}
                                    value={dataSubmit.total || ""}
                                    // validators={["required"]}
                                    // errorMessages={["Vui lòng nhập tổng số lượt sử dụng!"]}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <TextField
                                    type="number"
                                    name="used"
                                    label="Số lần đã sử dụng"
                                    onChange={handleChange}
                                    disabled
                                    value={dataSubmit.used || ""}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </Grid>
                            {dataSubmit.type_voucher === 2 &&
                                <>
                                    <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <InputLabel id="select-label">Chọn sản phẩm áp dụng</InputLabel>
                                        <Select
                                            name="all"
                                            labelId="select-label"
                                            onChange={handleChange}
                                            value={dataSubmit.all || ""}
                                            errorMessages={["Vui lòng nhập loại giảm giá!"]}
                                            style={{ width: '100%' }}
                                            size="small"
                                            defaultValue={1}
                                        >
                                            <MenuItem value={1}>Tất cả</MenuItem>
                                            <MenuItem value={2}>Danh mục</MenuItem>
                                            <MenuItem value={3}>Danh sách sản phẩm</MenuItem>
                                        </Select>
                                    </Grid>

                                    {dataSubmit.all === 2 && <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <InputLabel id="select-label">Danh mục sản phẩm</InputLabel>
                                        <Select
                                            name="category"
                                            labelId="select-label"
                                            onChange={handleChange}
                                            value={dataSubmit.category || ""}
                                            errorMessages={["Vui lòng nhập loại giảm giá!"]}
                                            style={{ width: '100%' }}
                                            size="small"
                                        >
                                            {dataCategory?.rows?.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>}

                                    {dataSubmit.all === 3 && <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <InputLabel id="select-label">Danh sách sản phẩm</InputLabel>
                                        <Select
                                            name="products"
                                            labelId="select-label"
                                            style={{ width: '100%' }}
                                            size="small"
                                            onChange={handleChangeProduct}
                                            value={products}
                                            multiple
                                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                            renderValue={(selected) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value.id} label={value.name} color="primary" variant="outlined" />
                                                ))}
                                            </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {dataProduct?.rows?.map((item, index) => (
                                                <MenuItem key={index} value={item} style={getStyles(item, products, theme)}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>}
                                </>
                            }

                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                <InputLabel id="demo-simple-switch-label">Trạng thái</InputLabel>
                                <FormControlLabel
                                    control={<Switch checked={dataSubmit.status} onChange={handleChange} name='status' />}
                                    label={dataSubmit.status ? "Hiển thị" : "Ẩn"}
                                    style={{ marginBottom: 12 }}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <InputLabel id="demo-simple-label">Nội dung voucher</InputLabel>
                                <ReactEditorJS
                                    show
                                    defaultValue={record && record.id ? record?.html_obj : {}}
                                    onInitialize={handleInitialize}
                                    tools={EDITOR_JS_TOOLS_TEXT}
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

export default React.memo(DialogCUVoucher); // DialogCUVoucher
