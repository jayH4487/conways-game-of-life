class App {
    constructor() {
        this.cellPixelSize = 10
        this.rows = 100
        this.columns = 100
        this.grid = this.createGrid()
        this.isPlay = false
        this.intervalID = undefined

        this.$grid = document.querySelector(".grid")
        this.$step = document.querySelector(".step")
        this.$playPause = document.querySelector(".play-pause")
        this.$randomSeed = document.querySelector(".random-seed")
        
        this.$grid.setAttribute("width", `${this.columns * this.cellPixelSize}`)
        this.$grid.setAttribute("height", `${this.rows * this.cellPixelSize}`)
        this.displayGrid(this.grid)
        this.addEventListeners()

        this.nextGeneration = this.nextGeneration.bind(this)
    }

    addEventListeners() {
        this.$step.addEventListener("click", () => this.handleStepClick())
        this.$grid.addEventListener("click", (e) => this.handleGridClick(e))
        this.$playPause.addEventListener("click", () => this.handlePlayPauseClick())
        this.$randomSeed.addEventListener("click", () => this.handleRandomSeedClick())
        this.$grid.addEventListener("mousedown", (e) => this.handleGridMousedown(e))
    }


    createGrid() {
        const grid = Array(this.rows)
            .fill(0)
            .map(_ => Array(this.columns).fill(0))

       
        return grid
        
    }

    randomSeed(grid) {
        return grid.map(rowElement => rowElement.map(cell => Math.floor(Math.random() * 2)))
    }

    updateGrid(grid) {

        const north = (arr, rowIndex, colIndex) =>      arr[rowIndex - 1][colIndex + 0]
        const northEast = (arr, rowIndex, colIndex) =>  arr[rowIndex - 1][colIndex + 1]
        const east = (arr, rowIndex, colIndex) =>       arr[rowIndex - 0][colIndex + 1]
        const southEast = (arr, rowIndex, colIndex) =>  arr[rowIndex + 1][colIndex + 1]
        const south = (arr, rowIndex, colIndex) =>      arr[rowIndex + 1][colIndex + 0]
        const southWest = (arr, rowIndex, colIndex) =>  arr[rowIndex + 1][colIndex - 1]
        const west = (arr, rowIndex, colIndex) =>       arr[rowIndex + 0][colIndex - 1]
        const northWest = (arr, rowIndex, colIndex) =>  arr[rowIndex - 1][colIndex - 1]

        const getNeighbours = (arr, rowIndex, colIndex) => {

            const reducer = (acc, fn) => acc + fn(arr, rowIndex, colIndex)

            if (rowIndex === 0 && colIndex === 0) {
                return [east, southEast, south].reduce(reducer, 0)
            }
            if (rowIndex === 0 && colIndex === this.columns - 1) {
                return [south, southWest, west].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1 && colIndex === this.columns - 1) {
                return [west, northWest, north].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1 && colIndex === 0) {
                return [north, northEast, east].reduce(reducer, 0)
            }
            if (rowIndex === 0) {
                return [east, southEast, south, southWest, west].reduce(reducer, 0)
            }
            if (colIndex === this.columns - 1) {
                return [south, southWest, west, northWest, north].reduce(reducer, 0)
            }
            if (rowIndex === this.rows - 1) {
                return [west, northWest, north, northEast, east].reduce(reducer, 0)
            }
            if (colIndex === 0) {
                return [north, northEast, east, southEast, south].reduce(reducer, 0)
            }
            return [north, northEast, east, southEast, south, southWest, west, northWest]
                .reduce(reducer, 0)
        }

        const liveOrDie = (el, arr, rowIndex, colIndex) => {
            const neighbours = getNeighbours(arr, rowIndex, colIndex)
            
            const res = el === 0 && neighbours === 3 ? 1 :
            el === 1 && (neighbours === 2 || neighbours === 3) ? 1 :
            el = 0
            
            return res
        }

        return grid.map(
            (rowElement, rowIndex, arr) => rowElement.map(
                (colElement, colIndex) => liveOrDie(colElement, arr, rowIndex, colIndex) )
            )
        
        
    }

    nextGeneration() {
        this.grid = this.updateGrid(this.grid)
        this.displayGrid(this.grid)

    }

    handleStepClick() {
        this.nextGeneration()
    }

    handlePlayPauseClick() {
        this.isPlay = !this.isPlay
        this.$playPause.textContent = this.isPlay ? "Pause" : "Play"
        
        if (this.isPlay) {
            this.intervalID = setInterval(this.nextGeneration, 250)
        } else {
            clearInterval(this.intervalID)
        }
    }

    handleRandomSeedClick() {
        this.grid = this.randomSeed(this.grid)
        this.displayGrid(this.grid)
    }

    handleGridClick(e) {

        const [x, y] = e.target.dataset.cell.split(",").map(Number)
        this.grid = this.grid
            .map(
                (row, rowI) => row.map(
                    (el, colI) => rowI === y && colI === x ? Math.abs(el - 1) : el))
        
        this.displayGrid(this.grid)
    }

    handleGridMousedown(e) {
        if (e.detail > 1) e.preventDefault()
    }
    


    displayGrid(grid) {
        this.$grid.innerHTML = grid
            .map(
                (row, y) => row.map(
                    (el, x) => el === 1 ?
                    `
                        <rect
                            data-cell=${[x,y]}
                            x=${x * this.cellPixelSize}
                            y=${y * this.cellPixelSize}
                            rx="${this.cellPixelSize / 10}"
                            ry="${this.cellPixelSize / 10}"
                            width="${this.cellPixelSize}"
                            height="${this.cellPixelSize}"
                            style="
                                fill:${el === 1 ? "black" : "white"};
                                stroke-width:0.5;
                                stroke:rgb(0,0,0);
                                opacity:0.5
                            "
                        />
                    ` : ``
                ).join("")
            ).join("")
    }

}

const app = new App()