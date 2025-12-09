import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4" id="section-cards-container">
			<Card className="@container/card" id="total-revenue-card">
				<CardHeader id="total-revenue-card-header">
					<CardDescription id="total-revenue-text">
						Total Revenue
					</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" id="total-revenue-card-title">
						$1,250.00
					</CardTitle>
					<CardAction id="total-revenue-card-action">
						<Badge variant="outline" id="total-revenue-badge">
							<IconTrendingUp id="total-revenue-badge-icon" />
							<span id="total-revenue-badge-text">+12.5%</span>
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm" id="total-revenue-card-footer">
					<div className="line-clamp-1 flex gap-2 font-medium" id="total-revenue-footer-trend">
						<span id="total-revenue-footer-trend-text">Trending up this month</span> <IconTrendingUp className="size-4" id="total-revenue-footer-trend-icon" />
					</div>
					<div className="text-muted-foreground" id="total-revenue-footer-description">
						Visitors for the last 6 months
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card" id="new-customers-card">
				<CardHeader id="new-customers-card-header">
					<CardDescription id="new-customers-text">New Customers</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" id="new-customers-card-title">
						1,234
					</CardTitle>
					<CardAction id="new-customers-card-action">
						<Badge variant="outline" id="new-customers-badge">
							<IconTrendingDown id="new-customers-badge-icon" />
							<span id="new-customers-badge-text">-20%</span>
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm" id="new-customers-card-footer">
					<div className="line-clamp-1 flex gap-2 font-medium" id="new-customers-footer-trend">
						<span id="new-customers-footer-trend-text">Down 20% this period</span> <IconTrendingDown className="size-4" id="new-customers-footer-trend-icon" />
					</div>
					<div className="text-muted-foreground" id="new-customers-footer-description">
						Acquisition needs attention
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card" id="active-accounts-card">
				<CardHeader id="active-accounts-card-header">
					<CardDescription id="active-accounts-text">Active Accounts</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" id="active-accounts-card-title">
						45,678
					</CardTitle>
					<CardAction id="active-accounts-card-action">
						<Badge variant="outline" id="active-accounts-badge">
							<IconTrendingUp id="active-accounts-badge-icon" />
							<span id="active-accounts-badge-text">+12.5%</span>
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm" id="active-accounts-card-footer">
					<div className="line-clamp-1 flex gap-2 font-medium" id="active-accounts-footer-trend">
						<span id="active-accounts-footer-trend-text">Strong user retention</span> <IconTrendingUp className="size-4" id="active-accounts-footer-trend-icon" />
					</div>
					<div className="text-muted-foreground" id="active-accounts-footer-description">Engagement exceed targets</div>
				</CardFooter>
			</Card>
			<Card className="@container/card" id="growth-rate-card">
				<CardHeader id="growth-rate-card-header">
					<CardDescription id="growth-rate-text">Growth Rate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" id="growth-rate-card-title">
						4.5%
					</CardTitle>
					<CardAction id="growth-rate-card-action">
						<Badge variant="outline" id="growth-rate-badge">
							<IconTrendingUp id="growth-rate-badge-icon" />
							<span id="growth-rate-badge-text">+4.5%</span>
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm" id="growth-rate-card-footer">
					<div className="line-clamp-1 flex gap-2 font-medium" id="growth-rate-footer-trend">
						<span id="growth-rate-footer-trend-text">Steady performance increase</span> <IconTrendingUp className="size-4" id="growth-rate-footer-trend-icon" />
					</div>
					<div className="text-muted-foreground" id="growth-rate-footer-description">Meets growth projections</div>
				</CardFooter>
			</Card>
		</div>
	)
}
