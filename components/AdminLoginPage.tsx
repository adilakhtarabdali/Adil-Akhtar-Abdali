
import React, { useState } from 'react';
import type { Role } from '../types';

interface AdminLoginPageProps {
    onLogin: (password: string, role: Role) => Promise<boolean>;
}

const roles: { id: Role; label: string }[] = [
    { id: 'Manager', label: 'Manager' },
    { id: 'Kitchen', label: 'Kitchen' },
    { id: 'Cashier', label: 'Cashier' },
];

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole || isLoggingIn) {
            setError('Please select your role.');
            return;
        }
        setIsLoggingIn(true);
        setError('');

        const success = await onLogin(password, selectedRole);
        
        if (!success) {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
        setIsLoggingIn(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-full max-w-xs text-center">
                <h2 className="text-2xl font-bold font-serif text-brand-dark mb-6">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">Select Your Role</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map(role => (
                                <button
                                    type="button"
                                    key={role.id}
                                    onClick={() => {
                                        setSelectedRole(role.id);
                                        if (error) setError('');
                                    }}
                                    className={`p-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                        selectedRole === role.id 
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg' 
                                        : 'bg-white text-brand-dark border-gray-300 hover:bg-brand-light'
                                    }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            autoFocus
                        />
                    </div>
                     {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={!selectedRole || isLoggingIn}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-full shadow-lg hover:opacity-90 transition-transform duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
