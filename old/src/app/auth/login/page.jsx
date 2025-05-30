"use client";
import {GalleryVerticalEnd} from "lucide-react";
import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

import {LoginForm} from "./login-form"; // Assuming LoginForm is in the same directory
import {ModeToggle} from "@/components/shared/ModeToggle";

export default function LoginPage() {
    const { resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Get the appropriate image source based on theme
    const getImageSource = () => {
        return resolvedTheme === 'dark' ? "/login_dark.png" : "/login_light.png";
    };

    // Show skeleton while theme is loading
    const renderImageSection = () => {
        if (!isMounted) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-muted-foreground/10 rounded-2xl animate-pulse flex items-center justify-center">
                        <div className="w-20 h-20 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                    </div>
                </div>
            );
        }

        return (
            <img
                src={getImageSource()}
                alt="Login"
                className="w-full h-full max-w-full max-h-full object-contain object-center rounded-2xl"
            />
        );
    };

    return (
        <div className="grid min-h-svh p-5 lg:grid-cols-5"> {/* Changed to 5 columns for 60/40 split */}
            {/* Image Section - Takes 3 out of 5 columns (60%) on large screens */}
            <div
                className="bg-muted rounded-2xl hidden lg:flex lg:col-span-3 items-center justify-center p-4 min-h-0"> {/* Added min-h-0 to allow flex shrinking */}
                {renderImageSection()}
            </div>

            {/* Form Section - Takes 2 out of 5 columns (40%) on large screens */}
            <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-2"> {/* Added lg:col-span-2 */}
                <div className="flex justify-between items-center">
                    <a href="#"
                       className="flex items-center gap-2 font-medium text-lg"> {/* Increased font size slightly */}
                        <div
                            className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md"> {/* Slightly larger icon background */}
                            <GalleryVerticalEnd className="size-5"/> {/* Slightly larger icon */}
                        </div>
                        Educasoft
                    </a>
                    <ModeToggle/>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    {/* Adjusted max-w-xs to max-w-sm for a slightly wider form area if needed, or keep as is */}
                    <div className="w-full max-w-sm"> {/* Optionally changed from max-w-xs */}
                        <LoginForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}