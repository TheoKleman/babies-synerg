import React from 'react'

export default class FilterNav extends React.Component {
    constructor() {
        super()
    }

    sorting() {
        if(!this.props.isSorting)
            this.props.setSorting(true)
        else 
            this.props.setSorting(false)
    }

    render() {
        return(
            <nav className="main-filter">
                <button 
                    className="filter-babies"
                    onClick={this.sorting.bind(this)}>
                    <div className="shapes">
                        <span className="shapes__item circle"></span>
                        <span className="shapes__item triangle"></span>
                        <span className="shapes__item square"></span>
                    </div>
                    <div className="shapes fill-yellow">
                        <span className="shapes__item circle"></span>
                        <span className="shapes__item triangle"></span>
                        <span className="shapes__item square"></span>
                    </div>
                </button>
            </nav>
        );
    }
}
