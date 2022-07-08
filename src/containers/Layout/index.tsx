import React, { useMemo } from 'react';

import { Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '@contexts/auth.context';
import { useSelector } from 'react-redux';
import { StoreDTO } from '@dtos/store.dtos';
import AppBar from '@components/Menu';
import { useRouter } from 'next/router';
import { PATH_PROFILE } from '@constants/routes.constants';
import styles from './styles.module.scss';

function Layout({ children }: { children: JSX.Element }): JSX.Element {
  const router = useRouter();
  const authUser = useSelector((state: StoreDTO) => state.userReducer?.user);
  const { signOut } = useAuth();

  const menuItems = useMemo(
    () => (
      [
        {
          name: 'Profile',
          onClick: () => router.push(PATH_PROFILE),
          icon: <PersonIcon />,
        },
        {
          name: 'Sign out',
          onClick: signOut,
          icon: <LogoutIcon />,
        },
      ]),
    [signOut],
  );
  return (
    <>
      <AppBar email={authUser?.email} menuItems={menuItems} />
      <Container className={styles.container}>{children}</Container>
    </>
  );
}

export default Layout;
