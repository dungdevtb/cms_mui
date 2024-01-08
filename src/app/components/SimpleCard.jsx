import { Card, Box, styled } from '@mui/material';

const CardTitle = styled('div')(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
  marginBottom: !subtitle && '16px'
}));

const CardRoot = styled(Card)({
  height: '100%',
  padding: '20px 24px'
});

const CardRootAuto = styled(Card)({
  height: 'auto',
  padding: '20px 24px'
});

const SimpleCard = ({ children, title, subtitle, height }) => {
  return (
    <>
      {
        height ?
          <CardRootAuto elevation={6}>
            <CardTitle subtitle={subtitle}>{title}</CardTitle>
            {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
            {children}
          </CardRootAuto> :
          <CardRoot elevation={6}>
            <CardTitle subtitle={subtitle}>{title}</CardTitle>
            {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
            {children}
          </CardRoot>
      }
      {/* <CardRoot elevation={6}>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot> */}
    </>
  );
};

export default SimpleCard;
