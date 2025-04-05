import { useTranslation } from 'react-i18next';
import './App.css'
import {Example} from './MRT'
import { useEffect } from 'react';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  // Update the language and text direction
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Example />
  )
}

export default App
