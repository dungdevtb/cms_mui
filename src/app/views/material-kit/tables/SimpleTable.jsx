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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { actionGetListPermission, actionGetListRole, actionDeletePermission } from "redux/manage/action";
import { useDispatch } from "react-redux";
import { SimpleCard } from "app/components";
import DialogCUPermission from "./DialogCUPermission";
import Button from '@mui/material/Button';
import { message } from "antd";

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
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { listPermission, listRole } = useSelector(state => ({
    listPermission: state.manageReducer.listPermission,
    listRole: state.manageReducer.listRole
  }), shallowEqual)

  console.log(listRole, 'listRole');

  useEffect(() => {
    dispatch(actionGetListPermission())
    dispatch(actionGetListRole())
  }, [dispatch])

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có muốn xóa?")) {
      const res = dispatch(actionDeletePermission({ id }));
      if (res) {
        message.success("Xóa thành công!");
      }
    }
  }

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
                    <IconButton onClick={() => handleDelete(item?.id)}>
                      <Icon color="error">close</Icon>
                    </IconButton>
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

      <DialogCUPermission open={open} handleClose={handleClose} />
    </SimpleCard>
  );
};

export default SimpleTable;
