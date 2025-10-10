import React from 'react'
import { MdQrCode2, MdInfo, MdHelp } from 'react-icons/md'
import config from '../../app-config'

export default function MainFooter () {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <MdQrCode2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white uppercase tracking-wider">Simple QR</h3>
                                <p className="text-sm text-gray-400">Get your QR codes in seconds</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            A free and open-source QR code generator built by <a href="https://www.linkedin.com/in/aamuelchua/">@aamuelchua</a> and powered by <a href={config.company.contact.website}>{config.company.name}</a>. No ads, no sign ups, no more paying for a service that is literally free.
                        </p>
                        <p className="text-xs text-gray-500">
                            Privacy-focused • No data collection • Open source
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <MdInfo className="h-4 w-4" />
                            Features
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Multiple QR code types</li>
                            <li>• Custom colors & logos</li>
                            <li>• High resolution export</li>
                            <li>• Mobile responsive</li>
                            <li>• No registration required</li>
                            <li>• Privacy focused</li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <MdHelp className="h-4 w-4" />
                            Support
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button 
                                    onClick={() => scrollToSection('features')} 
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Features
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => scrollToSection('about')} 
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    About
                                </button>
                            </li>
                            <li>
                                <a 
                                    href={config.company.social.github} 
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a 
                                    href={`mailto:${config.company.contact.email}`} 
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    Contact us
                                </a>
                            </li>
                            <li>
                                <a 
                                    href={`${config.company.contact.website}`}
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    About OurCodeLab
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                        <div className="text-center md:text-left">
                            <div>© {new Date().getFullYear()} Simple QR. Literally free with no ads and no sign up</div>
                        </div>
                        <div className="mt-2 md:mt-0 text-center md:text-right">
                            <span className="text-xs">Powered by <a href={config.company.contact.website}>{config.company.name}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
