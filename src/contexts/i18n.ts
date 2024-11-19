import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Header translations
            header: {
                search: "Search...",
                login: "Login",
                logout: "Logout",
                home: "Home",
                questions: "Questions",
                tags: "Tags",
                users: "Users",
            },
            // Footer translations
            footer: {
                about: "About Us",
                careers: "Careers",
                contact: "Contact",
                documentation: "Documentation",
                blog: "Blog",
                support: "Support",
                privacyPolicy: "Privacy Policy",
                termsOfService: "Terms of Service",
                cookiePolicy: "Cookie Policy",
                allRightsReserved: "All rights reserved",
                description: "Your best resource for asking and answering technical questions. Share knowledge with the community and grow together.",
            },
            // Language names
            languages: {
                en: "English",
                uk: "Ukrainian"
            }
        }
    },
    uk: {
        translation: {
            // Header translations
            header: {
                search: "Пошук...",
                login: "Увійти",
                logout: "Вийти",
                home: "Головна",
                questions: "Питання",
                tags: "Теги",
                users: "Користувачі",
            },
            // Footer translations
            footer: {
                about: "Про нас",
                careers: "Кар'єра",
                contact: "Контакти",
                documentation: "Документація",
                blog: "Блог",
                support: "Підтримка",
                privacyPolicy: "Політика конфіденційності",
                termsOfService: "Умови використання",
                cookiePolicy: "Політика щодо файлів cookie",
                allRightsReserved: "Всі права захищені",
                description: "Ваш найкращий ресурс для запитань та відповідей на технічні питання. Діліться знаннями зі спільнотою та розвивайтеся разом.",
            },
            // Language names
            languages: {
                en: "Англійська",
                uk: "Українська"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
