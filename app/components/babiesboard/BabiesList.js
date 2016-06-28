import React, { Component, PropTypes } from "react"
import qwest from "qwest"
import GSAP from 'gsap'

import Baby from "./Baby"

export default class BabiesList extends Component {

	constructor() {
		super()

		this.state = {
			babies: [],
            boardItSelf: [],
            babiesPosition: [],
            scale: 5,
            widthWhiteSpace: 300,
            heightWhiteSpace: 250,
            nbCasesX: 0,
            nbCasesY: 0,
            caseWidth: 0,
            caseHeight: 0,
            safetyWidthDistance: 30,
            safetyHeightDistance: -20,
            goSort: false,
            isMooving: false,
            devArea: {
            	x: {
            		start: 0.02,
            		end: 0.40
            	},
            	y: {
            		start: 0,
            		end: 0.20
            	}
            },
            cdpArea: {
            	x: {
            		start: 0.1,
            		end: 0.35
            	},
            	y: {
            		start: 0.50,
            		end: 0.70
            	}
            },
            marketArea: {
            	x: {
            		start: 0.55,
            		end: 0.75
            	},
            	y: {
            		start: 0,
            		end: 0.10
            	}
            },
            designArea: {
            	x: {
            		start: 0.58,
            		end: 0.90
            	},
            	y: {
            		start: 0.39,
            		end: 0.60
            	}
            },
            freeZone: 0,
            devPositionsArea: [],
			designPositionsArea: [],
			cdpPositionsArea: [],
			marketPositionsArea: [],
			devs: [],
			designers: [],
			cdps: [],
			marketeux: [],
		}
	}

    setVirtualBoard(){
	    let nbCasesX = Math.floor(( this.props.boardWidth / ( this.state.babySpec.babyWidth + this.state.safetyWidthDistance ) ) * this.state.scale)
	    let caseWidth = this.props.boardWidth / nbCasesX
	    let nbCasesY = Math.floor(( this.props.boardHeight / ( this.state.babySpec.babyHeight + this.state.safetyHeightDistance ) ) * this.state.scale)
	    let caseHeight = this.props.boardHeight / nbCasesY
	    
	    this.setState({
	        nbCasesX: nbCasesX,
	        nbCasesY: nbCasesY,
	        caseWidth: caseWidth,
	        caseHeight: caseHeight,
	        boardItSelf: this.buildVirtualBoard(nbCasesX, nbCasesY, caseWidth, caseHeight)
	    })

	    this.setState({
	    	devPositionsArea: this.assignAreas(this.state.devArea),
	    	designPositionsArea: this.assignAreas(this.state.designArea),
	    	cdpPositionsArea: this.assignAreas(this.state.cdpArea),
	    	marketPositionsArea: this.assignAreas(this.state.marketArea),
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
    	// let limit = Math.floor(that.state.scale / 2)
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
                this.setState({
                    babies: response.babies
                })
            })
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
			rotation: 0,
			destination: null,
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

	setRandomDestination(arrayIds, arrayPositions) {

		let casesDest = {
			destination: null,
		}
		let fakeLengthX = arrayPositions.length - 1
		let xArrayLength = this.getArrayExactLength(arrayPositions)
		let xFirstIndex = (fakeLengthX - xArrayLength) + 1
		
		let arrayY = arrayPositions[fakeLengthX]
		let fakeLengthY = arrayY.length - 1
		let yArrayLength = this.getArrayExactLength(arrayY)
		let yFirstIndex = (fakeLengthY - yArrayLength) + 1

		for (var i = 0; i < arrayIds.length; i++) {

			var x = this.getRandomNumber(xFirstIndex, fakeLengthX),
				y = this.getRandomNumber(yFirstIndex, fakeLengthY)

			if(arrayPositions[x][y].free = 1) {
				this.state.babiesPosition[arrayIds[i]].destination = arrayPositions[x][y]
			} else {
				this.state.babiesPosition[arrayIds[i]].destination = {
					Xpx: 0,
					Ypx: 0,
					free: 1,
					x: 0,
					y: 0,
				}
			}
		}
	}

	sortBabies() {
		
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

	// Save initial babies positions
	fillPositions() {
		var tempArray = []

		for (var i = 0; i < this.state.babies.length; i++) {
			let pos = this.setRandomPosition()
			tempArray = tempArray.concat(pos)
		}

	    if(tempArray != null) {
	    	this.state.babiesPosition = tempArray
	    }

	    this.sortBabiesByTag()
	}

	sortBabiesByTag() {
		let designers = [],
			devs = [],
			cdps = [],
			marketeux = []

		for (var i = 0; i < this.state.babies.length; i++) {
			let tag = this.state.babies[i].tag

			if(tag == "Designer")
				designers.push(i)

			if(tag == "Développeur")
				devs.push(i)

			if(tag == "Chef de projet")
				cdps.push(i)

			if(tag == "Marketeux")
				marketeux.push(i)
		}

		if(designers != "" && devs != "" && cdps != "" && marketeux != "") {
			this.setRandomDestination(designers, this.state.designPositionsArea)
			this.setRandomDestination(devs, this.state.devPositionsArea)
			this.setRandomDestination(cdps, this.state.cdpPositionsArea)
			this.setRandomDestination(marketeux, this.state.marketPositionsArea)	
		}
	}

	assignAreas(areaConfig) {
		let array = []

		let leftStart = Math.floor(areaConfig.x.start * this.state.nbCasesX)
		let leftEnd   = Math.floor(areaConfig.x.end * this.state.nbCasesX)
		let topStart  = Math.floor(areaConfig.y.start * this.state.nbCasesY)
		let topEnd    = Math.floor(areaConfig.y.end * this.state.nbCasesY)

		for (var i = leftEnd; i >= leftStart; i--) {
			array[i] = []
			for (var j = topEnd; j >= topStart; j--) {
				array[i][j] = new this.boardCell(i, j, this.state.caseWidth, this.state.caseHeight, this)
			}
		}

		array = this.emptyArea(leftStart, array)
		return array
	}

	emptyArea(firstIndex, array) {
		let limit = Math.floor(array[firstIndex].length * this.state.freeZone)

		for (var x = firstIndex; x < array.length; x++) {
			for (var y = (array[firstIndex].length - limit); y < array[firstIndex].length; y++) {
				array[x][y].free = 0
			}
		}

		return array;
	}

	getRandomNumber(limitInf, limitSup) {	
 		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
 	}

 	getArrayExactLength(array) {
 		let arrayLength = 0;
 		for (var i = 0; i < array.length; i++) {
 		  if (array[i] !== undefined) {
 		    arrayLength++;
 		  }
 		}
 		return arrayLength
 	}

	componentWillMount() {
        this.loadBabySpec()
        this.loadBabies()
	}

	componentDidMount(){
		
	}

	componentDidUpdate(){
		
	}

	render() {
		/* ##### DO NOT REMOVE / FIX MAX CALL SIZE ERROR ##### */
		// Check here if we have babyPositions empty
		if(this.state.babiesPosition == "") {
			// If array with babies is not empty
			// Call setPosition for each baby and fill babyPositions
			if(this.state.babies != null) {
				this.fillPositions()
			}
		}

		return(
			<div className="babies-container" ref="babyContainer">
				{
					this.state.babies.map((baby, i) =>
						<Baby
							key={i}
							datas={baby}
							babySpec={this.state.babySpec}
							pos={this.state.babiesPosition[i]}
							test={this.refs.babyContainer}
							setSorting={this.props.setSorting}
							isSorted={this.props.isSorted}
							formDisplayed={this.props.formDisplayed}
                            toggleBabyIsHovered={this.props.toggleBabyIsHovered.bind(this)}
							id={i} />
          			) 
				}
			</div>
		);
	}

}
