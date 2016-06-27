import React from 'react'

var classNames = require('classnames')

export default class FilterNav extends React.Component {
    constructor() {
        super()
    }

    sorting() {
        if(!this.props.isSorted)
            this.props.setSorting(true)
    }
    reverseSorting() {
        if(this.props.isSorted)
            this.props.setSorting(false)
    }

    mooveToGroup(e) {
        e.preventDefault()
        this.props.setGroupFocus(e.target.dataset.group)
    }

    render() {

        var mainFilterClasses = classNames({
            'main-filter': true,
            'open': this.props.isSorted
        })

        var filtersClasses = classNames({
            'filters': true,
            'active': this.props.setSorting
        })

        return(
            <nav className={mainFilterClasses}>
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
                <div className={filtersClasses}>
                    <button className="form--close" onClick={this.reverseSorting.bind(this)}></button>
                    <ul>
                        <li className="pattern-item">
                            <span><img src="images/pattern-cdp.png" alt="couleur héticiens chefs de projet"/></span>
                            <a 
                            href=""
                            className="tag"
                            onClick={this.mooveToGroup.bind(this)} data-group="cdps">Chefs de projet</a>
                        </li>
                        <li className="pattern-item">
                            <span><img src="images/pattern-dev.png" alt="couleur héticiens développeurs"/></span>
                            <a 
                            href=""
                            className="tag"
                            onClick={this.mooveToGroup.bind(this)} data-group="devs">Developpeurs</a>
                        </li>
                        <li className="pattern-item">
                            <span><img src="images/pattern-market.png" alt="couleur héticiens marketeux"/></span>
                            <a 
                            href=""
                            className="tag"
                            onClick={this.mooveToGroup.bind(this)} data-group="marketeux">Marketeux</a>
                        </li>
                        <li className="pattern-item">
                            <span><img src="images/pattern-design.png" alt="couleur héticiens designers"/></span>
                            <a 
                            href=""
                            className="tag"
                            onClick={this.mooveToGroup.bind(this)} data-group="designers">Designers</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
