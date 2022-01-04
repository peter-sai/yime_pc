import router from './index';
import { getToken } from '@/utils/utils'; // get token from cookie

router.beforeEach(async (to, from, next) => {
  // determine whether the user has logged in
  const hasToken = getToken();
  // alert(hasToken);
  if (hasToken) {
    const whiteList = ['/Login']; // no redirect whitelist
    if (whiteList.indexOf(to.path) !== -1) {
      // if is logged in, redirect to the home page
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    /* has no token*/
    const whiteList1 = ['/Login', '/Register', '/ForgetPassword']; // no redirect whitelist
    if (whiteList1.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/Login?redirect=${to.path}`);
    }
  }
});
