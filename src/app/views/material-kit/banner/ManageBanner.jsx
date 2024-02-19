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
    Tooltip,
    Chip
} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SimpleCard, Breadcrumb } from "app/components";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";
import { actionGetListBanner, actionDeleteBanner } from "redux/order-voucher/action";
import DialogBanner from "./DialogBanner";

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

const ManageBanner = () => {
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});

    const { dataBanner } = useSelector(
        (state) => ({
            dataBanner: state.orderReducer.dataBanner,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(actionGetListBanner());
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
            const res = dispatch(actionDeleteBanner({ id }));
            if (res) {
                message.success("Xóa thành công!");
            }
        }
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản trị hệ thống", path: "/dashboard" }, { name: "Quản lý banner" }]} />
            </Box>
            <SimpleCard title={
                <div >
                    <Box width="100%" marginBottom="36px">Danh sách banner</Box>
                    <Box width="100%" display={'flex'} justifyContent={'space-between'}>
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
                                <TableCell align="center">Tiêu đề</TableCell>
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell align="center">Mô tả</TableCell>
                                <TableCell align="center">Loại banner</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataBanner?.rows.length > 0
                                ? dataBanner?.rows.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">{item.title}</TableCell>
                                        <TableCell align="center"><img src={item.image} style={{ width: '100px', height: '100px' }} alt="img" /></TableCell>
                                        <TableCell align="center">
                                            {item.type === 1 ?
                                                <Chip label="Main Banner" color="primary" variant="outlined" />
                                                : <Chip label="Sub Banner" color="success" variant="outlined" />}
                                        </TableCell>
                                        <TableCell align="center">{item.description}</TableCell>
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
                                )) : <span style={{ textAlign: 'center', width: '100%' }}>Không có dữ liệu</span>}
                        </TableBody>
                    </StyledTable>

                </Box>

                {open &&
                    <DialogBanner
                        open={open}
                        handleClose={handleClose}
                        record={record}
                    />
                }
            </SimpleCard>
        </Container>
    );
};

export default ManageBanner;
