import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Send, Loader } from 'lucide-react';

export const ContactSection: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const SERVICE_ID = 'service_2dlf3ji';   
        const TEMPLATE_ID = 'template_fr3bznc'; 
        const PUBLIC_KEY = '8Ty45m7SUWJYVnBlu';    

        if (form.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
                .then((result) => {
                    console.log(result.text);
                    alert("Message sent successfully!");
                    form.current?.reset(); 
                }, (error) => {
                    console.log(error.text);
                    alert("Failed to send message. Please try again.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <section className="w-full">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in touch</h2>
                <p className="text-gray-600 mb-8">
                    Have a question, or just want to say hello? We'd love to hear from you!
                </p>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form ref={form} onSubmit={sendEmail} className="space-y-6 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                name="user_name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="user_email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                placeholder="Tell us what's on your mind..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" /> Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8">
                    <p className="text-gray-600 mb-2">Or email us directly at:</p>
                    <a href="mailto:mysteremeal.official@gmail.com" className="text-orange-500 font-medium hover:underline">
                        mysteremeal.official@gmail.com
                    </a>
                </div>
            </div>
        </section>
    );
};