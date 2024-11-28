import { Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '..';

interface FooterProps {
    companyName?: string;
}

export const Footer = ({ companyName = 'USOF' }: FooterProps) => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: Github,
            href: 'https://github.com',
            label: 'GitHub',
            hoverColor: 'hover:text-gray-900 dark:hover:text-white'
        },
        {
            icon: Twitter,
            href: 'https://twitter.com',
            label: 'Twitter',
            hoverColor: 'hover:text-blue-400'
        },
        {
            icon: Linkedin,
            href: 'https://linkedin.com',
            label: 'LinkedIn',
            hoverColor: 'hover:text-blue-600'
        }
    ];

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            {companyName}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transform transition-all duration-200 text-gray-400 ${social.hoverColor} hover:scale-110`}
                                aria-label={social.label}
                            >
                                <social.icon className="h-6 w-6" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>© {currentYear}</span>
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                {companyName}
                            </span>
                            <span>{t('allRightsReserved')}.</span>
                        </div>

                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </footer>
    );
};
