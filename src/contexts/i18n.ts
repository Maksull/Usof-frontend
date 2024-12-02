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
                switchToDark: "Switch to dark mode",
                switchToLight: "Switch to light mode",
                goToProfile: "Go to profile",
                adminPanel: "Admin Panel",
                profileSettings: "Profile Settings",
                myPosts: "My Posts",
                myComments: "My Comments",
                roles: {
                    admin: "Administrator",
                    user: "User"
                }
            },
            // Footer translations
            footer: {
                allRightsReserved: "All rights reserved",
                description: "Your best resource for asking and answering technical questions. Share knowledge with the community and grow together.",
            },
            profile: {
                // Success messages
                updateSuccess: "Profile updated successfully!",
                imageUpdateSuccess: "Profile image updated successfully!",
                emailChangeInstructions: "Email change instructions have been sent to your email.",
                passwordChangeInstructions: "Password reset instructions have been sent to your email.",

                // Error messages
                updateError: "Failed to update profile",
                imageUpdateError: "Failed to update profile picture",
                emailChangeError: "Failed to send change email message",
                passwordChangeError: "Failed to send reset email",

                // Form labels
                username: "Username",
                fullName: "Full Name",
                email: "Email",
                role: "Role",
                rating: "Rating",

                // Buttons
                editProfile: "Edit Profile",
                uploadImage: "Upload profile image",
                changeEmail: "Change Email",
                changePassword: "Change Password",

                // Stats
                posts: "Posts",
                comments: "Comments",

                // User roles
                roles: {
                    admin: "Administrator",
                    moderator: "Moderator",
                    user: "User"
                }
            },
            userComments: {
                title: "My Comments",
                subtitle: "Showing your comments across all posts",
                noComments: "You haven't made any comments yet",
                noCommentsWithFilters: "No comments found with the selected filters",
                errors: {
                    loadFailed: "Failed to load comments",
                    deleteFailed: "Failed to delete comment"
                },
                deleteModal: {
                    title: "Delete Comment",
                    description: "Are you sure you want to delete this comment? This action cannot be undone. All replies and reactions to this comment will also be deleted.",
                    confirmButton: "Delete Comment",
                    cancelButton: "Cancel"
                }
            },
            comments: {
                sort: {
                    label: "Sort comments",
                    latest: "Latest",
                    oldest: "Oldest",
                    mostLiked: "Most Liked",
                    leastLiked: "Least Liked",
                    mostReplies: "Most Replies",
                    leastReplies: "Least Replies"
                },
                filter: {
                    searchLabel: "Search comments by post title",
                    searchPlaceholder: "Search by post title",
                    dateRange: "Date Range",
                    startDate: "Start date",
                    endDate: "End date",
                    to: "to",
                    resetAll: "Reset All Filters"
                },
                delete: "Delete",
                deleting: "Deleting...",
                deleteError: "Failed to delete comment",
                deleteConfirmTitle: "Delete Comment",
                deleteConfirmMessage: "Are you sure you want to delete this comment? This action cannot be undone.",
                confirmDelete: "Delete",
                unknownUser: "unknown",
                replyingTo: "Replying to @{{username}}",
                likeComment: "Like comment",
                dislikeComment: "Dislike comment",
                reply: "Reply",
                replies_one: "{{count}} reply",
                replies_other: "{{count}} replies",
                replyPlaceholder: "Write a reply...",
                posting: "Posting...",
                postReply: "Post Reply",
                title: "Comments",
                count: "{{count}} comment",
                count_plural: "{{count}} comments",
                placeholder: "Share your thoughts...",
                writeComment: "Write a comment",
                submitComment: "Submit comment",
                noComments: "No comments yet",
                errors: {
                    postFailed: "Failed to post comment"
                }
            },
            commentCard: {
                viewPost: "View post: {{title}}",
                deleteComment: "Delete comment",
                replyingTo: "Replying to @{{username}}",
                likes: "{{count}} like",
                likes_plural: "{{count}} likes",
                dislikes: "{{count}} dislike",
                dislikes_plural: "{{count}} dislikes"
            },
            changeEmail: {
                title: "Change Email Address",
                newEmailLabel: "New Email Address",
                newEmailPlaceholder: "Enter new email address",
                submitButton: "Change Email",
                changingEmail: "Changing Email...",
                successMessage: "Email successfully changed! Redirecting to login...",
                infoMessage: "After changing your email address, you'll be logged out and need to sign in again with your new email address.",
                errors: {
                    generic: "Failed to change email",
                    invalidEmail: "Please enter a valid email address",
                    emailInUse: "This email address is already in use",
                    serverError: "Server error while changing email address",
                    networkError: "Network error. Please check your connection"
                }
            },
            changePassword: {
                title: "Change Password",
                currentPasswordLabel: "Current Password",
                currentPasswordPlaceholder: "Enter current password",
                newPasswordLabel: "New Password",
                newPasswordPlaceholder: "Enter new password",
                confirmPasswordLabel: "Confirm New Password",
                confirmPasswordPlaceholder: "Confirm new password",
                submitButton: "Change Password",
                changingPassword: "Changing Password...",
                successMessage: "Password successfully changed! Redirecting to login...",
                errors: {
                    passwordMismatch: "New passwords do not match",
                    passwordMismatchDetails: "Please ensure both new password fields match",
                    passwordTooShort: "New password is too short",
                    passwordTooShortDetails: "Password must be at least 6 characters long",
                    serverError: "Server error while changing password",
                    generic: "Failed to change password"
                }
            },
            password: {
                showPassword: "Show password",
                hidePassword: "Hide password"
            },
            userPosts: {
                title: "My Posts",
                subtitle: "Manage and view all your posts",
                noPosts: "You haven't created any posts yet",
                errors: {
                    loadFailed: "Failed to load posts",
                    deleteFailed: "Failed to delete post"
                }
            },
            common: {
                cancel: "Cancel",
                saving: "Saving...",
                saveChanges: "Save Changes",
                backToHome: "Back to Home",
                retry: "Retry",
                delete: "Delete",
            },
            posts: {
                sort: {
                    label: "Sort posts",
                    latest: "Latest",
                    oldest: "Oldest",
                    mostLiked: "Most Liked",
                    leastLiked: "Least Liked",
                    mostCommented: "Most Commented",
                    leastCommented: "Least Commented",
                    titleAZ: "Title A-Z",
                    titleZA: "Title Z-A"
                },
                search: {
                    label: "Search posts",
                    placeholder: "Search posts..."
                },
                dateRange: {
                    title: "Date Range",
                    startDate: "Start Date",
                    endDate: "End Date",
                    to: "to",
                    clear: "Clear"
                },
                categories: {
                    title: "Categories",
                    selected: "({{count}} selected)",
                    loading: "Loading...",
                    loadMore: "Load More Categories"
                },
                filters: {
                    resetAll: "Reset All Filters"
                }
            },
            auth: {
                login: {
                    title: "Welcome Back",
                    subtitle: "Sign in to continue to your account"
                },
                register: {
                    title: "Create Account",
                    subtitle: "Sign up to get started with your new account",
                    verificationSent: "Verification code has been sent to your email",
                    verificationSuccess: "Email verified successfully!",
                    verificationFailed: "Email verification failed",
                    resendCode: "Resend Code",
                    codeResent: "Verification code has been resent",
                    awaitingVerification: "Please check your email for verification code"
                },
                form: {
                    usernamePlaceholder: "Username",
                    passwordPlaceholder: "Password",
                    emailPlaceholder: "Email",
                    fullNamePlaceholder: "Full Name",
                    verificationCodePlaceholder: "Enter verification code",
                    creatingAccount: "Creating Account...",
                    signingIn: "Signing In...",
                    verifying: "Verifying...",
                    verify: "Verify Email",
                    createAccount: "Create Account",
                    signIn: "Sign In",
                    alreadyHaveAccount: "Already have an account? Sign in",
                    needAccount: "Need an account? Register",
                    resendCodeTimer: "Resend code in {{seconds}}s"
                },
                errors: {
                    generic: "Authentication failed",
                    loginFailed: "Login failed. Please check your credentials and try again",
                    registrationFailed: "Registration failed. Please try again",
                    verificationFailed: "Verification failed. Please try again",
                    codeSendFailed: "Failed to send verification code",
                    codeExpired: "Verification code has expired",
                    codeInvalid: "Invalid verification code",
                    userExists: "User with this username or email already exists",
                    invalidCredentials: "Invalid username or password",
                    networkError: "Network error. Please check your connection",
                    validationError: "Please check your input and try again",
                    serverError: "Server error. Please try again later",
                    passwordRequirements: {
                        length: "Password must be at least 8 characters long",
                        uppercase: "Password must contain at least one uppercase letter",
                        lowercase: "Password must contain at least one lowercase letter",
                        number: "Password must contain at least one number",
                        combined: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                    }
                }
            },
            admin: {
                tabs: {
                    posts: "Posts",
                    comments: "Comments",
                    categories: "Categories",
                    users: "Users"
                },
                accessibility: {
                    tabsNavigation: "Admin dashboard navigation",
                    selectTab: "Select {{tab}} tab"
                }
            },
            categories: {
                title: "Categories Management",
                loading: "Loading categories...",
                count: "{{count}} Categories",
                confirmDelete: "Are you sure you want to delete this category?",
                form: {
                    createTitle: "Create New Category",
                    editTitle: "Edit Category",
                    titleLabel: "Title",
                    descriptionLabel: "Description",
                    addButton: "Add Category",
                    updateButton: "Update Category"
                },
                actions: {
                    edit: "Edit category",
                    delete: "Delete category"
                },
                errors: {
                    loadFailed: "Failed to load categories",
                    saveFailed: "Failed to save category",
                    deleteFailed: "Failed to delete category"
                }
            },
            commentsManagement: {
                title: "Comments Management",
                totalCount: "{{count}} total",
                totalCount_plural: "{{count}} total",
                noCommentsFound: "No comments found with the selected filters",
                deleteModal: {
                    title: "Delete Comment",
                    description: "Are you sure you want to delete this comment? This action cannot be undone. All replies and reactions to this comment will also be deleted.",
                    confirmButton: "Delete Comment"
                },
                errors: {
                    loadFailed: "Failed to load comments",
                    deleteFailed: "Failed to delete comment"
                }
            },
            postsManagement: {
                title: "Posts Management",
                totalCount: "{{count}} total",
                totalCount_plural: "{{count}} total",
                errors: {
                    loadFailed: "Failed to load posts",
                    deleteFailed: "Failed to delete post"
                }
            },
            usersManagement: {
                title: "Users Management",
                table: {
                    user: "User",
                    role: "Role",
                    stats: "Activity",
                    actions: "Actions"
                },
                stats: "{{posts}} posts, {{comments}} comments",
                confirmDelete: "Are you sure you want to delete this user? This action cannot be undone.",
                errors: {
                    loadFailed: "Failed to load users",
                    updateFailed: "Failed to update user role",
                    deleteFailed: "Failed to delete user"
                },
                deleteModal: {
                    title: "Delete User",
                    description: "Are you sure you want to delete this user? This action cannot be undone. All posts and comments by this user will remain.",
                    confirmButton: "Delete User"
                }
            },
            pagination: {
                firstPage: "First page",
                previousPage: "Previous page",
                nextPage: "Next page",
                lastPage: "Last page",
                pageNumber: "Page {{page}}"
            },
            mainPage: {
                title: "Recent Posts",
                postsFound: "{{count}} posts found{{inCategories}}",
                inSelectedCategories: " in selected categories",
                createPost: "Create Post",
                createFirstPost: "Create First Post",
                empty: {
                    title: "No posts found",
                    withFilters: "Try selecting different categories or clearing the filters",
                    noFilters: "Get started by creating your first post"
                },
                error: {
                    title: "Error Loading Posts",
                    tryAgain: "Try Again"
                },
                errors: {
                    loadFailed: "Failed to load posts"
                }
            },
            createPost: {
                title: "Create New Post",
                backToPosts: "Back to Posts",
                form: {
                    title: "Title",
                    titlePlaceholder: "Enter an engaging title...",
                    content: "Content",
                    contentPlaceholder: "Write your post content...",
                    categories: "Categories",
                    coverImage: "Cover Image",
                    uploadFile: "Upload a file",
                    orDragDrop: "or drag and drop",
                    imageRequirements: "PNG, JPG, or GIF up to 5MB",
                    imagePreview: "Image preview",
                    creating: "Creating...",
                    create: "Create Post"
                },
                errors: {
                    fetchCategories: "Failed to fetch categories",
                    invalidFileType: "Invalid file type. Only JPEG, PNG and GIF are allowed",
                    fileTooLarge: "File is too large. Maximum size is 5MB",
                    createFailed: "Failed to create post. Please try again."
                }
            },
            post: {
                backToPosts: "Back to posts",
                editPost: "Edit Post",
                unknownAuthor: "Unknown Author",
                commentsCount: "{{count}} comments",
                commentsCount_plural: "{{count}} comments",
                loadingError: "Error Loading Post",
                notFound: "Post not found",
                returnHome: "Return Home",
                viewFullImage: "View Full Image",
                closeFullImage: "Close",
                swipeToClose: "Swipe down to close",
                actions: {
                    like: "Like post",
                    dislike: "Dislike post",
                    share: "Share post"
                },
                form: {
                    title: "Title",
                    content: "Content",
                    categories: "Categories",
                    image: "Image",
                    imageMaxSize: "Maximum file size: 5MB. Leave empty to keep the current image.",
                    saveChanges: "Save Changes",
                    saving: "Saving...",
                    cancel: "Cancel",
                    imageInputLabel: "Upload post image"
                },
                comments: {
                    title: "Comments",
                    placeholder: "Share your thoughts...",
                    posting: "Posting...",
                    post: "Post comment"
                },
                errors: {
                    loadFailed: "Failed to load post",
                    loadingError: "Error Loading Post",
                    notFound: "Post not found",
                    updateFailed: "Failed to update post. Please try again.",
                    likeFailed: "Failed to update like status",
                    commentFailed: "Failed to post comment",
                    fileTooLarge: "Image file is too large",
                    fileTypeInvalid: "Invalid image file type",
                    imageUploadFailed: "Failed to upload image",
                    titleRequired: "Title is required",
                    contentRequired: "Content is required",
                    serverError: "Server error occurred while saving post"
                }
            },
            error: {
                title: "An Error Occurred",
                code: "Error Code",
                retry: "Retry",
                close: "Close",
                unknownError: "An unknown error occurred",
                tryAgain: "Please try again later",
                networkError: "Network connection error",
                validationError: "Please check your input",
                serverError: "Server error occurred"
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
                switchToDark: "Перемкнути на темний режим",
                switchToLight: "Перемкнути на світлий режим",
                goToProfile: "Перейти до профілю",
                adminPanel: "Панель адміністратора",
                profileSettings: "Налаштування профілю",
                myPosts: "Мої дописи",
                myComments: "Мої коментарі",
                roles: {
                    admin: "Адміністратор",
                    user: "Користувач"
                }
            },
            // Footer translations
            footer: {
                allRightsReserved: "Всі права захищені",
                description: "Ваш найкращий ресурс для запитань та відповідей на технічні питання. Діліться знаннями зі спільнотою та розвивайтеся разом.",
            },
            profile: {
                // Success messages
                updateSuccess: "Профіль успішно оновлено!",
                imageUpdateSuccess: "Зображення профілю успішно оновлено!",
                emailChangeInstructions: "Інструкції щодо зміни електронної пошти надіслано на вашу адресу.",
                passwordChangeInstructions: "Інструкції щодо скидання пароля надіслано на вашу електронну пошту.",

                // Error messages
                updateError: "Не вдалося оновити профіль",
                imageUpdateError: "Не вдалося оновити зображення профілю",
                emailChangeError: "Не вдалося надіслати повідомлення про зміну електронної пошти",
                passwordChangeError: "Не вдалося надіслати електронний лист для скидання",

                // Form labels
                username: "Ім'я користувача",
                fullName: "Повне ім'я",
                email: "Електронна пошта",
                role: "Роль",
                rating: "Рейтинг",

                // Buttons
                editProfile: "Редагувати профіль",
                uploadImage: "Завантажити зображення профілю",
                changeEmail: "Змінити електронну пошту",
                changePassword: "Змінити пароль",

                // Stats
                posts: "Дописи",
                comments: "Коментарі",

                // User roles
                roles: {
                    admin: "Адміністратор",
                    moderator: "Модератор",
                    user: "Користувач"
                }
            },
            userComments: {
                title: "Мої коментарі",
                subtitle: "Показано ваші коментарі до всіх дописів",
                noComments: "Ви ще не залишили жодного коментаря",
                noCommentsWithFilters: "Не знайдено коментарів за вибраними фільтрами",
                errors: {
                    loadFailed: "Не вдалося завантажити коментарі",
                    deleteFailed: "Не вдалося видалити коментар"
                },
                deleteModal: {
                    title: "Видалити коментар",
                    description: "Ви впевнені, що хочете видалити цей коментар? Цю дію неможливо скасувати. Усі відповіді та реакції на цей коментар також будуть видалені.",
                    confirmButton: "Видалити коментар",
                    cancelButton: "Скасувати"
                }
            },
            comments: {
                sort: {
                    label: "Сортувати коментарі",
                    latest: "Найновіші",
                    oldest: "Найстаріші",
                    mostLiked: "Найбільш вподобані",
                    leastLiked: "Найменш вподобані",
                    mostReplies: "Найбільше відповідей",
                    leastReplies: "Найменше відповідей"
                },
                filter: {
                    searchLabel: "Пошук коментарів за назвою допису",
                    searchPlaceholder: "Пошук за назвою допису",
                    dateRange: "Діапазон дат",
                    startDate: "Початкова дата",
                    endDate: "Кінцева дата",
                    to: "до",
                    resetAll: "Скинути всі фільтри"
                },
                delete: "Видалити",
                deleting: "Видалення...",
                deleteError: "Не вдалося видалити коментар",
                deleteConfirmTitle: "Видалити коментар",
                deleteConfirmMessage: "Ви впевнені, що хочете видалити цей коментар? Цю дію неможливо скасувати.",
                confirmDelete: "Видалити",
                unknownUser: "невідомий",
                replyingTo: "Відповідь для @{{username}}",
                likeComment: "Вподобати коментар",
                dislikeComment: "Не вподобати коментар",
                reply: "Відповісти",
                replies_one: "{{count}} відповідь",
                replies_few: "{{count}} відповіді",
                replies_many: "{{count}} відповідей",
                replyPlaceholder: "Написати відповідь...",
                posting: "Публікація...",
                postReply: "Опублікувати відповідь",
                title: "Коментарі",
                count: "{{count}} коментар",
                count_few: "{{count}} коментарі",
                count_many: "{{count}} коментарів",
                placeholder: "Поділіться своїми думками...",
                writeComment: "Написати коментар",
                submitComment: "Надіслати коментар",
                noComments: "Коментарів ще немає",
                errors: {
                    postFailed: "Не вдалося опублікувати коментар"
                }
            },
            commentCard: {
                viewPost: "Переглянути допис: {{title}}",
                deleteComment: "Видалити коментар",
                replyingTo: "Відповідь для @{{username}}",
                likes_one: "{{count}} вподобання",
                likes_few: "{{count}} вподобання",
                likes_many: "{{count}} вподобань",
                dislikes_one: "{{count}} невподобання",
                dislikes_few: "{{count}} невподобання",
                dislikes_many: "{{count}} невподобань"
            },
            changeEmail: {
                title: "Змінити електронну адресу",
                newEmailLabel: "Нова електронна адреса",
                newEmailPlaceholder: "Введіть нову електронну адресу",
                submitButton: "Змінити email",
                changingEmail: "Зміна email...",
                successMessage: "Email успішно змінено! Перенаправлення на сторінку входу...",
                infoMessage: "Після зміни електронної адреси вам потрібно буде вийти з системи та увійти знову з новою адресою.",
                errors: {
                    generic: "Не вдалося змінити електронну адресу",
                    invalidEmail: "Будь ласка, введіть дійсну електронну адресу",
                    emailInUse: "Ця електронна адреса вже використовується",
                    serverError: "Помилка сервера під час зміни електронної адреси",
                    networkError: "Помилка мережі. Перевірте підключення"
                }
            },
            changePassword: {
                title: "Змінити пароль",
                currentPasswordLabel: "Поточний пароль",
                currentPasswordPlaceholder: "Введіть поточний пароль",
                newPasswordLabel: "Новий пароль",
                newPasswordPlaceholder: "Введіть новий пароль",
                confirmPasswordLabel: "Підтвердження нового пароля",
                confirmPasswordPlaceholder: "Підтвердіть новий пароль",
                submitButton: "Змінити пароль",
                changingPassword: "Зміна пароля...",
                successMessage: "Пароль успішно змінено! Перенаправлення на сторінку входу...",
                errors: {
                    passwordMismatch: "Нові паролі не співпадають",
                    passwordMismatchDetails: "Будь ласка, переконайтеся, що обидва поля нового пароля співпадають",
                    passwordTooShort: "Новий пароль закороткий",
                    passwordTooShortDetails: "Пароль повинен містити щонайменше 6 символів",
                    serverError: "Помилка сервера під час зміни пароля",
                    generic: "Не вдалося змінити пароль"
                }
            },
            password: {
                showPassword: "Показати пароль",
                hidePassword: "Приховати пароль"
            },
            userPosts: {
                title: "Мої дописи",
                subtitle: "Керуйте та переглядайте всі свої дописи",
                noPosts: "Ви ще не створили жодного допису",
                errors: {
                    loadFailed: "Не вдалося завантажити дописи",
                    deleteFailed: "Не вдалося видалити допис"
                }
            },
            common: {
                backToHome: "Повернутися на головну",
                cancel: "Скасувати",
                saving: "Збереження...",
                saveChanges: "Зберегти зміни",
                retry: "Повторити",
                delete: "Видалити",
            },
            posts: {
                sort: {
                    label: "Сортувати дописи",
                    latest: "Найновіші",
                    oldest: "Найстаріші",
                    mostLiked: "Найбільш вподобані",
                    leastLiked: "Найменш вподобані",
                    mostCommented: "Найбільше коментарів",
                    leastCommented: "Найменше коментарів",
                    titleAZ: "Назва А-Я",
                    titleZA: "Назва Я-А"
                },
                search: {
                    label: "Пошук дописів",
                    placeholder: "Пошук дописів..."
                },
                dateRange: {
                    title: "Діапазон дат",
                    startDate: "Початкова дата",
                    endDate: "Кінцева дата",
                    to: "до",
                    clear: "Очистити"
                },
                categories: {
                    title: "Категорії",
                    selected: "(обрано: {{count}})",
                    loading: "Завантаження...",
                    loadMore: "Завантажити більше категорій"
                },
                filters: {
                    resetAll: "Скинути всі фільтри"
                }
            },
            auth: {
                login: {
                    title: "З поверненням",
                    subtitle: "Увійдіть, щоб продовжити роботу з вашим обліковим записом"
                },
                register: {
                    title: "Створити обліковий запис",
                    subtitle: "Зареєструйтеся, щоб розпочати роботу з новим обліковим записом",
                    verificationSent: "Код підтвердження надіслано на вашу електронну пошту",
                    verificationSuccess: "Електронну пошту підтверджено успішно!",
                    verificationFailed: "Помилка підтвердження електронної пошти",
                    resendCode: "Надіслати код повторно",
                    codeResent: "Код підтвердження надіслано повторно",
                    awaitingVerification: "Будь ласка, перевірте вашу електронну пошту для отримання коду підтвердження"
                },
                form: {
                    usernamePlaceholder: "Ім'я користувача",
                    passwordPlaceholder: "Пароль",
                    emailPlaceholder: "Електронна пошта",
                    fullNamePlaceholder: "Повне ім'я",
                    verificationCodePlaceholder: "Введіть код підтвердження",
                    creatingAccount: "Створення облікового запису...",
                    signingIn: "Вхід...",
                    verifying: "Перевірка...",
                    verify: "Підтвердити email",
                    createAccount: "Створити обліковий запис",
                    signIn: "Увійти",
                    alreadyHaveAccount: "Вже маєте обліковий запис? Увійти",
                    needAccount: "Потрібен обліковий запис? Зареєструватися",
                    resendCodeTimer: "Надіслати код повторно через {{seconds}}с"
                },
                errors: {
                    generic: "Помилка аутентифікації",
                    loginFailed: "Помилка входу. Перевірте свої дані та спробуйте ще раз",
                    registrationFailed: "Помилка реєстрації. Будь ласка, спробуйте ще раз",
                    verificationFailed: "Помилка підтвердження. Будь ласка, спробуйте ще раз",
                    codeSendFailed: "Не вдалося надіслати код підтвердження",
                    codeExpired: "Термін дії коду підтвердження закінчився",
                    codeInvalid: "Недійсний код підтвердження",
                    userExists: "Користувач з таким ім'ям або email вже існує",
                    invalidCredentials: "Невірне ім'я користувача або пароль",
                    networkError: "Помилка мережі. Перевірте підключення",
                    validationError: "Перевірте введені дані та спробуйте ще раз",
                    serverError: "Помилка сервера. Спробуйте пізніше",
                    passwordRequirements: {
                        length: "Пароль повинен містити щонайменше 8 символів",
                        uppercase: "Пароль повинен містити принаймні одну велику літеру",
                        lowercase: "Пароль повинен містити принаймні одну малу літеру",
                        number: "Пароль повинен містити принаймні одну цифру",
                        combined: "Пароль повинен містити щонайменше 8 символів, одну велику літеру, одну малу літеру та одну цифру"
                    }
                }
            },
            admin: {
                tabs: {
                    posts: "Дописи",
                    comments: "Коментарі",
                    categories: "Категорії",
                    users: "Користувачі"
                },
                accessibility: {
                    tabsNavigation: "Навігація панелі адміністратора",
                    selectTab: "Вибрати вкладку {{tab}}"
                }
            },
            categories: {
                title: "Управління категоріями",
                loading: "Завантаження категорій...",
                count: "{{count}} категорій",
                confirmDelete: "Ви впевнені, що хочете видалити цю категорію?",
                form: {
                    createTitle: "Створити нову категорію",
                    editTitle: "Редагувати категорію",
                    titleLabel: "Назва",
                    descriptionLabel: "Опис",
                    addButton: "Додати категорію",
                    updateButton: "Оновити категорію"
                },
                actions: {
                    edit: "Редагувати категорію",
                    delete: "Видалити категорію"
                },
                errors: {
                    loadFailed: "Не вдалося завантажити категорії",
                    saveFailed: "Не вдалося зберегти категорію",
                    deleteFailed: "Не вдалося видалити категорію"
                }
            },
            commentsManagement: {
                title: "Управління коментарями",
                totalCount: "{{count}} всього",
                totalCount_plural: "{{count}} всього",
                noCommentsFound: "Не знайдено коментарів за вибраними фільтрами",
                deleteModal: {
                    title: "Видалити коментар",
                    description: "Ви впевнені, що хочете видалити цей коментар? Цю дію неможливо скасувати. Усі відповіді та реакції на цей коментар також будуть видалені.",
                    confirmButton: "Видалити коментар"
                },
                errors: {
                    loadFailed: "Не вдалося завантажити коментарі",
                    deleteFailed: "Не вдалося видалити коментар"
                }
            },
            postsManagement: {
                title: "Управління дописами",
                totalCount: "{{count}} всього",
                totalCount_plural: "{{count}} всього",
                errors: {
                    loadFailed: "Не вдалося завантажити дописи",
                    deleteFailed: "Не вдалося видалити допис"
                }
            },
            usersManagement: {
                title: "Управління користувачами",
                table: {
                    user: "Користувач",
                    role: "Роль",
                    stats: "Активність",
                    actions: "Дії"
                },
                stats: "{{posts}} дописів, {{comments}} коментарів",
                confirmDelete: "Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо скасувати.",
                errors: {
                    loadFailed: "Не вдалося завантажити користувачів",
                    updateFailed: "Не вдалося оновити роль користувача",
                    deleteFailed: "Не вдалося видалити користувача"
                },
                deleteModal: {
                    title: "Видалити користувача",
                    description: "Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо скасувати. Всі дописи та коментарі користувача залишаться.",
                    confirmButton: "Видалити користувача"
                }
            },
            pagination: {
                firstPage: "Перша сторінка",
                previousPage: "Попередня сторінка",
                nextPage: "Наступна сторінка",
                lastPage: "Остання сторінка",
                pageNumber: "Сторінка {{page}}"
            },
            mainPage: {
                title: "Останні дописи",
                postsFound: "{{count}} дописів знайдено{{inCategories}}",
                inSelectedCategories: " у вибраних категоріях",
                createPost: "Створити допис",
                createFirstPost: "Створити перший допис",
                empty: {
                    title: "Дописів не знайдено",
                    withFilters: "Спробуйте вибрати інші категорії або очистити фільтри",
                    noFilters: "Почніть зі створення свого першого допису"
                },
                error: {
                    title: "Помилка завантаження дописів",
                    tryAgain: "Спробувати знову"
                },
                errors: {
                    loadFailed: "Не вдалося завантажити дописи"
                }
            },
            createPost: {
                title: "Створити новий допис",
                backToPosts: "Назад до дописів",
                form: {
                    title: "Назва",
                    titlePlaceholder: "Введіть привабливу назву...",
                    content: "Вміст",
                    contentPlaceholder: "Напишіть вміст вашого допису...",
                    categories: "Категорії",
                    coverImage: "Зображення обкладинки",
                    uploadFile: "Завантажити файл",
                    orDragDrop: "або перетягніть",
                    imageRequirements: "PNG, JPG або GIF до 5МБ",
                    imagePreview: "Попередній перегляд зображення",
                    creating: "Створення...",
                    create: "Створити допис"
                },
                errors: {
                    fetchCategories: "Не вдалося завантажити категорії",
                    invalidFileType: "Недійсний тип файлу. Дозволено лише JPEG, PNG та GIF",
                    fileTooLarge: "Файл занадто великий. Максимальний розмір 5МБ",
                    createFailed: "Не вдалося створити допис. Будь ласка, спробуйте ще раз."
                }
            },
            post: {
                backToPosts: "Назад до дописів",
                editPost: "Редагувати допис",
                unknownAuthor: "Невідомий автор",
                commentsCount: "{{count}} коментарів",
                commentsCount_plural: "{{count}} коментарів",
                loadingError: "Помилка завантаження допису",
                notFound: "Допис не знайдено",
                returnHome: "Повернутися на головну",
                viewFullImage: "Переглянути повне зображення",
                closeFullImage: "Закрити",
                swipeToClose: "Проведіть вниз, щоб закрити",
                actions: {
                    like: "Вподобати допис",
                    dislike: "Не вподобати допис",
                    share: "Поділитися дописом"
                },
                form: {
                    title: "Назва",
                    content: "Вміст",
                    categories: "Категорії",
                    image: "Зображення",
                    imageMaxSize: "Максимальний розмір файлу: 5МБ. Залиште порожнім, щоб зберегти поточне зображення.",
                    saveChanges: "Зберегти зміни",
                    saving: "Збереження...",
                    cancel: "Скасувати",
                    imageInputLabel: "Завантажити зображення допису"
                },
                comments: {
                    title: "Коментарі",
                    placeholder: "Поділіться своїми думками...",
                    posting: "Публікація...",
                    post: "Опублікувати коментар"
                },
                errors: {
                    loadFailed: "Не вдалося завантажити допис",
                    loadingError: "Помилка завантаження допису",
                    notFound: "Допис не знайдено",
                    updateFailed: "Не вдалося оновити допис. Спробуйте ще раз.",
                    likeFailed: "Не вдалося оновити статус вподобання",
                    commentFailed: "Не вдалося опублікувати коментар",
                    fileTooLarge: "Файл зображення занадто великий",
                    fileTypeInvalid: "Недійсний тип файлу зображення",
                    imageUploadFailed: "Не вдалося завантажити зображення",
                    titleRequired: "Назва є обов'язковою",
                    contentRequired: "Вміст є обов'язковим",
                    serverError: "Виникла помилка сервера під час збереження допису"
                }
            },
            error: {
                title: "Сталася помилка",
                code: "Код помилки",
                retry: "Повторити",
                close: "Закрити",
                unknownError: "Сталася невідома помилка",
                tryAgain: "Будь ласка, спробуйте пізніше",
                networkError: "Помилка підключення до мережі",
                validationError: "Перевірте введені дані",
                serverError: "Виникла помилка сервера"
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
