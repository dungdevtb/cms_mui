import React from 'react';
import {
    Box,
    Dialog,
    styled,
    Typography, IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { formatMoney } from 'app/lib/common';

const DialogTitleRoot = styled(MuiDialogTitle)(({ theme }) => ({
    margin: 0,
    padding: theme.spacing(2),
    '& .closeButton': {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const DialogTitle = (props) => {
    const { children, onClose } = props;
    return (
        <DialogTitleRoot disableTypography>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className="closeButton" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitleRoot>
    );
};

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
}));

function DialogCart({ dataCart, open, handleClose }) {
    const totalPrice = (item) => {
        return formatMoney(item?.product?.sell_price * item?.quantity) + " vnd"
    }
    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title" onClose={handleClose}>
                    Thông tin giỏ hàng
                </DialogTitle>

                <Box margin={'20px'}>
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Stt</TableCell>
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell align="center">Tên sản phẩm</TableCell>
                                <TableCell align="center">Số lượng</TableCell>
                                <TableCell align="center">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataCart?.cart_product.length > 0 ? dataCart?.cart_product.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center"><img src={item.product.image} style={{ width: 50, height: 50 }} alt='' /></TableCell>
                                    <TableCell align="center">{item.product.name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="center">{totalPrice(item)}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell align="center" colSpan={5}>Khách hàng chưa thêm sản phẩm vào giỏ hảng</TableCell></TableRow>}
                        </TableBody>
                    </StyledTable>
                </Box>
            </Dialog>
        </Box>
    );
}

export default React.memo(DialogCart); // DialogCart
