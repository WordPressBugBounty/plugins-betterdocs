import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import PostsLoader from './PostsLoader';

const RecentDocs = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentDocs = async () => {
            try {
                const response = await apiFetch({
                    path: "/wp/v2/docs?status=publish,draft,pending,future,private&per_page=5&orderby=date&order=desc"
                });
                setPosts(response);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecentDocs();
    }, []);

    const getStatusLabel = (status) => {
        const statusMap = {
            publish: { label: __('Published', 'betterdocs'), class: 'published' },
            future: { label: __('Scheduled', 'betterdocs'), class: 'scheduled' },
            draft: { label: __('Drafted', 'betterdocs'), class: 'drafted' },
            pending: { label: __('Pending', 'betterdocs'), class: 'pending' },
            private: { label: __('Private', 'betterdocs'), class: 'private' }
        };
        return statusMap[status] || { label: status, class: status };
    };

    const truncateTitle = (title) => {
        // Check if FAQ component is also displayed
        const hasFaqs = betterdocs_admin?.count_all_faq > 0;

        // Decode HTML entities (like &#8216; to ')
        const decodedTitle = document.createElement('textarea');
        decodedTitle.innerHTML = title;
        const cleanTitle = decodedTitle.value;

        // If no FAQs, display full title without truncation
        if (!hasFaqs) {
            return cleanTitle;
        }

        // Otherwise, truncate to 35 characters when both components are displayed
        const maxLength = 35;

        return cleanTitle.length > maxLength ?
            cleanTitle.substring(0, maxLength) + '..' :
            cleanTitle;
    };

    // Don’t render the wrapper if not loading and there are no posts
    if (!loading && posts.length === 0) {
        return null;
    }

    return (
		<div className="betterdocs-overview-col betterdocs-recent-col">
			<div className="betterdocs-recent-wrapper">
				<div className="betterdocs-recent-header">
					<div className="betterdocs-flex justify-content-space-between align-items-center">
						<div className="betterdocs-content-left">
							<h3 className="betterdocs-recent-title">
								{__('Recent Docs', 'betterdocs')}
							</h3>
						</div>
						<div className="betterdocs-content-right">
							<a
								href={betterdocs_admin.admin_url + `admin.php?page=betterdocs-admin`}
								className="betterdocs-view-all"
							>
								<span>{__('View All', 'betterdocs')}</span>
								<span>
									<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
										<g clipPath="url(#clip0_11456_29418)">
											<path d="M12.7539 5.25L5.25391 12.75" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M5.99609 5.25H12.7461V12" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</g>
										<defs>
											<clipPath id="clip0_11456_29418">
												<rect width="18" height="18" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</span>
							</a>
						</div>
					</div>
				</div>

				{loading ? (
					<PostsLoader />
				) : error ? (
					<div className="betterdocs-error">
						{__('Error:', 'betterdocs')} {error}
					</div>
				) : (
					<ul className="betterdocs-recent-docs-list">
						{posts.map(post => {
							const status = getStatusLabel(post.status);
							return (
								<li
									key={post.id}
									className="betterdocs-recent-docs-list-items"
								>
									<a href={betterdocs_admin.admin_url + `post.php?post=${post.id}&action=edit`}>
										<span className="recent-docs-title">
											{truncateTitle(post.title.rendered)}
										</span>
										<span className={`recent-docs-tag tag-${status.class}`}>
											{status.label}
										</span>
									</a>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
    );
};

export default RecentDocs;
