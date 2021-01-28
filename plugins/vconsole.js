const Vconsole =
  process.env.NODE_ENV !== 'prod' ? require('vconsole') : {};

export default ({ app }, inject) => { // eslint-disable-line
  if (process.env.NODE_ENV !== 'prod') inject('vConsole', new Vconsole());
};