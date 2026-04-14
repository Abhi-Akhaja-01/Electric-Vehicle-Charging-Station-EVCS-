// ToastComponent.js

import Toast from 'react-native-toast-message';

const showToast = (type, text1, text2) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    position:'bottom',
    text1Style:{fontSize:16},
    text2Style:{fontSize:14}
  });
};

export default showToast;
