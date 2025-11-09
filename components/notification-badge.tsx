interface NotificationBadgeProps {
	count: number
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
	if (count === 0) return null

	return (
		<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
			{count > 9 ? "9+" : count}
		</span>
	)
}

