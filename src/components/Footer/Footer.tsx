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

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 
                          transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                                         bg-clip-text text-transparent">
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
                                    className={`transform transition-all duration-200 
                                              text-gray-400 ${social.hoverColor} 
                                              hover:scale-110`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 
                                         uppercase tracking-wider">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-300 
                                                     hover:text-blue-600 dark:hover:text-blue-400 
                                                     transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
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
