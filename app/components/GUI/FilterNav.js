import React from 'react'

export default class FilterNav extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <nav className="main-filter">
                <button className="filter-babies">
                    Trier les bébés
                </button>
            </nav>
        );
    }
}
