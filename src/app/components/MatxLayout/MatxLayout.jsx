import { useEffect } from 'react';
import { MatxSuspense } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { MatxLayouts } from './index';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { actionLoginByToken } from 'redux/home/action';

const MatxLayout = (props) => {
  const { settings } = useSettings();
  const Layout = MatxLayouts[settings.activeLayout];
  const token = localStorage.getItem('token');

  let navigate = useNavigate();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   (async () => {
  //     if (token) {
  //       await dispatch(actionLoginByToken());
  //     }
  //   })();
  // }, [dispatch])

  useEffect(() => {
    if (!token) {
      navigate('/session/signin')
    }
  }, [token])

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  );

};

export default MatxLayout;
