import {
    Box, styled, Grid, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { SimpleCard, Breadcrumb } from "app/components";
import { useDispatch } from "react-redux";
import { Steps } from "antd";
import { formatMoney } from "app/lib/common";
import moment from "moment";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));


const { Step } = Steps
const DetailOrder = ({ open, handleClose, record }) => {

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

    console.log(record);
    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Danh sách đơn hàng", path: "/order/list" }, { name: "Chi tiết đơn hàng" }]} />
            </Box>
            <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard title={<span>Thông tin đơn hàng - {record?.order_code}</span>} height={'auto'}>
                        <div style={{ margin: "10px 0" }}>{renderStatusTimeline()}</div>
                        <RowDetail title="Thời gian đặt hàng" content={(moment(record?.created_at).format('DD/MM/YYYY HH:mm'))} />
                        <RowDetail title="Hình thức thanh toán" content={(record?.payment_type === 1 ? 'Thanh toán khi giao hàng' : 'Thanh toán online')} />
                        <RowDetail title="Hình thức vận chuyển" content={(record?.delivery_type === 1 ? 'Vận chuyển thường' : 'Vận chuyển hỏa tốc')} />
                        <RowDetail title="Phí vận chuyển" content={(formatMoney(record?.fee_delivery) + ' VND')} />
                        <div style={{ marginTop: 10, marginBottom: 40 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Ghi chú:</span>
                            &nbsp;
                            {record?.note || "--"}
                        </div>
                        <RowDetail title="Tổng giá trị đơn hàng" content={(formatMoney(record?.total) + ' VND')} />
                    </SimpleCard>
                    <Box marginTop={'20px'}>
                        <SimpleCard title={'Danh sách sản phẩm'} height={'auto'}>
                            abc
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
                        <SimpleCard title={'Lý do hủy'} height={'auto'}>
                            {record?.metadata?.reason ? record?.metadata?.reason : '--'}
                        </SimpleCard>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default DetailOrder


