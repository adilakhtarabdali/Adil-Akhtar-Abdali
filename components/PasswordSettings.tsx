
import React, { useState } from 'react';

interface PasswordSettingsProps {
    onChangePassword: (current: string, newPass: string) => Promise<boolean>;
}

const PasswordSettings: React.FC<PasswordSettingsProps> = ({ onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }

        setIsSaving(true);
        const wasChanged = await onChangePassword(currentPassword, newPassword);

        if (wasChanged) {
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError('Incorrect current password.');
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold font-serif text-brand-dark mb-4">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700 mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md" role="alert">
                        <p className="font-bold">{success}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:bg-gray-400 transition duration-300"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default PasswordSettings;
