import {
    Box,
    Icon,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    TextField,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';

import { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SimpleCard, Breadcrumb } from "app/components";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";
import _ from 'lodash'
import DialogCUProduct from "./DialogCUProduct";
import { actionGetListProduct, actionDeleteProduct, actionGetListCategory, actionGetListBrand, actionGetListProductType } from 'redux/product/action';
import { actionLoading } from "redux/home/action";
import { formatMoney } from "app/lib/common";
import DialogRatingProduct from "./DialogRatingProduct";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
}));

const ManageProduct = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const [openRating, setOpenRating] = useState(false);
    const [dataRating, setDataRating] = useState([]);

    const { dataProduct, dataBrand, dataCategory, dataProductType } = useSelector(
        (state) => ({
            dataProduct: state.productReducer.dataProduct,
            dataBrand: state.productReducer.dataBrand,
            dataCategory: state.productReducer.dataCategory,
            dataProductType: state.productReducer.dataProductType
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(actionGetListProduct());
        dispatch(actionGetListCategory());
        dispatch(actionGetListBrand());
        dispatch(actionGetListProductType());
    }, [dispatch]);


    const handleClickOpen = useCallback((itemEdit) => {
        if (itemEdit) {
            setRecord(itemEdit)
        } else {
            setRecord({})
        }
        setOpen(true)
    }, []);

    const handleClose = useCallback(() => {
        setRecord({})
        setOpen(false)
    }, []);

    const handleOpenRating = useCallback((itemRating) => {
        if (itemRating) {
            setDataRating(itemRating)
        } else {
            setDataRating([])
        }
        setOpenRating(true)
    }, []);

    const handleCloseRating = useCallback(() => {
        setDataRating([])
        setOpenRating(false)
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            const res = dispatch(actionDeleteProduct({ id }));
            if (res) {
                message.success("Xóa thành công!");
            }
        }
    }

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeSearchDelay = _.debounce((event) => {
        const { name, value } = event.target
        dispatch(actionGetListProduct({ [name]: value }))
    }, 500)

    const handleExportExcel = async () => {
        dispatch(actionLoading(true))
        const url = new URL(`${process.env.REACT_APP_API_URL}/api/exportExcel/list-product`)
        const accessToken = localStorage.getItem('token')
        url.searchParams.append('token', accessToken)
        window.open(url)
        dispatch(actionLoading(false))
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản trị hệ thống", path: "/dashboard" }, { name: "Quản lý kho hàng" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách sản phẩm</Box>
                    <Box width="100%" display={'flex'} justifyContent={'space-between'}>
                        <Box width="100%" display={'flex'} >
                            <TextField
                                type="text"
                                name="name"
                                label="Tìm kiếm theo tên"
                                onChange={handleChangeSearchDelay}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                style={{ marginRight: 10 }}
                            />
                            <FormControl sx={{ minWidth: 180, marginRight: "10px" }} size="small">
                                <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Danh mục"
                                    name="category_id"
                                    onChange={handleChangeSearchDelay}
                                >
                                    {dataCategory?.rows.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 180, marginRight: "10px" }} size="small">
                                <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Brand"
                                    name="brand_id"
                                    onChange={handleChangeSearchDelay}
                                >
                                    {dataBrand?.rows.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box width="100%" display={'flex'} justifyContent={'flex-end'}>
                            <Button variant="outlined" color="success" onClick={handleExportExcel} sx={{ minWidth: 100, marginRight: "10px" }}>
                                Export Excel
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleClickOpen} sx={{ minWidth: 100 }}>
                                Thêm mới
                            </Button>
                        </Box>
                    </Box>
                </div>
            } >
                <Box width="100%" overflow="auto">
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Stt</TableCell>
                                <TableCell align="center">Tên sản phẩm</TableCell>
                                <TableCell align="center">Số lượng</TableCell>
                                <TableCell align="center">Giá nhập</TableCell>
                                <TableCell align="center">Giá bán</TableCell>
                                <TableCell align="center">Danh mục</TableCell>
                                <TableCell align="center">Thương hiệu</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataProduct?.rows.length > 0
                                ? dataProduct?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {(page) * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{item.name}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="center">{formatMoney(item.import_price) + "VND" || '--'}</TableCell>
                                        <TableCell align="center">{formatMoney(item.sell_price) + "VND" || '--'}</TableCell>
                                        <TableCell align="center">{item.category?.name}</TableCell>
                                        <TableCell align="center">{item.brand?.name}</TableCell>
                                        <TableCell align="center">
                                            {item.status === 1 ?
                                                <Chip label="Công bố" color="primary" variant="outlined" />
                                                : <Chip label="Không công bố" color="error" variant="outlined" />}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Đánh giá sp">
                                                <IconButton>
                                                    <Icon color="success" onClick={() => handleOpenRating(item?.comments)}>
                                                        <AddToDriveIcon />
                                                    </Icon>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sửa">
                                                <IconButton>
                                                    <Icon color="primary" onClick={() => handleClickOpen(item)}>
                                                        <BorderColorOutlinedIcon />
                                                    </Icon>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton onClick={() => handleDelete(item?.id)}>
                                                    <Icon color="error">close</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )) : <span style={{ textAlign: 'center', width: '100%' }}>Không có dữ liệu</span>}
                        </TableBody>
                    </StyledTable>
                    <TablePagination
                        sx={{ px: 2 }}
                        page={page}
                        component="div"
                        labelRowsPerPage="Số hàng trên trang"
                        rowsPerPage={rowsPerPage}
                        count={dataProduct?.rows.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>

                {open &&
                    <DialogCUProduct
                        open={open}
                        handleClose={handleClose}
                        record={record}
                        dataBrand={dataBrand}
                        dataCategory={dataCategory}
                        dataProductType={dataProductType}
                    />
                }

                {openRating &&
                    <DialogRatingProduct
                        open={openRating}
                        handleClose={handleCloseRating}
                        dataRating={dataRating}
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ManageProduct;
