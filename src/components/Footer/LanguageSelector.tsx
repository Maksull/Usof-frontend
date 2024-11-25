import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts';
import { Globe2 } from 'lucide-react';

export const LanguageSelector = () => {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();

    return (
        <div className="relative inline-block">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 border 
                          border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 
                          text-sm focus-within:ring-2 focus-within:ring-blue-500">
                <Globe2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent appearance-none outline-none 
                             text-gray-600 dark:text-gray-300 pr-8 cursor-pointer
                             [&>option]:bg-white dark:[&>option]:bg-gray-700"
                    style={{ colorScheme: 'auto' }} // This helps with default browser styling
                >
                    <option value="en" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {t('languages.en')}
                    </option>
                    <option value="uk" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {t('languages.uk')}
                    </option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};