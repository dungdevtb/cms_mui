/* eslint-disable no-unreachable */
import {
    Box, styled,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
} from "@mui/material";
import React from "react";
import { SimpleCard, Breadcrumb } from "app/components";
import { useDispatch } from "react-redux";
import { Image, Steps, message } from "antd";
import { formatMoney } from "app/lib/common";
import moment from "moment";
import WestIcon from '@mui/icons-material/West';
import { actionUpdateStatusOrder } from "redux/order-voucher/action";

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

const { Step } = Steps
const DetailOrder = ({ open, handleClose, record }) => {
    let dispatch = useDispatch();
    const renderStatusTimeline = () => {
        if (record && record?.status === 3) {
            return (
                <Steps labelPlacement="vertical" current={3}>
                    <Step title="Mới" />
                    <Step title="Xác nhận" />
                    <Step title="Giao hàng" />
                    <Step status="error" title="Hủy" />
                </Steps>
            )
        } else {
            return (
                <Steps labelPlacement="vertical" current={record?.status}>
                    <Step title="Mới" />
                    <Step title="Xác nhận" />
                    <Step title="Giao hàng" />
                    <Step title="Thành công" />
                </Steps>
            )
        }
    }

    const RowDetail = ({ title, content }) => {
        return (
            <div style={{ marginTop: 20 }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}:</span>
                &nbsp;
                {content || "--"}
            </div>
        )
    }

    const renderProduct = (item) => {
        return (
            <Box display={'flex'} alignItems={'center'}>
                <div>
                    <Image src={item?.product?.image} style={{ borderRadius: '50%', width: 50 }} />
                </div>
                <div style={{ marginLeft: 10, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{item?.product?.name}</div>
                    <div>Brand: {item?.product?.brand?.name}</div>
                    <div>Danh mục: {item?.product?.category?.name}</div>
                </div>
            </Box>
        )
    }

    const totalOrderValue = () => {
        let total = 0
        record?.order_product?.forEach((item) => {
            total += item?.product?.sell_price * item?.quantity
        })
        return formatMoney(total)
    }

    const discountVoucher = () => {
        if (record?.voucher?.type === "money") {
            return " - " + formatMoney(Number(record?.voucher?.max_money)) + " VND"
        }

        if (record?.voucher?.type === "percent") {
            // let totalOrder = totalOrderValue()
            // let discount = totalOrder * (record?.voucher?.percent / 100)
            // let result = totalOrder - discount

            return " - " + record?.voucher?.percent + "%"
        }
    }

    const handleUpdateStatus = async (status) => {
        let dataPayload = {
            id: record?.id,
            status: status
        }

        const res = await dispatch(actionUpdateStatusOrder(dataPayload))
        if (res) {
            if (status === 1) {
                message.success("Đặt hàng thành công")
            } else if (status === 2) {
                message.success("Giao đơn hàng thành công")
            } else if (status === 3) {
                message.success("Hủy đơn hàng thành công")
            } else if (status === 4) {
                message.success("Xác nhận đơn hàng thành công")
            }
        }
        handleClose()
    }

    const renderBtn = () => {
        switch (record?.status) {
            case 0: {
                return <Button color="primary" variant='contained' onClick={() => handleUpdateStatus(1)}>
                    Xác nhận đặt hàng
                </Button>
            }

            case 1: {
                return <Button color="primary" variant='contained' onClick={() => handleUpdateStatus(2)}>
                    Xác nhận giao hàng
                </Button>
            }

            case 2: {
                return <Button color="primary" variant='contained' onClick={() => handleUpdateStatus(4)}>
                    Xác nhận hoàn thành đơn hàng
                </Button>
            }

            default: {
                return null
            }
        }
    }

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Danh sách đơn hàng", path: "/order/list" }, { name: "Chi tiết đơn hàng" }]} />
            </Box>
            <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <i onClick={() => handleClose()} style={{ cursor: "pointer", marginRight: 10, marginTop: 5 }}><WestIcon /></i>
                            <span>Thông tin đơn hàng - {record?.order_code}</span>
                        </div>}
                        height={'auto'}>
                        <div style={{ margin: "10px 0" }}>{renderStatusTimeline()}</div>
                        <RowDetail title="Thời gian đặt hàng" content={(moment(record?.created_at).format('DD/MM/YYYY HH:mm'))} />
                        <RowDetail title="Hình thức thanh toán" content={(record?.payment_type === 1 ? 'Thanh toán khi giao hàng' : 'Thanh toán online')} />
                        <RowDetail title="Hình thức vận chuyển" content={(record?.delivery_type === 1 ? 'Vận chuyển thường' : 'Vận chuyển hỏa tốc')} />
                        <RowDetail title="Voucher" content={record?.voucher?.name || "--"} />
                        <div style={{ marginTop: 10, marginBottom: 40 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú:</span>
                            &nbsp;
                            {record?.note || "--"}
                        </div>
                    </SimpleCard>
                    <Box marginTop={'20px'}>
                        <SimpleCard title={'Danh sách sản phẩm'} height={'auto'}>
                            <StyledTable>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell align="center">Stt</TableCell> */}
                                        <TableCell align="left">Sản phẩm</TableCell>
                                        <TableCell align="center">Giá bán</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="center">Thành tiền</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {record?.order_product.length > 0
                                        && record?.order_product.map((item, index) => (
                                            <TableRow key={index}>
                                                {/* <TableCell align="center">{index + 1}</TableCell> */}
                                                <TableCell align="center">{renderProduct(item)}</TableCell>
                                                <TableCell align="center">{formatMoney(item.product.sell_price) + " VND" || "--"}</TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>
                                                <TableCell align="center">
                                                    {formatMoney(item.product.sell_price * item.quantity) + " VND" || "--"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    <div style={{ borderBottom: '1px solid #ccc' }}></div>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Tổng giá trị đơn hàng</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Phí vận chuyển</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Voucher</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Thành tiền</div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div>{totalOrderValue() + "VND" || "--"}</div>
                                            <div>{record?.fee_delivery ? " + " + formatMoney(record?.fee_delivery) + " VND" : "--"}</div>
                                            <div>{record?.voucher ? discountVoucher() : "--"}</div>
                                            <div>{formatMoney(record?.total) + " VND" || "--"}</div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </StyledTable>
                        </SimpleCard>
                    </Box>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard title={'Thông tin khách hàng'} height={'auto'}>
                        <Box marginLeft={"20px"}>
                            <RowDetail title="Họ và tên" content={record?.customer?.username} />
                            <RowDetail title="Email" content={record?.customer?.email} />
                            <RowDetail title="Số điện thoại" content={record?.customer?.mobile} />
                        </Box>
                    </SimpleCard>
                    <Box marginTop={"20px"}>
                        {record?.status === 3 ?
                            <SimpleCard title={'Lý do hủy'} height={'auto'}>
                                {record?.metadata?.reason ? record?.metadata?.reason : '--'}
                            </SimpleCard>
                            : <SimpleCard title={'Thông tin thanh toán'} height={'auto'}>
                                <RowDetail title="Trạng thái" content={(record?.status === 4 ? "Đã thanh toán" : "Chưa thanh toán")} />
                                <RowDetail title="Tổng số tiền thanh toán" content={(formatMoney(record?.total) + ' VND')} />
                            </SimpleCard>
                        }
                    </Box>
                </Grid>
            </Grid>

            <Box display={'flex'} justifyContent={'flex-end'} marginTop={'20px'}>
                {(record?.status === 0 || record?.status === 1 || record?.status === 2) &&
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(3)}
                        style={{ marginRight: 10 }}
                    >
                        Hủy đơn đặt hàng
                    </Button>}

                {renderBtn()}
            </Box>

        </Container>
    )
}

export default DetailOrder


