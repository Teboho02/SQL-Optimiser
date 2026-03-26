import React from "react";
import DatabasesHeader from "./DatabasesHeader/DatabasesHeader";
import ConnectionCardList from "./ConnectionCardList/ConnectionCardList";
import AddConnectionForm from "./AddConnectionForm/AddConnectionForm";

/** Databases page — view registered connections and add new ones. */
export default function DatabasesPage(): React.JSX.Element {
    return (
        <>
            <DatabasesHeader />
            <ConnectionCardList />
            <AddConnectionForm />
        </>
    );
}
