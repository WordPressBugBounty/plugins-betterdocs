import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostsLoader = () => {
  return (
    <div className="betterdocs-loading">
      <ul className="betterdocs-recent-docs-list">
        {[...Array(5)].map((_, index) => (
          <li key={index} className="betterdocs-recent-docs-list-items">
				<Skeleton
					count={1}
					borderRadius="4px"
					height={'18px'}
					width={'200px'}
					className="recent-docs-title grid-loader-inner-child"
				/>
				<Skeleton
					count={1}
					borderRadius="4px"
					height={'18px'}
					width={'80px'}
					className="recent-docs-tag grid-loader-inner-child"
				/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsLoader;
