import { MessageBox } from 'element-ui';

function run({ title, message, customClass }) {
  return MessageBox({
    title,
    message,
    beforeClose(action, instance, done) {
      if (action === 'confirm') {
        message.componentInstance.validate().then(done);
      } else {
        done();
      }
    },
    lockScroll: true,
    showCancelButton: true,
    customClass,
  }).then((action, instance) => {
    console.log('then.', action, instance);
    return message.componentInstance.getValue();
  });
}

export default run;
