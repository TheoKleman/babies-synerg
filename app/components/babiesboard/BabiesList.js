import React, { Component, PropTypes } from "react"
import qwest from "qwest"
import Baby from "./Baby"
import GSAP from 'gsap'

export default class BabiesList extends Component {

	constructor() {
		super()

		this.state = {
			babies: [],
            boardItSelf: [],
            scale: 5,
            widthWhiteSpace: 300,
            heightWhiteSpace: 250,
            nbCasesX: 0,
            nbCasesY: 0,
            caseWidth: 0,
            caseHeight: 0,
            safetyWidthDistance: 30,
            safetyHeightDistance: -20,
		}
	}

    setVirtualBoard(){

	    let nbCasesX = Math.floor(( this.props.boardWidth / ( this.state.babySpec.babyWidth + this.state.safetyWidthDistance ) ) * this.state.scale)
	    let caseWidth = this.props.boardWidth / nbCasesX
	    let nbCasesY = Math.floor(( this.props.boardHeight / ( this.state.babySpec.babyHeight + this.state.safetyHeightDistance ) ) * this.state.scale)
	    let caseHeight = this.props.boardHeight / nbCasesY
	    // console.log(nbCasesX);
	    this.setState({
	        nbCasesX: nbCasesX,
	        nbCasesY: nbCasesY,
	        caseWidth: caseWidth,
	        caseHeight: caseHeight,
	        boardItSelf: this.buildVirtualBoard(nbCasesX, nbCasesY, caseWidth, caseHeight)
	    })

	    // console.log("caseHeight : "+caseWidth);
	    // console.log("caseWidth : "+caseHeight);
	    // console.log("nbCaseX : "+nbCasesX);
	    // console.log("nbCaseY : "+nbCasesY);

	}

    buildVirtualBoard(nbCasesX, nbCasesY, caseWidth, caseHeight){
        let array = []
        for ( var i=0; i < nbCasesX; i++ ){
            array[i] = []
            for ( var j=0; j < nbCasesY; j++ ){
                array[i][j] = new this.boardCell(i, j, caseWidth, caseHeight, this)
            }
        }
        array = this.whiteSpace(this.state.widthWhiteSpace, this.state.heightWhiteSpace, nbCasesX, nbCasesY, caseWidth, caseHeight, array)
        return array
    }

    whiteSpace(width, height, nbCasesX, nbCasesY, caseWidth, caseHeight, array){
    	let centerX = Math.ceil(nbCasesX / 2) - 1
    	let centerY = Math.ceil(nbCasesY / 2) - 1
    	let center = array[centerX][centerY]
    	array[centerX][centerY].free = 0

    	for ( var i=0; i < nbCasesX; i++ ){
            for ( var j=0; j < nbCasesY; j++ ){
            	let difX = array[i][j].Xpx - center.Xpx
            	let difY = array[i][j].Ypx - center.Ypx
                if ( Math.pow(difX / width, 2) + Math.pow(difY / height, 2) <= 1 ){
                	array[i][j].free = 0
                } 
            }
        }
    	return array
    }

    boardCell(x, y, caseWidth, caseHeight, that){
    	let limit = Math.floor(that.state.scale / 2)
        return {
            "Xpx": (x * caseWidth),
            "Ypx": (y * caseHeight) - that.state.safetyHeightDistance,
            "x": x,
            "y": y,
            "free" : 1
        }
    }

    loadBabies() {
        qwest
            .get("/json/babies.json")
            .then((xhr, response) => {
                console.log("response")
                console.log(response.babies)
                this.setState({
                    babies: response.babies
                })
            });
    }

    loadBabySpec() { 
        qwest
            .get("/json/babySpec.json")
            .then((xhr, response) => {
                this.setState({
                    babySpec: response
                })
                this.setVirtualBoard();
            })
    }

	setRandomPosition(){
		let limit = Math.floor(this.state.scale / 2)
		let randX = limit + Math.round(Math.random() * ( this.state.boardItSelf.length - (limit * 2 ) ))
		let randY = limit + Math.round(Math.random() * ( this.state.boardItSelf[0].length - (limit * 2 ) ))
		if ( this.checkIfSpotFree(randX, randY) ){
			let position = this.setBabyPosition(randX, randY)
			return position
		} else {
			return this.setRandomPosition()
		}
	}

	setBabyPosition(x, y){
		let limit = Math.floor(this.state.scale / 2)
		let casesOwn = {
			origin: null,
			otherCases: [],
			rotation: 0
		}
		for ( var i = (x - limit); i <= (x + limit); i++ ){
			for ( var j = (y - limit); j <= (y + limit); j++ ){

				if ( Math.sqrt( Math.pow(i - x, 2) ) + Math.sqrt( Math.pow(j - y, 2) ) <= limit ){
					if ( typeof this.state.boardItSelf[i] != "undefined" && typeof this.state.boardItSelf[i][j] != "undefined" ){
						if ( this.state.boardItSelf[i][j].free != 1 ){
							return false
						} else {
							this.state.boardItSelf[i][j].free = 0
							if ( i == x && j == y ){
								casesOwn.origin = this.state.boardItSelf[i][j]
							} else {
								casesOwn.otherCases.push(this.state.boardItSelf[i][j])
							}
						}
					} else {
						return false
					}
				}
			}
		}
		return casesOwn
	}

	checkIfSpotFree(x, y){
		let limit = Math.floor(this.state.scale / 2)
		for ( var i = (x - limit); i <= (x + limit); i++ ){
			for ( var j = (y - limit); j <= (y + limit); j++ ){
				if ( Math.sqrt( Math.pow(i - x, 2) ) + Math.sqrt( Math.pow(j - y, 2) ) <= limit ){
					if ( typeof this.state.boardItSelf[i] != "undefined" && typeof this.state.boardItSelf[i][j] != "undefined" ){
						if ( this.state.boardItSelf[i][j].free != 1 ){
							return false
						}
					} else {
						return false
					}
				}
			}
		}
		return true
	}

	componentWillMount() {
        this.loadBabySpec()
        this.loadBabies()
	}

	componentDidMount(){
		// console.log(this.refs.babyContainer);
	}

	render() {
		return(
			<div className="babies-container" ref="babyContainer">
				{
					this.state.babies.map((baby, i) =>
						<Baby
							key={i}
							datas={baby}
							babySpec={this.state.babySpec}
							pos={this.setRandomPosition()}
							test = {this.refs.babyContainer}
							id={i} />
          			) 
				}
			</div>
		);
	}

}
