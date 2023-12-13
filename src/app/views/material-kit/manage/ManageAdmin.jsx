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
    Avatar
} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { actionGetListAdmin, actionGetListRole, actionDeleteAdmin } from "redux/manage/action";
import { SimpleCard, Breadcrumb } from "app/components";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";
import _ from 'lodash'
import DialogCUAdmin from "./DialogCUAdmin";
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

const ManageAdmin = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const { listAdmin, listRole } = useSelector(state => ({
        listAdmin: state.manageReducer.listAdmin,
        listRole: state.manageReducer.listRole,
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListAdmin())
        dispatch(actionGetListRole())
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

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeSearchDelay = _.debounce((event) => {
        event.persist();
        const { name, value } = event.target
        dispatch(actionGetListAdmin({
            [name]: value,
        }))
    }, 500)

    const handleDelete = (id) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            const res = dispatch(actionDeleteAdmin({ id }));
            if (res) {
                message.success("Xóa thành công!");
            }
        }
    }

    const handleExportExcel = async () => {
        dispatch(actionLoading(true))
        const url = new URL(`${process.env.REACT_APP_API_URL}/api/exportExcel/list-user`)
        const accessToken = localStorage.getItem('token')
        url.searchParams.append('token', accessToken)
        window.open(url)
        dispatch(actionLoading(false))
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản trị hệ thống", path: "/admin/manage" }, { name: "Quản lý admin" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách admin</Box>
                    <Box width="100%" display={'flex'} justifyContent={'space-between'}>
                        <Box>
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
                                style={{ marginRight: '15px' }}
                            />

                            <TextField
                                type="email"
                                name="email"
                                label="Tìm kiếm theo email"
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

                        <Box>
                            <Button variant="outlined" color="success" onClick={handleExportExcel} style={{ marginRight: 15 }}>
                                Export Excel
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
                                <TableCell align="center">Tên admin</TableCell>
                                <TableCell align="center">Vai trò</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listAdmin?.rows.length > 0
                                && listAdmin?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {(page) * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{item.username}</TableCell>
                                        <TableCell align="center">{item.user_role.role.name}</TableCell>
                                        <TableCell align="center">{item.email}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                avatar={<Avatar alt="avatar_img" src={item.avatar} />}
                                                label={item.status ? "Hoạt động" : "Không hoạt động"}
                                                variant="outlined"
                                                color={item.status ? "primary" : "error"}
                                            />
                                        </TableCell>
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
                        count={listAdmin?.rows.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>

                {open &&
                    <DialogCUAdmin
                        open={open}
                        handleClose={handleClose}
                        record={record}
                        dataRole={listRole?.rows}
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ManageAdmin;
