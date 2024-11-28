import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, UserRole } from '../../models';
import { CategoriesManagement, CommentsManagement, PostsManagement } from '..';

interface AdminDashboardProps {
    currentUser: User | null;
}

type ActiveTab = 'posts' | 'comments' | 'categories';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('posts');

    if (currentUser?.role != UserRole.ADMIN) {
        return <Navigate to="/" replace />;
    }

    const tabs: { id: ActiveTab; label: string }[] = [
        { id: 'posts', label: 'Posts' },
        { id: 'comments', label: 'Comments' },
        { id: 'categories', label: 'Categories' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <PostsManagement currentUser={currentUser} />;
            case 'comments':
                return <CommentsManagement currentUser={currentUser} />;
            case 'categories':
                return <CategoriesManagement />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-2 px-4" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  py-4 px-6 text-sm font-medium border-b-2 -mb-px transition-colors
                  ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
