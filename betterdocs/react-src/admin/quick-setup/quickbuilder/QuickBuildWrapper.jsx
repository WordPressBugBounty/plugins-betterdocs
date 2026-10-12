import { addFilter } from "@wordpress/hooks";
import { BuilderProvider, useBuilder } from "quickbuilder";
import React, { useEffect, useState } from "react";
import Launch from "../fields/Launch";
import QuickBuild from "./QuickBuild";

const QuickBuildWrapper = (props) => {
    const builder = useBuilder(betterdocsQuickSetup);
    const [isLoading, setIsLoading] = useState(true);

    builder.values.is_pro_active = betterdocsQuickSetup?.is_pro_active;

    addFilter("btd_quick_build_launch", "betterdocs", (props) => (
        <Launch {...props} />
    ));

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <BuilderProvider value={{ ...builder, isLoading, setIsLoading }}>
            <QuickBuild isLoading={isLoading} />
        </BuilderProvider>
    );
};
export default QuickBuildWrapper;
