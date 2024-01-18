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
import { StarFilled } from '@ant-design/icons';

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

function DialogRatingProduct({ dataRating, open, handleClose }) {
    const renderRating = (rating) => {
        if (rating == 5) {
            return (
                <Box>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                </Box>
            )
        }

        if (rating == 4) {
            return (
                <Box>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                </Box>
            )
        }

        if (rating == 3) {
            return (
                <Box>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                </Box>
            )
        }

        if (rating == 2) {
            return (
                <Box>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                    <i><StarFilled style={{ color: 'yellow' }} /></i>
                </Box>
            )
        }

        if (rating == 1) {
            return (
                <Box><i><StarFilled style={{ color: 'yellow' }} /></i></Box>
            )
        }
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
                                <TableCell align="center">Khách hàng</TableCell>
                                <TableCell align="center">Nội dung bình luận</TableCell>
                                <TableCell align="center">Đánh giá (1-5*)</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataRating?.length > 0 ? dataRating?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{item?.customer?.username}</TableCell>
                                    <TableCell align="center">{item.comment_text}</TableCell>
                                    {/* <TableCell align="center">{renderRating(item?.rating)}</TableCell> */}
                                    <TableCell align="center">{item?.rating} &nbsp; <i><StarFilled style={{ color: 'yellow' }} /></i></TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell align="center" colSpan={5}>Chưa có comment & rating</TableCell></TableRow>}
                        </TableBody>
                    </StyledTable>
                </Box>
            </Dialog>
        </Box>
    );
}

export default React.memo(DialogRatingProduct); // DialogRatingProduct
