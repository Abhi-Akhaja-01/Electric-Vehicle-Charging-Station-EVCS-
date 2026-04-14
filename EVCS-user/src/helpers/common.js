export const uuid4 = () => {
    const chars = '0123456789abcdef';
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return chars[v];
    });
    // console.log("uuid : ",uuid);
    return uuid;
  };

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export const emailValidate = (email) => emailRegex.test(email);

export const lengthValidate = (text, length) => text.length > length;
