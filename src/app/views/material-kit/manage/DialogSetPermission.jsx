import React, { useState, useEffect } from 'react';
import {
    Box, Button,
    Dialog,
    styled,
    Typography, IconButton,
    FormControlLabel,
    FormGroup,
    Checkbox
} from '@mui/material';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { actionGetListPermission, actionAddRolePermisson } from "redux/manage/action";
import _ from 'lodash';
import { message } from 'antd';

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

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
    '&.root': { padding: theme.spacing(2) }
}));

const DialogActions = styled(MuiDialogActions)(({ theme }) => ({
    '&.root': { margin: 0, padding: theme.spacing(1) }
}));

function DialogSetPermission({ isSetPermision, closeSetPermision, record }) {
    const dispatch = useDispatch()
    const [listPermissionChecked, setListPermissionChecked] = useState(
        record?.role_permission?.length > 0 ? record?.role_permission.map(it => it?.permission?.id) : []
    )

    const { listPermission } = useSelector(state => ({
        listPermission: state.manageReducer.listPermission,
    }), shallowEqual)

    useEffect(() => {
        dispatch(actionGetListPermission())
    }, [dispatch])

    const handleChangeCheckbox = (id) => {
        if (listPermissionChecked.includes(id)) {
            setListPermissionChecked(
                listPermissionChecked.filter(it => it !== id)
            )
        }
        else {
            setListPermissionChecked(
                [...listPermissionChecked, ...[id]]
            )
        }
    }

    const handleSubmit = _.debounce(() => {
        const dataSubmit = {
            role_id: record?.id,
            list_permission: listPermissionChecked
        }

        dispatch(actionAddRolePermisson(dataSubmit))
        closeSetPermision()
        return message.success('Cập nhật thành công!')
    }, 100)

    return (
        <Box>
            <Dialog
                onClose={closeSetPermision}
                aria-labelledby="customized-dialog-title"
                open={isSetPermision}
                // maxWidth="md"
                fullWidth
            >
                <DialogTitle id="customized-dialog-title" onClose={closeSetPermision}>
                    Set quyền hệ thống
                </DialogTitle>

                <DialogContent dividers>
                    <FormGroup row>
                        {listPermission?.rows.map((item, index) => (
                            <Box width={'100%'} key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={listPermissionChecked.includes(item.id)}
                                            onChange={() => handleChangeCheckbox(item?.id)}
                                        />
                                    }
                                    label={item.name}
                                />
                            </Box>
                        ))}

                    </FormGroup>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={closeSetPermision}>
                        Cancel
                    </Button>

                    <Button color="primary" variant='outlined' type="submit" onClick={handleSubmit}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default React.memo(DialogSetPermission); // DialogSetPermission
