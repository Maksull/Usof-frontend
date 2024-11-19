import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts';

export const LanguageSelector = () => {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select bg-white dark:bg-gray-700 border border-gray-300 
                 dark:border-gray-600 text-gray-600 dark:text-gray-300 
                 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 
                 focus:ring-blue-500 dark:focus:ring-blue-400 
                 transition-colors duration-200"
        >
            <option value="en">{t('languages.en')}</option>
            <option value="uk">{t('languages.uk')}</option>
        </select>
    );
};
