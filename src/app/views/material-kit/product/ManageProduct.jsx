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
    Chip
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
import { actionGetListProduct, actionDeleteProduct } from 'redux/product/action';
import { formatMoney } from "app/lib/common";

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

    const { dataProduct } = useSelector(
        (state) => ({
            dataProduct: state.productReducer.dataProduct,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(actionGetListProduct());
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
        event.persist();
        dispatch(actionGetListProduct({ name: event.target.value }))
    }, 500)


    // console.log(dataProduct);
    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản trị hệ thống", path: "/dashboard" }, { name: "Quản lý kho hàng" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách sản phẩm</Box>
                    <Box width="100%" display={'flex'} justifyContent={'space-between'}>
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
                        />

                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Thêm mới
                        </Button>
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
                                && dataProduct?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
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
                                                    <Icon color="success" onClick={() => handleClickOpen(item)}>
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
                                ))}
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
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ManageProduct;
