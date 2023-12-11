import { MatxSuspense } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { MatxLayouts } from './index';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import { actionLoginByToken } from 'redux/home/action';

const MatxLayout = (props) => {
  const { settings } = useSettings();
  const Layout = MatxLayouts[settings.activeLayout];

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { infoUser } = useSelector(state => ({
    infoUser: state.homeReducer.infoUser,
  }), shallowEqual)

  const token = localStorage.getItem('token');
  useEffect(() => {
    (async () => {
      if (token) {
        await dispatch(actionLoginByToken());
      }
    })();
  }, [dispatch])

  useEffect(() => {
    if (!token || !infoUser) {
      navigate('/session/signin')
    }
  }, [infoUser, token])

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  );

};

export default MatxLayout;
