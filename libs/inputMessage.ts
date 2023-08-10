import { ChangeEvent, useState } from 'react';
import messageValidate from './messageValidate';

const useHandleInputMessage = () => {
  const [inputMessage, setInputMessage] = useState('');
  const handleInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const temp = e.target.value.trim().replace(' ', '');
    const checkValidate = messageValidate(temp);
    if (checkValidate.includes('*')) {
      alert('욕설 사용하면 돼요~?? 안돼요~??');
    } else {
      setInputMessage(e.target.value);
    }
  };
  const handleDeleteInputMessage = () => {
    setInputMessage('');
  };

  return { inputMessage, handleInputMessage, handleDeleteInputMessage };
};

export default useHandleInputMessage;
