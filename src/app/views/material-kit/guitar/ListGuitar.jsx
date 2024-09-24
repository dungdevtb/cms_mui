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
} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { actionGetListGuitar,actionDeleteGuitar} from "redux/guitar/action";
import { actionLoading } from "redux/home/action";
import { SimpleCard, Breadcrumb } from "app/components";
import CUGuitar from "./CUGuitar";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";
import _ from 'lodash'
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

const ListGuitar = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const { listGuitar } = useSelector(state => ({
        listGuitar: state.guitarReducer.listGuitar,
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListGuitar())
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
            const res = dispatch(actionDeleteGuitar({ id }));
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
        dispatch(actionGetListGuitar({ name: event.target.value }))
    }, 500)

    const handleExportExcel = async () => {
        dispatch(actionLoading(true))
        const url = new URL(`${process.env.REACT_APP_API_URL}/api/exportExcel/list-guitar`)
        const accessToken = localStorage.getItem('token')
        url.searchParams.append('token', accessToken)
        window.open(url)
        dispatch(actionLoading(false))
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Danh sách guitar", path: "/guitar/list" }, { name: "Danh sách guitar" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách guitar</Box>
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
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell align="center">Tên guitar</TableCell>
                                <TableCell align="center">Giá guitar</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listGuitar?.rows.length > 0
                                && listGuitar?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {(page) * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center"><img src={item?.image} alt="" width={100} height={100}/></TableCell>
                                        <TableCell align="center">{item.name}</TableCell>
                                        <TableCell align="center">{formatMoney(item.price) + "VND" || '--'}</TableCell>

                                        <TableCell align="center">
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
                        count={listGuitar?.rows.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>

                {open &&
                    <CUGuitar
                        open={open}
                        handleClose={handleClose}
                        record={record}
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ListGuitar;
