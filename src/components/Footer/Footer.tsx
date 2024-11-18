import { Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '..';

interface FooterProps {
    companyName?: string;
}

export const Footer = ({ companyName = 'USOF' }: FooterProps) => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: t('footer.about'), href: '/about' },
            { label: t('footer.careers'), href: '/careers' },
            { label: t('footer.contact'), href: '/contact' }
        ],
        resources: [
            { label: t('footer.documentation'), href: '/docs' },
            { label: t('footer.blog'), href: '/blog' },
            { label: t('footer.support'), href: '/support' }
        ],
        legal: [
            { label: t('footer.privacyPolicy'), href: '/privacy' },
            { label: t('footer.termsOfService'), href: '/terms' },
            { label: t('footer.cookiePolicy'), href: '/cookies' }
        ]
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
    ];

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {companyName}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t('footer.description')}
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links sections remain the same, just using translated labels */}
                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {currentYear} {companyName}. {t('allRightsReserved')}.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
