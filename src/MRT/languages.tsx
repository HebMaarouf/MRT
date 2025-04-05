import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

export const LanguageToggle = () => {

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    const tooltipText = i18n.language === 'ar' ? t('English') : t('Arabic');
      
  return (
    <Tooltip title={tooltipText}>
    <IconButton onClick={ () => changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')} style={{ margin: '10px' }}>
      <LanguageIcon />
    </IconButton>
  </Tooltip>
  )
}
