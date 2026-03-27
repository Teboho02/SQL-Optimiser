"use client";

import React, { useState } from "react";
import QueryAnalysisHeader from "./QueryAnalysisHeader/QueryAnalysisHeader";
import QueryEditorPanel from "./QueryEditorPanel/QueryEditorPanel";
import ResultsPanel from "./ResultsPanel/ResultsPanel";
import { useStyles } from "./style/styles";

/** Query Analysis page — paste SQL, trigger analysis, view optimisation results. */
export default function QueryAnalysisPage(): React.JSX.Element {
    const { styles } = useStyles();
    const [sqlText, setSqlText] = useState<string>("");
    const [intentText, setIntentText] = useState<string>("");
    const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
    const [hasResults, setHasResults] = useState<boolean>(false);

    const handleAnalyse = (): void => {
        if (!sqlText.trim()) { return; }
        setIsAnalysing(true);
        setHasResults(false);
        // todo: call backend analysis API and set results
        setTimeout(() => {
            setIsAnalysing(false);
            setHasResults(false);
        }, 1500);
    };

    const handleFormat = (): void => {
        // todo: format SQL via backend or local formatter
    };

    const handleClear = (): void => {
        setSqlText("");
        setIntentText("");
        setHasResults(false);
    };

    return (
        <>
            <QueryAnalysisHeader onAnalyse={handleAnalyse} isAnalysing={isAnalysing} />
            <div className={styles.panelsRow}>
                <QueryEditorPanel
                    sqlText={sqlText}
                    onSqlChange={setSqlText}
                    intentText={intentText}
                    onIntentChange={setIntentText}
                    onFormat={handleFormat}
                    onClear={handleClear}
                />
                <ResultsPanel isAnalysing={isAnalysing} hasResults={hasResults} />
            </div>
        </>
    );
}
