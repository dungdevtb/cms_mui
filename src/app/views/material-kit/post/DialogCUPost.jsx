import React, { useState, useEffect, useRef, useCallback } from 'react';
import { convertToSlug, jsonToHtml } from 'app/lib/common';
import { message, Form, Input, DatePicker, Upload, Switch, Checkbox, Select, Modal } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { actionGetListPostCategory, actionGetListPostTag } from 'redux/post/action';
import moment from 'moment';
import { createReactEditorJS } from 'react-editor-js';
import { actionUploadOneFile } from 'redux/upload/action';
import { CaretDownOutlined, CloseOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { EDITOR_JS_TOOLS } from 'app/lib/tools';
import { Button, Grid } from '@mui/material';
import EditorTiny from 'app/lib/editorTiny/tinymce';
import { actionCUPost } from 'redux/post/action';

const formRef = React.createRef()
const { TextArea } = Input
function DialogCUPost({ open, handleClose, record }) {
    const dispatch = useDispatch()
    const editorCore = useRef(null)
    const [fileUpload, setFileUpload] = useState(null)
    const [oldFileUpload, setOldFileUpload] = useState('/assets/images/upload.png')
    const [status, setStatus] = useState(false)
    const [check_show_date, setShowDate] = useState(false)
    const [description, setDescription] = useState({})
    const [seo_status, setSEOStatus] = useState(false)
    const [hot, setHot] = useState(false)

    const [dataEditor, setDataEditor] = useState({})

    const { dataPostCategory, dataPostTag } = useSelector(state => ({
        dataPostCategory: state.postReducer.dataPostCategory,
        dataPostTag: state.postReducer.dataPostTag
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListPostTag())
        dispatch(actionGetListPostCategory())
        if (record && record.id) {
            const {
                title,
                category_id,
                seo_title,
                seo_description,
                seo_url,
                author,
                show_date,
                hot
            } = record
            formRef.current.setFieldsValue({
                title: title || '',
                category_id,
                seo_title: seo_title || '',
                seo_description: seo_description || '',
                seo_url: seo_url || '',
                author: author || '',
                show_date: show_date ? moment(show_date) : undefined
            })
            setOldFileUpload(record?.image)
            setStatus(record?.status === 1 ? true : false)
            setShowDate(moment(record?.show_date) ? true : false)
            setSEOStatus(record?.seo_title !== '' && record.seo_title ? true : false)
            setHot(hot === 1 ? true : false)
            setDataEditor(record?.html_content)
        }
    }, [dispatch, record])

    const uploadProps = {
        // multiple: true,
        accept: "image/png,image/jpeg,image/svg+xml,image/webp",
        beforeUpload: (file, fileList) => {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp' && file.type !== 'image/svg+xml') {
                message.error(`${file.name} is not a image file`);
                setTimeout(() => {
                    message.destroy()
                }, 2000);
                return;
            } else {
                if (file.size > 10000000) {
                    message.error("File size > 1 MB!")
                    setTimeout(() => {
                        message.destroy()
                    }, 2000);
                    return;
                }
                file.newImg = URL.createObjectURL(file)
                setFileUpload(file)
            }
            return false;
        }
    };

    const onSwitch = (value) => {
        setStatus(value)
    }

    const onShowDate = (value) => {
        setShowDate(value.target.checked)
        if (value.target.checked === false) {
            formRef.current.setFieldsValue({ show_date: undefined })
        }
    }

    const onSEO = (value) => {
        let { title } = formRef.current.getFieldsValue()
        setSEOStatus(value)
        if (value === true) {
            formRef.current.setFieldsValue({
                seo_url: convertToSlug(title)
            })
        } else {
            formRef.current.setFieldsValue({
                seo_title: '',
                seo_description: ''
            })
        }
    }

    const onHot = (value) => {
        setHot(value.target.checked)
    }

    const onChangTitle = (value) => {
        formRef.current.setFieldsValue({
            seo_url: convertToSlug(value.target.value)
        })
    }

    const onSubmitDelayed = _.debounce(() => onSubmit(), 100)
    const onSubmit = async () => {
        await formRef.current.validateFields();
        let {
            title, category_id, tag, seo_title,
            seo_description, seo_url, author, show_date
        } = formRef.current.getFieldsValue()

        if (!fileUpload && !oldFileUpload) {
            return message.error('Vui lòng tải ảnh!');
        }

        let image = ""
        if (fileUpload) {
            let newUploadFile = new FormData();
            newUploadFile.append('file', fileUpload);
            image = await dispatch(actionUploadOneFile(newUploadFile))
        }
        // const content = await editorCore.current.save()

        let dataPush = {
            title: title.trim(),
            category_id,
            tag,
            image: image || oldFileUpload,
            status: status === true ? 1 : 0,
            seo_title: seo_title ? seo_title.trim() : '',
            seo_description: seo_description ? seo_description.trim() : '',
            seo_url: seo_url.trim(),
            author: author.trim(),
            show_date: show_date ? show_date : moment(),
            hot: hot === true ? 1 : 0,
            // description: content,
            // html_content: jsonToHtml(content).trim(),
            html_content: dataEditor
        }
        let messageSuccess = "Thêm mới thành công"
        // if (jsonToHtml(content) == null) {
        //     message.error("Nhập nội dung bài viết!")
        //     return;
        // }
        //Sửa
        // if (record && record.id && jsonToHtml(content) !== null) {
        //     dataPush = {
        //         id: record.id,
        //         ...dataPush
        //     }
        //     messageSuccess = "Cập nhật thành công"
        // }


        console.log(dataPush, 'dataPush');
        const res = await dispatch(actionCUPost(dataPush))
        if (res) {
            handleClose()
            message.success(messageSuccess)
        }
    }
    const ReactEditorJS = createReactEditorJS()

    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance
    }, [])
    const listTag = record && record.id ? record.tag.map((item) => {
        return item.tag.name
    }) : null
    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
    }
    function range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    function disabledDateTime(value) {
        if (value && value.isSame(moment(), 'day')) {
            return {
                disabledHours: () => range(0, moment().get('hour')),
                disabledMinutes: () => range(0, moment().get('minute')),
                disabledSeconds: () => range(0, moment().get('second')),
            };
        }
    }

    const getDataEditor = (data) => {
        setDataEditor(data)
    }

    return (
        <>
            <Modal
                visible={open}
                footer={(
                    <div className="row-end">
                        <Button variant="outlined" color="secondary" onClick={handleClose} style={{ marginRight: 10 }}>
                            Thoát
                        </Button>
                        <Button color="primary" variant='outlined' type="submit" onClick={onSubmitDelayed}>
                            Lưu
                        </Button>
                    </div >
                )
                }
                closable={false}
                centered
                width={960}
                destroyOnClose
                bodyStyle={{ position: "relative" }}
                onCancel={handleClose}
                className="customModal"
                title={
                    [
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="modal-title">{record?.id ? "Sửa" : "Thêm Mới"} Bài Viết</span>
                            <div></div>
                            <i onClick={handleClose} style={{ cursor: "pointer" }}>
                                <CloseOutlined />
                            </i>
                        </div>
                    ]}
            >
                <Form ref={formRef}>
                    <div className="customModalContent" style={{ paddingRight: '6%', paddingLeft: '6%', paddingTop: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Tiêu đề{` `}
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <Form.Item
                                    name="title"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || value.trim() === "") {
                                                    return Promise.reject("Mời bạn nhập tiêu đề!")
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <Input
                                        maxLength="250"
                                        className="customInput width100"
                                        placeholder="Tiêu đề"
                                        onChange={onChangTitle}
                                        autoFocus
                                    />
                                </Form.Item>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Đường dẫn{` `}
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <Form.Item
                                    name="seo_url"
                                    rules={[{ required: true, message: "Mời bạn nhập đường dẫn !" }]}
                                >
                                    <Input
                                        className="customInput width100"
                                        placeholder="Đường dẫn"
                                    />
                                </Form.Item>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Danh mục{` `}
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <Form.Item
                                    name="category_id"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value) {
                                                    return Promise.reject("Mời bạn chọn danh mục!")
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <Select
                                        className="customSelect"
                                        suffixIcon={<CaretDownOutlined />}
                                        placeholder="Chọn danh mục bài viết"
                                    >
                                        {dataPostCategory.rows?.length > 0 ? dataPostCategory.rows.map((item) => {
                                            return (
                                                <Select.Option key={`category_${item.id}`} value={item.id}>{item.name}</Select.Option>
                                            )
                                        })
                                            : null}
                                    </Select>
                                </Form.Item>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Nhãn{` `}
                                </div>
                                <Form.Item
                                    name="tag"
                                >
                                    <Select
                                        mode="tags"
                                        className="customSelect"
                                        suffixIcon={<CaretDownOutlined />}
                                        placeholder="Chọn nhãn"
                                        defaultValue={record && record.id ? listTag : []}
                                    >
                                        {dataPostTag.rows?.length > 0 ? dataPostTag.rows.map((item) => {
                                            return (
                                                <Select.Option key={`tag_${item.id}`} value={item.name}>{item.name}</Select.Option>
                                            )
                                        })
                                            : null}
                                    </Select>
                                </Form.Item>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Tác giả{` `}
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <Form.Item
                                    name="author"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || value.trim() === "") {
                                                    return Promise.reject("Mời bạn nhập tên tác giả!")
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <Input
                                        maxLength="250"
                                        className="customInput width100"
                                        placeholder="Tác giả"
                                    />
                                </Form.Item>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Ảnh {` `}
                                    <span style={{ color: 'red' }}>*</span>
                                </div>
                                <div className="rowy-center add-user-avatar">
                                    <Upload {...uploadProps}>
                                        <img
                                            src={fileUpload?.newImg || oldFileUpload} alt=""
                                            className="rad--4"
                                            style={{ objectFit: 'cover', width: '150px', height: '150px' }}
                                        />
                                    </Upload>
                                </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Trạng thái{` `}
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <Form.Item
                                        name="status"
                                    >
                                        <Switch checked={status} onChange={onSwitch} /> <span style={{ marginLeft: '10px', fontWeight: '600' }}>{status === true ? 'Hiển thị' : 'Ẩn'}</span>
                                    </Form.Item>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Checkbox checked={check_show_date} onChange={onShowDate}><span style={{ marginLeft: '10px', fontWeight: '600' }}>Thiết lập ngày hiển thị</span></Checkbox>
                                    </div>
                                    {check_show_date === true && <Form.Item
                                        name="show_date"
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY HH:mm:ss"
                                            showTime={{ defaultValue: moment() }}
                                            style={{ width: '100%' }}
                                            disabledDate={disabledDate}
                                            disabledTime={disabledDateTime}
                                        />
                                    </Form.Item>}
                                </div>
                                <div>
                                    <Form.Item
                                        name="hot"
                                    >
                                        <Checkbox checked={hot} onChange={onHot}><span style={{ marginLeft: '10px', fontWeight: '600' }}>Nổi bật</span></Checkbox>
                                    </Form.Item>
                                </div>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <div className="customLabel">
                                    Nội dung bài viết{` `}
                                </div>
                                {/* <ReactEditorJS show defaultValue={record && record.id ? record.description : description} onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} /> */}
                                <EditorTiny data={record && record.id ? record.html_content : ''} getData={getDataEditor} />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                <h3 style={{ fontWeight: '600', float: 'left' }}>SEO</h3>
                                <div style={{ float: 'right' }}><Switch checked={seo_status} onChange={onSEO} /></div>
                            </Grid>


                            {seo_status === true && <>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                    <div className="customLabel">
                                        Tiêu đề trang{` `}
                                    </div>
                                    <Form.Item
                                        name="seo_title"
                                    >
                                        <Input
                                            maxLength="250"
                                            className="customInput width100"
                                            placeholder="Tiêu đề trang"
                                        />
                                    </Form.Item>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ pt: 0 }}>
                                    <div className="customLabel">
                                        Mô tả trang{` `}
                                    </div>
                                    <Form.Item
                                        name="seo_description"
                                    >
                                        <TextArea
                                            className="customInput width100"
                                            placeholder="Mô tả trang"
                                            rows={4}
                                        />
                                    </Form.Item>
                                </Grid>
                            </>}
                        </Grid>

                    </div>
                    {/* <div className="customModalContent" style={{ paddingRight: '10%', paddingLeft: '10%' }}>
                        <div className="layout-form-header row">

                            {seo_status === true && <div className="col-sm-12 mb--16">
                              
                            </div>}
                            {seo_status === true && <div className="col-sm-12 mb--16">
                               
                            </div>}
                        </div>
                    </div> */}
                </Form>
            </Modal >
        </>
    );
}

export default React.memo(DialogCUPost); // DialogCUPost
