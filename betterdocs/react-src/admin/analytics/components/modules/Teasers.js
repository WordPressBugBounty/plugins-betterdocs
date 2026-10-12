import { __ } from "@wordpress/i18n";
import React from "react";
import LockedPreview from "./LockedPreview";
import {
    OverviewMock,
    AiTrafficMock,
    ArticlesMock,
    SearchMock,
    EngagementMock,
    FeedbackMock,
    LinksMock,
    AuthorsMock,
    SettingsMock
} from "./previews";

/* Per-route Pro teasers — each renders a real, design-accurate mock of the
   module blurred behind a frosted lock panel, so users see exactly what the
   upgrade unlocks. Used by the Free Dashboard for every route. */

export function OverviewTeaser() {
    return (
        <LockedPreview
            title={ __( "Analytics Overview is a Pro feature", "betterdocs" ) }
            subtitle={ __( "See your knowledge base at a glance — views, unique readers, searches, reactions, and your top content. BetterDocs keeps recording in the background, so your history is ready the moment you upgrade.", "betterdocs" ) }
            bullets={ [
                __( "Views, unique readers, searches & reactions KPIs", "betterdocs" ),
                __( "Top 10 articles and top search queries", "betterdocs" ),
                __( "Search trends and recent reader feedback", "betterdocs" )
            ] }
        >
            <OverviewMock />
        </LockedPreview>
    );
}

export function AiTrafficTeaser() {
    return (
        <LockedPreview
            title={ __( "Full AI Traffic analytics is a Pro feature", "betterdocs" ) }
            subtitle={ __( "See which AI agents read your docs, when, and what they fetch — with brand-recognized icons, trends, and per-page detail.", "betterdocs" ) }
            bullets={ [
                __( "Per-agent breakdown with brand icons", "betterdocs" ),
                __( "AI vs. human traffic trends over time", "betterdocs" ),
                __( "Most-fetched pages and activity heatmap", "betterdocs" )
            ] }
        >
            <AiTrafficMock />
        </LockedPreview>
    );
}

export function ArticlesTeaser() {
    return (
        <LockedPreview
            title={ __( "Docs Performance is a Pro feature", "betterdocs" ) }
            subtitle={ __( "Drill into each doc — views over time, helpfulness, reactions, and per-article trends.", "betterdocs" ) }
            bullets={ [
                __( "Views & unique readers per article", "betterdocs" ),
                __( "Helpfulness scores and reaction trends", "betterdocs" ),
                __( "Country breakdown & search sources", "betterdocs" )
            ] }
        >
            <ArticlesMock />
        </LockedPreview>
    );
}

export function SearchTeaser() {
    return (
        <LockedPreview
            title={ __( "Search Analytics is a Pro feature", "betterdocs" ) }
            subtitle={ __( "See what readers look for — trends over time, zero-result queries, and click-through to docs.", "betterdocs" ) }
            bullets={ [
                __( "Searches vs. zero-results over time", "betterdocs" ),
                __( "Top zero-result queries to fix content gaps", "betterdocs" ),
                __( "Exportable search reports", "betterdocs" )
            ] }
        >
            <SearchMock />
        </LockedPreview>
    );
}

export function EngagementTeaser() {
    return (
        <LockedPreview
            title={ __( "Reader Engagement is a Pro feature", "betterdocs" ) }
            subtitle={ __( "Understand who your readers are — geography, devices, and language reach.", "betterdocs" ) }
            bullets={ [
                __( "Country & device breakdown", "betterdocs" ),
                __( "Referrer sources and language reach", "betterdocs" ),
                __( "CSV exports for every view", "betterdocs" )
            ] }
        >
            <EngagementMock />
        </LockedPreview>
    );
}

export function FeedbackTeaser() {
    return (
        <LockedPreview
            title={ __( "Feedback Inbox is a Pro feature", "betterdocs" ) }
            subtitle={ __( "Every reader reaction, comment, and broken-link report in one place.", "betterdocs" ) }
            bullets={ [
                __( "Likes, dislikes & comments in one feed", "betterdocs" ),
                __( "Bulk status, filters, and exports", "betterdocs" ),
                __( "Tie feedback back to each article", "betterdocs" )
            ] }
        >
            <FeedbackMock />
        </LockedPreview>
    );
}

export function LinksTeaser() {
    return (
        <LockedPreview
            title={ __( "Link Health is a Pro feature", "betterdocs" ) }
            subtitle={ __( "Scan your knowledge base for broken links and redirects, with a triage inbox to fix them fast.", "betterdocs" ) }
            bullets={ [
                __( "Automated broken-link scanning", "betterdocs" ),
                __( "Redirect detection with status codes", "betterdocs" ),
                __( "Triage inbox to resolve issues fast", "betterdocs" )
            ] }
        >
            <LinksMock />
        </LockedPreview>
    );
}

export function AuthorsTeaser() {
    return (
        <LockedPreview
            title={ __( "Author Performance is a Pro feature", "betterdocs" ) }
            subtitle={ __( "Per-author views, helpfulness, and contribution metrics across your knowledge base.", "betterdocs" ) }
            bullets={ [
                __( "Docs & views per author", "betterdocs" ),
                __( "Helpfulness and reception scores", "betterdocs" ),
                __( "Spot your most effective contributors", "betterdocs" )
            ] }
        >
            <AuthorsMock />
        </LockedPreview>
    );
}

export function SettingsTeaser() {
    return (
        <LockedPreview
            title={ __( "Advanced analytics settings are Pro", "betterdocs" ) }
            subtitle={ __( "Cookieless tracking, MaxMind GeoIP, GA4 forwarding, and configurable retention windows. Analytics From, Unique Visitor Count and Exclude Bot Analytics are already in Free under BetterDocs → Settings, and Free keeps your analytics history with no time limit.", "betterdocs" ) }
            bullets={ [
                __( "Cookieless, privacy-first tracking", "betterdocs" ),
                __( "MaxMind GeoIP & GA4 forwarding", "betterdocs" ),
                __( "Configurable data-retention windows", "betterdocs" )
            ] }
        >
            <SettingsMock />
        </LockedPreview>
    );
}
