/* eslint-disable react-hooks/exhaustive-deps */
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
    Avatar,
    Button
} from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useState, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SimpleCard, Breadcrumb } from "app/components";
import _ from 'lodash'
import { actionGetListOrder } from "redux/order-voucher/action";
import { formatMoney } from "app/lib/common";
import moment from "moment";
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import DetailOrder from "./DetailOrder";
import { actionLoading } from "redux/home/action";

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

const ManageOrder = () => {
    const dispatch = useDispatch()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const { dataOrder } = useSelector(state => ({
        dataOrder: state.orderReducer.dataOrder,
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListOrder())
    }, [dispatch])

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
            // const res = dispatch(actionDeletePermission({ id }));
            // if (res) {
            //     message.success("Xóa thành công!");
            // }
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
        dispatch(actionGetListOrder({ name: event.target.value }))
    }, 500)

    const renderStatus = (status) => {
        switch (status) {
            case 0:
                return <Chip label="Đơn hàng mới" color="primary" variant="outlined" />
            case 1:
                return <Chip label="Chờ xử lý" color="primary" variant="outlined" />
            case 2:
                return <Chip label="Đang giao hàng" color="info" variant="outlined" />
            case 3:
                return <Chip label="Hủy" color="error" variant="outlined" />
            case 4:
                return <Chip label="Thành công" color="success" variant="outlined" />
            default:
                break;
        }
    }

    const renderCustomer = (customer) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                    <Avatar src={customer.avatar} sx={{ width: 30, height: 30 }} />
                </div>
                <div style={{ marginLeft: "10px" }}>
                    <div>{customer.username}</div>
                    <div style={{ color: "#6C778D" }}>{customer.mobile}</div>
                </div>
            </div>
        )
    }

    const handleExportExcel = async () => {
        dispatch(actionLoading(true))
        const url = new URL(`${process.env.REACT_APP_API_URL}/api/exportExcel/list-order`)
        const accessToken = localStorage.getItem('token')
        url.searchParams.append('token', accessToken)
        window.open(url)
        dispatch(actionLoading(false))
    }

    return (
        <>
            {open ?
                <DetailOrder record={record} open={open} handleClose={handleClose} /> :
                < Container >
                    <Box className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: "Quản lý đơn hàng", path: "/order/list" }, { name: "Danh sách đơn hàng" }]} />
                    </Box>
                    <SimpleCard title={
                        <div >
                            <Box width="100%" marginBottom="36px">Danh sách đơn hàng</Box>
                            <Box width="100%" display={'flex'} justifyContent={'space-between'}>
                                <Box width="100%">
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
                                </Box>
                                <Box width="100%" display={'flex'} justifyContent={'flex-end'}>
                                    <Button variant="outlined" color="success" onClick={handleExportExcel} sx={{ minWidth: 100, marginRight: "10px" }}>
                                        Export Excel
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
                                        <TableCell align="center">Mã đơn hàng</TableCell>
                                        <TableCell align="center">Trạng thái đơn hàng</TableCell>
                                        <TableCell align="center">Ngày đặt</TableCell>
                                        <TableCell align="center">Khách hàng</TableCell>
                                        <TableCell align="center">Tổng tiền</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {dataOrder?.rows.length > 0
                                        && dataOrder?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">
                                                    {(page) * rowsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell align="center">{item.order_code}</TableCell>
                                                <TableCell align="center">{renderStatus(item.status)}</TableCell>
                                                <TableCell align="center">
                                                    {moment(item.createdAt).format("DD/MM/YYYY")} •{" "}
                                                    {moment(item.createdAt).format("HH:mm")}
                                                </TableCell>
                                                <TableCell align="center">{renderCustomer(item.customer)}</TableCell>
                                                <TableCell align="center">{formatMoney(item.total) + " VND" || '--'}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Chi tiết">
                                                        <IconButton>
                                                            <Icon color="success" onClick={() => handleClickOpen(item)}>
                                                                <AddToDriveIcon />
                                                            </Icon>
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
                                count={dataOrder?.rows.length}
                                onPageChange={handleChangePage}
                                rowsPerPageOptions={[5, 10, 25]}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                nextIconButtonProps={{ "aria-label": "Next Page" }}
                                backIconButtonProps={{ "aria-label": "Previous Page" }}
                            />
                        </Box>
                    </SimpleCard>
                </Container >}
        </>

    );
};

export default ManageOrder;
