import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';

import { NON_AUTH_PATHS, PATH_INDEX, PATH_SIGN_IN, PATHS_WITH_AUTH } from '@constants/routes.constants';
import { StoreDTO } from '@redux/interfaces/store.interface';
import useFirebaseAuth from './hooks/authenticationWrapper.hooks';
import styles from './authenticationWrapper.module.scss';

export default function ({ children }) {
  useFirebaseAuth();
  const [isMount, setMount] = useState(false);
  const router = useRouter();
  const [loadingLocal, setLoading] = useState(false);
  const user = useSelector((state: StoreDTO) => state.user?.user);
  const isLoading = useSelector((state: StoreDTO) => state.user?.isLoading);
  const isLoadingInitTopSongs = useSelector((state: StoreDTO) => state.songs?.isInitLoading);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (user === null && PATHS_WITH_AUTH.includes(router.pathname)) {
        await router.push(PATH_SIGN_IN);
      }
      if (user && NON_AUTH_PATHS.includes(router.pathname)) {
        await router.push(PATH_INDEX);
      }
      setLoading(false);
    })();
  }, [user, isLoading]);

  useEffect(() => {
    setMount(true);
  }, []);

  if (isLoading && user === undefined && PATHS_WITH_AUTH.includes(router.pathname) && isMount) {
    router.push(PATH_SIGN_IN);
  }
  if (isLoading || loadingLocal || isLoadingInitTopSongs) {
    return <CircularProgress className={styles.loader} />;
  }
  return children;
}