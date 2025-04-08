import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface DirectionalIconProps {
	leftIcon: React.ReactNode;
	rightIcon: React.ReactNode;
	className?: string;
	reverseInRtl?: boolean;
}

/**
 * DirectionalIcon component displays the appropriate directional icon based on the current language direction
 *
 * @param leftIcon - The icon to display for left direction in LTR mode
 * @param rightIcon - The icon to display for right direction in LTR mode
 * @param className - Optional CSS class names
 * @param reverseInRtl - Whether to reverse the icons in RTL mode (default: true)
 */
export function DirectionalIcon({
	leftIcon,
	rightIcon,
	className,
	reverseInRtl = true,
}: DirectionalIconProps) {
	const { isRTL } = useLanguage();

	// If reverseInRtl is true, swap the icons in RTL mode
	const iconToShow = reverseInRtl
		? isRTL
			? rightIcon
			: leftIcon
		: isRTL
		? leftIcon
		: rightIcon;

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center",
				className,
			)}>
			{iconToShow}
		</span>
	);
}

/**
 * A simpler version that just flips a single icon in RTL mode
 */
interface FlippableIconProps {
	icon: React.ReactNode;
	className?: string;
	flipInRtl?: boolean;
}

export function FlippableIcon({
	icon,
	className,
	flipInRtl = true,
}: FlippableIconProps) {
	const { isRTL } = useLanguage();

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center",
				flipInRtl && isRTL && "rtl-flip",
				className,
			)}>
			{icon}
		</span>
	);
}
