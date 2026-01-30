'use client';

import React from 'react';
import styles from './TermsOfService.module.css';

interface TermsOfServiceProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Terms and Conditions</h2>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                </div>
                <div className={styles.content}>
                    <h3>1. Introduction</h3>
                    <p>Welcome to BiBudget. By creating an account, you agree to these Terms and Conditions.</p>

                    <h3>2. Privacy Policy</h3>
                    <p>We respect your privacy. Your data is stored securely and is only used to provide the expense tracking service. We do not sell your data to third parties.</p>

                    <h3>3. User Responsibilities</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

                    <h3>4. Service Usage</h3>
                    <p>This service is provided "as is". We reserve the right to modify or discontinue the service at any time.</p>

                    <h3>5. Governing Law</h3>
                    <p>These terms shall be governed by and construed in accordance with the laws of your jurisdiction.</p>
                </div>
                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.acceptButton}>Close</button>
                </div>
            </div>
        </div>
    );
}
