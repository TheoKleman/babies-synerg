import React, { Component, PropTypes } from "react"
import qwest from "qwest"
import GSAP from 'gsap'

import Baby from "./Baby"

export default class BabiesList extends Component {

	constructor() {
		super()

		this.state = {
			babies: [],
            babiesPosition: [],
            goSort: false,
            isMooving: false,
		}

		this.scale = 5
		this.freeZone = 0
		this.devArea = {
			x: {
				start: 0.02,
				end: 0.40
			},
			y: {
				start: 0,
				end: 0.20
			}
		},
		this.cdpArea = {
			x: {
				start: 0.1,
				end: 0.35
			},
			y: {
				start: 0.50,
				end: 0.65
			}
		},
		this.marketArea = {
			x: {
				start: 0.55,
				end: 0.75
			},
			y: {
				start: 0,
				end: 0.10
			}
		},
		this.designArea = {
			x: {
				start: 0.58,
				end: 0.90
			},
			y: {
				start: 0.39,
				end: 0.60
			}
		}
		this.widthWhiteSpace = 300
		this.heightWhiteSpace = 250
		this.safetyWidthDistance = 30
		this.safetyHeightDistance = -20
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.spacebarDown != this.props.spacebarDown) {
			return true
		} else if(nextProps.formDisplayed != this.props.formDisplayed) {
			return true
		} else if (nextProps.isSorted != this.props.isSorted) {
			return true
		} else if (nextState.babies != this.state.babies) {
			return true
		} else if (nextProps.isSoundActive != this.props.isSoundActive) {
			return true
		} else if(nextProps.viewportSize != this.props.viewportSize) {
			return true
		} else {
			return false
		}
	}

    setVirtualBoard(){
	    let nbCasesX = Math.floor(( this.props.boardWidth / ( this.state.babySpec.babyWidth + this.safetyWidthDistance ) ) * this.scale)
	    let caseWidth = this.props.boardWidth / nbCasesX
	    let nbCasesY = Math.floor(( this.props.boardHeight / ( this.state.babySpec.babyHeight + this.safetyHeightDistance ) ) * this.scale)
	    let caseHeight = this.props.boardHeight / nbCasesY
	    
	    this.setState({
	        nbCasesX: nbCasesX,
	        nbCasesY: nbCasesY,
	        caseWidth: caseWidth,
	        caseHeight: caseHeight,
	        boardItSelf: this.buildVirtualBoard(nbCasesX, nbCasesY, caseWidth, caseHeight)
	    })

	    this.setState({
	    	devPositionsArea: this.assignAreas(this.devArea),
	    	designPositionsArea: this.assignAreas(this.designArea),
	    	cdpPositionsArea: this.assignAreas(this.cdpArea),
	    	marketPositionsArea: this.assignAreas(this.marketArea),
	    })
	}

    buildVirtualBoard(nbCasesX, nbCasesY, caseWidth, caseHeight){
        let array = []
        for ( var i=0; i < nbCasesX; i++ ){
            array[i] = []
            for ( var j=0; j < nbCasesY; j++ ){
                array[i][j] = new this.boardCell(i, j, caseWidth, caseHeight, this)
            }
        }
        array = this.whiteSpace(this.widthWhiteSpace, this.heightWhiteSpace, nbCasesX, nbCasesY, caseWidth, caseHeight, array)
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
    	// let limit = Math.floor(that.scale / 2)
        return {
            "Xpx": (x * caseWidth),
            "Ypx": (y * caseHeight) - that.safetyHeightDistance,
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
		let limit = Math.floor(this.scale / 2)
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
		let limit = Math.floor(this.scale / 2)
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
		let limit = Math.floor(this.scale / 2)
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
		let creatifs = [],
			devs = [],
			cdps = [],
			marketeux = []

		for (var i = 0; i < this.state.babies.length; i++) {
			let tag = this.state.babies[i].tag

			if(tag == "Créatif")
				creatifs.push(i)

			if(tag == "Développeur")
				devs.push(i)

			if(tag == "Chef de projet")
				cdps.push(i)

			if(tag == "Marketeux")
				marketeux.push(i)
		}

		if(creatifs != "" && devs != "" && cdps != "" && marketeux != "") {
			this.setRandomDestination(creatifs, this.state.designPositionsArea)
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
		let limit = Math.floor(array[firstIndex].length * this.freeZone)

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

	componentWillUpdate(nextProps, nextState) {

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

		// console.log("render babiesList")

		return(
			<div className="babies-container" ref="babyContainer">
				{
					this.state.babies.map((baby, i) =>
						<Baby
							key={i}
							datas={baby}
							babySpec={this.state.babySpec}
							pos={this.state.babiesPosition[i]}
							setSorting={this.props.setSorting}
							isSorted={this.props.isSorted}
							formDisplayed={this.props.formDisplayed}
							isSoundActive={this.props.isSoundActive}
							boardWidth={this.props.boardWidth}
							boardHeight={this.props.boardHeight}
							viewportSize={this.props.viewportSize}
							spacebarDown={this.props.spacebarDown}
							id={i} />
          			) 
				}
			</div>
		);
	}

}
