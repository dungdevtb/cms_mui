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
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { actionGetListRole, actionDeleteRole } from "redux/manage/action";
import { useDispatch } from "react-redux";
import { SimpleCard, Breadcrumb } from "app/components";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";
import _ from 'lodash'
import DialogRole from "./DialogRole";
import DialogSetPermission from "./DialogSetPermission";

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

const ManageRole = () => {
    const dispatch = useDispatch()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [isSetPermision, setIsSetPermision] = useState(false);
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const { listRole } = useSelector(state => ({
        listRole: state.manageReducer.listRole
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListRole())
    }, [dispatch])

    const openSetPermission = useCallback((itemEdit) => {
        if (itemEdit) {
            setRecord(itemEdit)
        } else {
            setRecord({})
        }
        setIsSetPermision(true)
    })

    const closeSetPermision = useCallback(() => {
        setRecord({})
        setIsSetPermision(false)
    })

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
            const res = dispatch(actionDeleteRole({ id }));
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
        dispatch(actionGetListRole({ name: event.target.value }))
    }, 500)

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản trị hệ thống", path: "/admin/manage" }, { name: "Quản lý vai trò" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách vai trò</Box>
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
                                <TableCell align="center">Tên vai trò</TableCell>
                                <TableCell align="center">Slug</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listRole?.rows.length > 0
                                && listRole?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {(page) * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{item.name}</TableCell>
                                        <TableCell align="center">{item.slug}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Set quyền">
                                                <IconButton>
                                                    <Icon color="success" onClick={() => openSetPermission(item)}>
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
                        count={listRole?.rows.length}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                    />
                </Box>

                {open &&
                    <DialogRole
                        open={open}
                        handleClose={handleClose}
                        record={record}
                    />
                }
                {
                    isSetPermision &&
                    <DialogSetPermission
                        isSetPermision={isSetPermision}
                        closeSetPermision={closeSetPermision}
                        record={record}
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ManageRole;
