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
            devArea: {
            	x: {
            		start: 0.1,
            		end: 0.45
            	},
            	y: {
            		start: 0.1,
            		end: 0.40
            	}
            },
            cdpArea: {
            	x: {
            		start: 0.60,
            		end: 0.95
            	},
            	y: {
            		start: 0.05,
            		end: 0.45
            	}
            },
            marketArea: {
            	x: {
            		start: 0.1,
            		end: 0.45
            	},
            	y: {
            		start: 0.55,
            		end: 0.95
            	}
            },
            designArea: {
            	x: {
            		start: 0.55,
            		end: 0.95
            	},
            	y: {
            		start: 0.55,
            		end: 0.95
            	}
            },
            freeZone: 0.4,
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

	setRandomDestination() {
		////// COUCOU FUTUR MMOI
		///// JE SUIS AU MOMENT OU J'AI LES IDS DES BÉBÉS QUI SONT DEVS, DESIGNER, CDP, MARKET
		//// MAINTENANT JE DOIS BOUCLER DANS MON TABLEAU D'AREA POUR CHAQUE TYPE ET METTRE UNE POS RANDOM
		/// QUAND J'AURAI TOUT ÇA JE POURRA AJOUTER UN CHAMP 'dest' DANS MON this.state.babiesPositions
		//	VOILA BISOUS
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

			if(tag == "DesMarketeuxigner")
				marketeux.push(i)
		}

		this.setRandomDestination(designers)
		this.setRandomDestination(devs)
		this.setRandomDestination(cdps)
		this.setRandomDestination(marketeux)
	}

	sortBabies() {
		
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

	componentWillMount() {
        this.loadBabySpec()
        this.loadBabies()
	}

	componentDidMount(){
		
	}

	componentDidUpdate(){
		
	}

	render() {
		// let sortingBayby = false
		// if ( this.props.isSorting ){
		// 	sortingBayby = this.sortBabies()
		// }

		/* ##### DO NOT REMOVE / FIX MAX CALL SIZE ERROR ##### */
		// Check here if we have babyPositions empty
		if(this.state.babiesPosition == "") {
			// If array with babies is not empty
			// Call setPosition for each baby and fill babyPositions
			if(this.state.babies != null) {
				this.fillPositions()
			}
		}

		// console.log(this.state.devPositionsArea)
		console.log(this.state.babies)

		return(
			<div className="babies-container" ref="babyContainer">
				{
					this.state.babies.map((baby, i) =>
						<Baby
							key={i}
							datas={baby}
							babySpec={this.state.babySpec}
							pos={this.state.babiesPosition[i]}
							sortingBayby={this.sortBabies()}
							test = {this.refs.babyContainer}
							setDetailIsDisplayedProps={this.props.setDetailIsDisplayedProps}
							setBabyDetail={this.props.setBabyDetail}
							setSorting={this.props.setSorting}
							isSorting={this.props.isSorting}
							id={i} />
          			) 
				}
			</div>
		);
	}

}
