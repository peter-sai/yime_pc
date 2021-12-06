// 跳转
const useGoTo = (useRouter: any) => {
  const router = useRouter();
  return (e: string) => {
    router.push(e);
  };
};

// 返回上一级
const useGoBack = (useRouter: any) => {
  const router = useRouter();
  return () => {
    router.back();
  };
};

// 清除栈信息返回上一级
const useGoReplace = (useRouter: any) => {
  const router = useRouter();
  return (path: string) => {
    router.replace(path);
  };
};

export { useGoTo, useGoBack, useGoReplace };
