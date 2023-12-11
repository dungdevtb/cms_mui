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
  Tooltip
} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { actionGetListPermission, actionDeletePermission } from "redux/manage/action";
import { useDispatch } from "react-redux";
import { SimpleCard } from "app/components";
import DialogCUPermission from "./DialogCUPermission";
import Button from '@mui/material/Button';
import { message } from "antd";
import { useCallback } from "react";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const SimpleTable = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState({});

  const { listPermission } = useSelector(state => ({
    listPermission: state.manageReducer.listPermission,
  }), shallowEqual)

  useEffect(() => {
    dispatch(actionGetListPermission())
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
      const res = dispatch(actionDeletePermission({ id }));
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

  return (
    <SimpleCard title={
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Danh sách quyền</span>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Thêm mới
        </Button>
      </div>
    } >
      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="center">Stt</TableCell>
              <TableCell align="center">Tên quyền</TableCell>
              <TableCell align="center">Slug</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listPermission?.rows.length > 0
              && listPermission?.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {(page) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.slug}</TableCell>
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
          count={listPermission?.rows.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Box>

      {open &&
        <DialogCUPermission
          open={open}
          handleClose={handleClose}
          record={record}
        />
      }
    </SimpleCard>
  );
};

export default SimpleTable;
