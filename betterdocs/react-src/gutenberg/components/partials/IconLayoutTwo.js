import FolderIcon from "../icons/FolderIcon";
import FolderOpenIcon from "../icons/FolderOpenIcon";

const IconLayoutTwo = ({icon, categoryIcon = 'folder'}) => {
    const renderIcon = () => {
        // If custom image is provided and categoryIcon is not 'custom', show image in folder wrapper
        if (icon && categoryIcon !== 'custom') {
            return <img className="betterdocs-category-folder-img" src={icon}/>;
        }

        // If custom image is provided and categoryIcon is 'custom', show just the image
        if (icon && categoryIcon === 'custom') {
            return <img alt="betterdocs-category-icon" className="betterdocs-category-icon-img" src={icon}/>;
        }

        // Show folder icons based on categoryIcon setting
        if (categoryIcon === 'folder-open') {
            return <FolderOpenIcon/>;
        }

        return <FolderIcon/>;
    };

    // For custom icons, don't wrap in folder span
    if (categoryIcon === 'custom') {
        return (
            <div className="betterdocs-category-icon">
                {renderIcon()}
            </div>
        );
    }

    // For folder icons, wrap in folder span with appropriate arrow class
    const arrowClass = categoryIcon === 'folder-open' ? 'arrow-down' : 'arrow-right';

    return (
        <div className="betterdocs-category-icon">
            <span className={`betterdocs-folder-icon toggle-arrow ${arrowClass}`}>
                {renderIcon()}
            </span>
        </div>
    );
}

export default IconLayoutTwo;
