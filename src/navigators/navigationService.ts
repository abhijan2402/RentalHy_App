import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

let pendingNavigation: {name: string; params?: object} | null = null;

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
    return;
  }

  pendingNavigation = {name, params};
};

export const flushPendingNavigation = () => {
  if (!pendingNavigation || !navigationRef.isReady()) return;

  const {name, params} = pendingNavigation;
  pendingNavigation = null;
  navigationRef.navigate(name, params);
};
