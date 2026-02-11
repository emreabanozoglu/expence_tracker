'use client';

import React from 'react';

interface TermsOfServiceProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-base-100 w-full max-w-lg max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease-out]">
                <div className="p-6 border-b border-base-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-base-content m-0">Terms and Conditions</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-base-content"
                    >
                        <span className="text-xl leading-none">&times;</span>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-sm text-base-content/80 leading-relaxed space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-base-content mb-2 mt-0">1. Introduction</h3>
                        <p className="m-0">Welcome to Bibudget. By creating an account, you agree to these Terms and Conditions.</p>
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-base-content mb-2 mt-0">2. Privacy Policy</h3>
                        <p className="m-0">We respect your privacy. Your data is stored securely and is only used to provide the expense tracking service. We do not sell your data to third parties.</p>
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-base-content mb-2 mt-0">3. User Responsibilities</h3>
                        <p className="m-0">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-base-content mb-2 mt-0">4. Service Usage</h3>
                        <p className="m-0">This service is provided "as is". We reserve the right to modify or discontinue the service at any time.</p>
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-base-content mb-2 mt-0">5. Governing Law</h3>
                        <p className="m-0">These terms shall be governed by and construed in accordance with the laws of your jurisdiction.</p>
                    </div>
                </div>
                <div className="p-4 border-t border-base-200 flex justify-end">
                    <button onClick={onClose} className="btn btn-primary">Close</button>
                </div>
            </div>
        </div>
    );
}
