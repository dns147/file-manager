const getUserName = () => {
  const envs = {};

  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    envs[key] = value;
  });

  const userName = envs['--username'];

  return userName;
};

export { getUserName };