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
            {/* FIX: Tăng max-w-2xl lên max-w-4xl để khung rộng hơn (phóng to) */}
            <div className="container mx-auto px-4 max-w-4xl text-center">
                
                {/* FIX: Tăng kích thước chữ */}
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Get in touch</h2>
                
                <p className="text-gray-600 mb-8 text-lg">
                    Have a question, or just want to say hello? We'd love to hear from you!
                </p>

                {/* FIX: Tăng padding p-6 lên p-10 để form thoáng và to hơn */}
                <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                    <form ref={form} onSubmit={sendEmail} className="space-y-6 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    required
                                    // FIX: Tăng py-1.5 lên py-3 để ô input to hơn, font text-base
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-base"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="user_email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-base"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={5} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-base"
                                placeholder="Tell us what's on your mind..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-lg shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" /> Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8">
                    <p className="text-gray-600 mb-1 text-base">Or email us directly at:</p>
                    <a href="mailto:mysteremeal.official@gmail.com" className="text-orange-500 font-bold hover:underline text-lg">
                        mysteremeal.official@gmail.com
                    </a>
                </div>
            </div>
        </section>
    );
};